/* Fortschritt im Browser speichern (localStorage). Funktioniert auch ohne Speicher. */
(function (TM) {
  const KEY = 'tastaturmensch:v1';
  const fresh = () => ({ quiz: null, done: {}, hideKnown: false });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(fresh(), JSON.parse(raw)) : fresh();
    } catch (e) {
      return fresh();
    }
  }

  let state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* privates Fenster o. Ä. – dann eben ohne Speichern */
    }
  }

  TM.store = {
    get: () => state,
    set(patch) {
      Object.assign(state, patch);
      save();
    },
    markDone(id) {
      state.done[id] = Date.now();
      save();
    },
    isDone: (id) => Boolean(state.done[id]),
    reset() {
      state = fresh();
      save();
    },
  };
})(window.TM);
