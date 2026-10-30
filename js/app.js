/* Start: einfacher Hash-Router (#/quiz, #/reise, #/lektion/<id>, #/spickzettel). */
(function (TM) {
  const main = document.getElementById('main');
  const pill = document.getElementById('progress-pill');
  let current = null;

  const routes = [
    [/^#?\/?$/, 'home'],
    [/^#\/quiz$/, 'quiz'],
    [/^#\/ergebnis$/, 'result'],
    [/^#\/reise$/, 'journey'],
    [/^#\/lektion\/([\w-]+)$/, 'lesson', (m) => ({ id: m[1] })],
    [/^#\/spickzettel$/, 'cheatsheet'],
  ];

  function syncPlatformSwitch() {
    const p = TM.platform.current();
    document.querySelectorAll('[data-platform-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.platformBtn === p)));
  }

  TM.app = {
    refresh: () => route(),
    setPlatform(p) {
      if (p === TM.platform.current() && !TM.platform.isAuto()) return;
      TM.platform.set(p);
      syncPlatformSwitch();
      route();
      TM.ui.toast(p === 'mac' ? 'Alle Kombis jetzt für den <strong>Mac</strong>.' : 'Alle Kombis jetzt für <strong>Windows</strong>.');
    },
  };

  document.querySelectorAll('[data-platform-btn]').forEach((b) =>
    b.addEventListener('click', () => TM.app.setPlatform(b.dataset.platformBtn))
  );

  TM.ui.updatePill = function () {
    const st = TM.store.get();
    const s = TM.journey.stats();
    const show = Boolean(st.quiz) || s.done > 0;
    pill.hidden = !show;
    if (show) {
      pill.innerHTML = `<span class="pill-track" aria-hidden="true"><span style="transform:scaleX(${s.progress})"></span></span><span>${s.done}/${s.done + s.todo}</span>`;
      pill.setAttribute('aria-label', `${s.done} von ${s.done + s.todo} Lektionen geschafft – zur Lernreise`);
    }
  };

  function route() {
    const hash = location.hash || '#/';
    let view = 'home';
    let params = {};
    for (const [re, name, fn] of routes) {
      const m = hash.match(re);
      if (m) {
        view = name;
        params = fn ? fn(m) : {};
        break;
      }
    }

    if (current && current.destroy) current.destroy();
    current = null;
    TM.keys.clearLatch();
    TM.keys.setSticky(false);
    TM.ui.guardUnload(false);

    const impl = TM.views[view];
    document.title = impl.title && view !== 'home' ? `${impl.title} – Tastaturmensch` : `Tastaturmensch – Tastenkombinationen für ${TM.platform.name()} lernen`;
    window.scrollTo(0, 0);
    main.classList.remove('view-enter');
    void main.offsetWidth;
    main.classList.add('view-enter');
    current = impl.render(main, params) || null;

    document.querySelectorAll('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === view || (view === 'lesson' && a.dataset.nav === 'journey');
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    TM.ui.updatePill();
  }

  window.addEventListener('hashchange', route);
  syncPlatformSwitch();
  route();
})(window.TM);
