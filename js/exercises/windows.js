/*
 * Übungstyp "windows": Fenster mit Win+Pfeiltasten andocken und zwischen Monitoren schieben.
 * Das Verhalten ist dem von Windows 10/11 nachempfunden.
 *
 * Config:
 *   { type: 'windows',
 *     monitors: 1 | 2,
 *     start: { monitor: 0, snap: 'normal' },   // normal | left | right | max | tl | tr | bl | br | min
 *     app: 'Notizen',
 *     steps: [{ say, target: 'Win+ArrowLeft', expect: { snap: 'left', monitor: 0 } }],
 *     mode: 'mac' }   // optional: Fenster-Anordnen von macOS 15 (Fn+Ctrl+Pfeile, Fn+Ctrl+F)
 */
(function (TM) {
  const { esc } = TM.ui;

  const RECTS = {
    normal: [16, 12, 60, 64],
    left: [0, 0, 50, 100],
    right: [50, 0, 50, 100],
    max: [0, 0, 100, 100],
    tl: [0, 0, 50, 50],
    tr: [50, 0, 50, 50],
    bl: [0, 50, 50, 50],
    br: [50, 50, 50, 50],
    min: [16, 12, 60, 64],
    th: [0, 0, 100, 50],
    bh: [0, 50, 100, 50],
  };
  const SNAP_TEXT = {
    normal: 'frei schwebend', left: 'links angedockt', right: 'rechts angedockt', max: 'maximiert',
    th: 'obere Hälfte', bh: 'untere Hälfte',
    tl: 'oben links (Viertel)', tr: 'oben rechts (Viertel)', bl: 'unten links (Viertel)', br: 'unten rechts (Viertel)', min: 'minimiert',
  };

  function transition(s, combo, monitors) {
    const n = Object.assign({}, s);
    const last = monitors - 1;
    switch (combo) {
      case 'Win+ArrowLeft':
        if (['left', 'tl', 'bl'].includes(s.snap)) {
          if (s.monitor > 0) { n.monitor--; n.snap = 'right'; }
        } else if (s.snap === 'right') n.snap = 'normal';
        else if (s.snap === 'tr') n.snap = 'tl';
        else if (s.snap === 'br') n.snap = 'bl';
        else if (s.snap !== 'min') n.snap = 'left';
        break;
      case 'Win+ArrowRight':
        if (['right', 'tr', 'br'].includes(s.snap)) {
          if (s.monitor < last) { n.monitor++; n.snap = 'left'; }
        } else if (s.snap === 'left') n.snap = 'normal';
        else if (s.snap === 'tl') n.snap = 'tr';
        else if (s.snap === 'bl') n.snap = 'br';
        else if (s.snap !== 'min') n.snap = 'right';
        break;
      case 'Win+ArrowUp':
        if (s.snap === 'min') n.snap = s.prev || 'normal';
        else if (s.snap === 'normal') n.snap = 'max';
        else if (s.snap === 'left') n.snap = 'tl';
        else if (s.snap === 'right') n.snap = 'tr';
        else if (s.snap === 'bl') n.snap = 'left';
        else if (s.snap === 'br') n.snap = 'right';
        else if (s.snap === 'tl' || s.snap === 'tr') n.snap = 'max';
        break;
      case 'Win+ArrowDown':
        if (s.snap === 'max') n.snap = 'normal';
        else if (s.snap === 'left') n.snap = 'bl';
        else if (s.snap === 'right') n.snap = 'br';
        else if (s.snap === 'tl') n.snap = 'left';
        else if (s.snap === 'tr') n.snap = 'right';
        else if (s.snap !== 'min') { n.prev = s.snap; n.snap = 'min'; }
        break;
      case 'Win+Shift+ArrowLeft':
        if (s.monitor > 0) n.monitor--;
        break;
      case 'Win+Shift+ArrowRight':
        if (s.monitor < last) n.monitor++;
        break;
      default:
        return null;
    }
    return n;
  }

  /* macOS 15+: jede Kombi setzt direkt eine Position. */
  const MAC_KEYS = {
    'Fn+Ctrl+ArrowLeft': 'left',
    'Fn+Ctrl+ArrowRight': 'right',
    'Fn+Ctrl+ArrowUp': 'th',
    'Fn+Ctrl+ArrowDown': 'bh',
    'Fn+Ctrl+F': 'max',
  };
  function transitionMac(s, combo) {
    const snap = MAC_KEYS[combo];
    return snap ? Object.assign({}, s, { snap }) : null;
  }

  TM.registerExercise('windows', {
    mount(stage, cfg, api) {
      const monitors = cfg.monitors || 1;
      const steps = cfg.steps || [];
      let state = Object.assign({ monitor: 0, snap: 'normal' }, cfg.start);
      let i = 0;

      const monHtml = (m) => `
        <div class="monitor">
          <div class="monitor-screen">
            <div class="monitor-work" data-m="${m}"></div>
            <div class="monitor-taskbar"><span class="tb-start" aria-hidden="true">${TM.ui.WIN_LOGO}</span><button type="button" class="tb-app" data-m="${m}" aria-label="${esc(cfg.app || 'Notizen')} in der Taskleiste">N</button></div>
          </div>
          <div class="monitor-label">${monitors > 1 ? `Monitor ${m + 1}` : 'Dein Bildschirm'}</div>
        </div>`;

      stage.innerHTML = `
        <div class="desk desk-${monitors}">${Array.from({ length: monitors }, (_, m) => monHtml(m)).join('')}</div>
        <p class="desk-state" aria-live="polite"></p>`;

      const win = document.createElement('div');
      win.className = 'sim-window';
      win.innerHTML = `
        <div class="win-titlebar"><span class="win-title">${esc(cfg.app || 'Notizen')}</span><span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <div class="sim-window-body"><i></i><i></i><i></i><i></i></div>`;

      const stateEl = stage.querySelector('.desk-state');

      function place(animate) {
        const work = stage.querySelector(`.monitor-work[data-m="${state.monitor}"]`);
        const apply = () => {
          if (win.parentElement !== work) work.appendChild(win);
          const [x, y, w, h] = RECTS[state.snap];
          Object.assign(win.style, { left: x + '%', top: y + '%', width: w + '%', height: h + '%' });
          win.classList.toggle('is-min', state.snap === 'min');
          win.classList.toggle('is-snapped', state.snap !== 'normal' && state.snap !== 'min');
        };
        if (animate && win.parentElement) TM.ui.flip(win, apply, 300);
        else apply();
        stage.querySelectorAll('.tb-app').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.m) === state.monitor));
        stateEl.textContent = `Fenster: ${SNAP_TEXT[state.snap]}${monitors > 1 ? ` · Monitor ${state.monitor + 1}` : ''}`;
      }

      function check() {
        const st = steps[i];
        if (!st) return;
        const ex = st.expect || {};
        const ok = Object.keys(ex).every((k) => state[k] === ex[k]);
        if (ok) {
          api.say(st.ok || 'Sitzt!', 'ok');
          i++;
          if (i >= steps.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
            api.targets(steps[i].target || []);
          }
        }
      }

      stage.querySelectorAll('.tb-app').forEach((b) =>
        b.addEventListener('click', () => {
          if (state.snap === 'min') {
            state = Object.assign({}, state, { snap: state.prev || 'normal' });
            place(true);
            check();
          }
        })
      );

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo') return;
        const c = TM.keys.canon(e.combo);
        const next = cfg.mode === 'mac' ? transitionMac(state, c) : transition(state, c, monitors);
        if (!next) {
          if (TM.keys.looksLikeAttempt(e) && steps[i]) api.wrong(e.combo, steps[i].target);
          return;
        }
        if (e.event) e.event.preventDefault();
        const moved = next.monitor !== state.monitor || next.snap !== state.snap;
        state = next;
        place(true);
        if (!moved) api.say('Weiter geht es in diese Richtung nicht – probier eine andere Pfeiltaste.', 'info');
        check();
      });

      place(false);
      api.steps(steps.map((s) => s.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].target || [] : []);

      return { destroy: off };
    },
  });
})(window.TM);
