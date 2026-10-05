const toggle = document.getElementById('toggle');
const store = (typeof browser !== 'undefined' ? browser : chrome).storage;
store.local.get('enabled').then((res) => {
  toggle.checked = res.enabled !== false;
}).catch(() => { toggle.checked = true; });
toggle.addEventListener('change', () => {
  store.local.set({ enabled: toggle.checked });
});
