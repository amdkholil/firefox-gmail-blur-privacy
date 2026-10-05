(() => {
  console.log('[gmail-blur] content script loaded on', location.href);

  // Inject CSS via JS so blurring works even if blur.css fails to load
  const style = document.createElement('style');
  style.textContent = `
    .gbp-blur { filter: blur(6px) !important; transition: filter .15s; cursor: pointer; }
    .gbp-blur:hover, .gbp-blur.gbp-reveal { filter: none !important; }
    tr.zA:hover .gbp-blur, div[role="listitem"]:hover .gbp-blur, table[role="grid"] tr:hover .gbp-blur { filter: none !important; }
    tr.zA.gbp-reveal .gbp-blur, div[role="listitem"].gbp-reveal .gbp-blur, table[role="grid"] tr.gbp-reveal .gbp-blur { filter: none !important; }
  `;
  (document.head || document.documentElement).appendChild(style);

  const SELECTORS = [
    // Classic / stable inbox row selectors (most reliable)
    'tr.zA',               // entire inbox row
    'span.zF',             // sender (classic)
    'span.bqe',            // sender (new UI)
    'span.bog',            // subject + snippet
    'span.bA4',            // sender container
    // Legacy Gmail list selectors (still present in 2024-2026 DOM)
    'td.yX',               // sender cell wrapper
    'span.yP, span.yX',    // sender name
    'div.y6',              // subject + snippet container
    'span.y2',             // snippet grey text
    'div.yW',              // row text wrapper
    'div.a4W',             // subject in row
    // New UI fallbacks
    'div[role="listitem"]',
    'div[role="list"] [role="listitem"]',
    'table[role="grid"] tr',
    // Open message view
    'h2.hP',               // subject header
    'div.ha',              // subject container
    'span.gD',             // sender in header
    'span.go',             // sender email
    'div.a3s',             // message body
    'div.adn',
    'div.gs',              // thread container
  ];

  // storage helper: works with Firefox `browser` (promise) and Chrome `chrome` (callback)
  function getStore() {
    try {
      if (typeof browser !== 'undefined' && browser?.storage?.local) return { type: 'browser', api: browser.storage };
      if (typeof chrome !== 'undefined' && chrome?.storage?.local) return { type: 'chrome', api: chrome.storage };
    } catch {}
    return null;
  }
  const storeRef = getStore();
  const store = storeRef?.api;

  function storeGet(key, fallback) {
    return new Promise((resolve) => {
      if (!storeRef) return resolve(fallback);
      try {
        if (storeRef.type === 'browser') {
          store.local.get(key).then((res) => resolve(res), () => resolve(fallback));
        } else {
          store.local.get(key, (res) => {
            if (chrome.runtime.lastError) resolve(fallback);
            else resolve(res || fallback);
          });
        }
      } catch { resolve(fallback); }
    });
  }

  function storeChanged(cb) {
    try {
      if (store?.onChanged?.addListener) store.onChanged.addListener(cb);
    } catch {}
  }
  let enabled = true;

  async function loadState() {
    const res = await storeGet('enabled', { enabled: true });
    // res can be {enabled: bool} or bool
    enabled = (res && typeof res === 'object' && 'enabled' in res) ? res.enabled !== false : res !== false;
    console.log('[gmail-blur] enabled =', enabled);
  }

  function applyBlur(root = document) {
    let count = 0;
    for (const sel of SELECTORS) {
      try {
        root.querySelectorAll(sel).forEach((el) => {
          count++;
          if (enabled) {
            el.classList.add('gbp-blur');
            el.classList.remove('gbp-hidden');
          } else {
            el.classList.remove('gbp-blur', 'gbp-reveal');
          }
        });
      } catch {}
    }
    // If root itself matches (added node is the row itself)
    if (root.nodeType === 1 && root.matches) {
      for (const sel of SELECTORS) {
        try {
          if (root.matches(sel)) {
            count++;
            if (enabled) root.classList.add('gbp-blur');
            else root.classList.remove('gbp-blur', 'gbp-reveal');
          }
        } catch {}
      }
    }
    if (count > 0) console.log('[gmail-blur] blurred', count, 'nodes');
    else console.log('[gmail-blur] applyBlur: 0 nodes (selector mungkin kedaluwarsa). url=', location.href, 'rows=', document.querySelectorAll('tr.zA, div[role="listitem"]').length);
    return count;
  }

  // Click toggles reveal per ROW in list view, per element in message view
  const ROW_SEL = 'tr.zA, div[role="listitem"], table[role="grid"] tr';
  document.addEventListener('click', (e) => {
    const row = e.target.closest?.(ROW_SEL);
    if (row && (row.classList.contains('gbp-blur') || row.querySelector('.gbp-blur'))) {
      row.classList.toggle('gbp-reveal');
      return;
    }
    const t = e.target.closest?.('.gbp-blur');
    if (t) t.classList.toggle('gbp-reveal');
  }, true);

  // Gmail is a SPA — observe for new nodes (debounced, Gmail reuses rows)
  let pending = false;
  const observer = new MutationObserver((mutations) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) applyBlur(n);
        });
      }
      // Fallback: Gmail sometimes updates text in existing rows without adding nodes.
      // Re-scan document at most once per batch if row count grew.
      if (mutations.length > 5) applyBlur(document);
    });
  });

  try {
    storeChanged((changes) => {
      if (changes.enabled) {
        enabled = changes.enabled.newValue !== false;
        applyBlur(document);
      }
    });
  } catch {}

  (async () => {
    await loadState();
    applyBlur(document);
    // Re-apply a few times — Gmail lazy-loads rows after idle
    [500, 1500, 3000].forEach((t) => setTimeout(() => applyBlur(document), t));
    observer.observe(document.documentElement, { childList: true, subtree: true });
  })();
})();
