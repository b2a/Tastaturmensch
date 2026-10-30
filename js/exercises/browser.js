/*
 * Übungstyp "browser": nachgebauter Browser mit Tabs, Adressleiste, Zoom und Suche.
 * Achtung: Strg+T / Strg+W echt gedrückt würden den echten Browser-Tab steuern –
 * deshalb Strg auf der Bildschirmtastatur einrasten lassen.
 *
 * Config:
 *   { type: 'browser',
 *     tabs: [{ title: 'Wetter', url: 'wetter.de' }, ...],
 *     steps: [{ say, combo: 'Ctrl+T', ok? }] }
 */
(function (TM) {
  const { esc } = TM.ui;

  TM.registerExercise('browser', {
    mount(stage, cfg, api) {
      const steps = cfg.steps || [];
      const s = {
        tabs: (cfg.tabs || [{ title: 'Startseite', url: 'start.de' }]).map((t) => Object.assign({}, t)),
        active: 0,
        closed: [],
        zoom: 100,
        addr: false,
        find: false,
        star: false,
      };
      let i = 0;
      let newCount = 0;

      stage.innerHTML = `
        <div class="browser">
          <div class="br-tabs" role="tablist" aria-label="Tabs"></div>
          <div class="br-bar">
            <span class="br-nav" aria-hidden="true">‹ › ⟳</span>
            <div class="br-address"><span class="br-url"></span><span class="br-star" aria-hidden="true">☆</span></div>
            <span class="br-zoom"></span>
          </div>
          <div class="br-find" hidden>Suchen: <span class="br-find-field">|</span> <span class="br-find-count">0/0</span></div>
          <div class="br-page"><div class="br-page-inner"></div></div>
        </div>`;

      const $ = (sel) => stage.querySelector(sel);

      function render(flash) {
        $('.br-tabs').innerHTML = s.tabs
          .map((t, x) => `<span class="br-tab${x === s.active ? ' is-active' : ''}${flash === 'new' && x === s.active ? ' is-new' : ''}" role="tab" aria-selected="${x === s.active}">${esc(t.title)}</span>`)
          .join('') + '<span class="br-plus" aria-hidden="true">+</span>';
        const t = s.tabs[s.active];
        $('.br-url').textContent = t.url || 'Suchen oder Adresse eingeben';
        $('.br-address').classList.toggle('is-focused', s.addr);
        $('.br-star').textContent = s.star ? '★' : '☆';
        $('.br-zoom').textContent = s.zoom === 100 ? '' : `${s.zoom} %`;
        $('.br-find').hidden = !s.find;
        const inner = $('.br-page-inner');
        inner.style.transform = `scale(${s.zoom / 100})`;
        inner.innerHTML = t.url
          ? `<h3>${esc(t.title)}</h3><p>${esc(t.text || 'Willkommen auf ' + t.url)}</p><i></i><i></i><i></i>`
          : `<h3>Neuer Tab</h3><p>Leere Seite – tipp oben eine Adresse ein.</p>`;
        if (flash === 'reload') {
          inner.classList.remove('is-reloading');
          void inner.offsetWidth;
          inner.classList.add('is-reloading');
        }
      }

      const ACTIONS = {
        'Ctrl+T': () => {
          newCount++;
          s.tabs.splice(s.active + 1, 0, { title: newCount > 1 ? `Neuer Tab ${newCount}` : 'Neuer Tab', url: '' });
          s.active++;
          return 'new';
        },
        'Ctrl+W': () => {
          if (s.tabs.length === 1) return api.say('Den letzten Tab lassen wir offen.', 'info'), false;
          s.closed.push({ tab: s.tabs[s.active], idx: s.active });
          s.tabs.splice(s.active, 1);
          s.active = Math.min(s.active, s.tabs.length - 1);
        },
        'Ctrl+Shift+T': () => {
          const c = s.closed.pop();
          if (!c) return api.say('Es gibt keinen geschlossenen Tab zum Zurückholen.', 'info'), false;
          s.tabs.splice(c.idx, 0, c.tab);
          s.active = c.idx;
          return 'new';
        },
        'Ctrl+Tab': () => { s.active = (s.active + 1) % s.tabs.length; },
        'Ctrl+Shift+Tab': () => { s.active = (s.active - 1 + s.tabs.length) % s.tabs.length; },
        'Ctrl+L': () => { s.addr = true; },
        F6: () => { s.addr = true; },
        'Ctrl+Plus': () => { s.zoom = Math.min(200, s.zoom + 10); },
        'Ctrl+Minus': () => { s.zoom = Math.max(50, s.zoom - 10); },
        'Ctrl+0': () => { s.zoom = 100; },
        'Ctrl+F': () => { s.find = true; },
        'Ctrl+D': () => { s.star = !s.star; },
        F5: () => 'reload',
        'Ctrl+R': () => 'reload',
        Escape: () => { s.find = false; s.addr = false; },
      };
      for (let n = 1; n <= 9; n++) {
        ACTIONS['Ctrl+' + n] = () => { s.active = n === 9 ? s.tabs.length - 1 : Math.min(n - 1, s.tabs.length - 1); };
      }
      // Für den Mac umrechnen (Strg → Cmd, F5 → Cmd+R …)
      const LOOKUP = {};
      Object.keys(ACTIONS).forEach((k) => {
        LOOKUP[TM.keys.canon(TM.platform.map(k))] = ACTIONS[k];
      });

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo') return;
        const c = TM.keys.canon(e.combo);
        const act = LOOKUP[c];
        if (!act) {
          if (TM.keys.looksLikeAttempt(e) && steps[i]) api.wrong(e.combo, steps[i].combo);
          return;
        }
        if (e.event) e.event.preventDefault();
        const res = act();
        if (res === false) return;
        render(res);
        const st = steps[i];
        if (st && TM.keys.matches(c, st.combo)) {
          api.say(st.ok || `Richtig: ${TM.ui.rich(`{${c}}`)}`, 'ok');
          i++;
          if (i >= steps.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
            api.targets(steps[i].combo);
          }
        } else if (st) {
          api.say(`${TM.ui.rich(`{${c}}`)} hat funktioniert – gesucht ist aber gerade ${TM.ui.rich(`{${[].concat(st.combo)[0]}}`)}.`, 'info');
        }
      });

      render();
      api.steps(steps.map((x) => x.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].combo : []);

      return { destroy: off };
    },
  });
})(window.TM);
