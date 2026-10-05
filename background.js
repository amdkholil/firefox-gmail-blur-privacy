// Init default state. (No onClicked here — popup.html handles the toggle,
// because action.onClicked does NOT fire when a popup is set.)
const store = (typeof browser !== 'undefined' ? browser : chrome).storage;
store.local.get('enabled').then((res) => {
  if (typeof res.enabled === 'undefined') store.local.set({ enabled: true });
}).catch(() => {});
