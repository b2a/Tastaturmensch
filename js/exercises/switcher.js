/*
 * Übungstyp "switcher": Alt+Tab – Alt festhalten, Tab mehrmals tippen, Alt loslassen.
 * Weil Windows Alt+Tab selbst abfängt, rastet Alt auf der Bildschirmtastatur ein,
 * bis man es noch einmal anklickt (= loslassen).
 *
 * Config:
 *   { type: 'switcher',
 *     windows: [{ name: 'Word', short: 'W', color: '#2b579a' }, ...],   // erstes = aktiv
 *     targets: ['Musik', 'Word'] }                                     // nacheinander dorthin wechseln
 */
(function (TM) {
  const { esc } = TM.ui;

  TM.registerExercise('switcher', {
    mount(stage, cfg, api) {
      const wins = cfg.windows || [];
      const targets = cfg.targets || [];
      let order = wins.map((_, x) => x); // zuletzt benutzt zuerst
      let open = false;
      let pick = 1;
      let i = 0;

      TM.keys.setSticky(true);

      stage.innerHTML = `
        <div class="desk desk-1">
          <div class="monitor">
            <div class="monitor-screen">
              <div class="monitor-work sw-work"></div>
              <div class="monitor-taskbar"><span class="tb-start" aria-hidden="true">${TM.ui.WIN_LOGO}</span>
                ${wins.map((w, x) => `<span class="tb-app" data-i="${x}" style="--app-color:${w.color}"><span class="tb-app-letter">${esc(w.short)}</span></span>`).join('')}
              </div>
              <div class="sw-overlay" hidden><div class="sw-cards"></div><div class="sw-caption"></div></div>
            </div>
            <div class="monitor-label sw-label" aria-live="polite"></div>
          </div>
        </div>`;

      const work = stage.querySelector('.sw-work');
      const overlay = stage.querySelector('.sw-overlay');
      const cards = stage.querySelector('.sw-cards');
      const caption = stage.querySelector('.sw-caption');
      const label = stage.querySelector('.sw-label');

      function renderDesk() {
        work.innerHTML = order
          .slice()
          .reverse()
          .map((x, k, arr) => {
            const w = wins[x];
            const depth = arr.length - 1 - k;
            return `<div class="sim-window sw-window${depth === 0 ? ' is-front' : ''}" style="--app-color:${w.color}; --depth:${depth}">
              <div class="win-titlebar is-colored"><span class="win-title">${esc(w.name)}</span><span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
              <div class="tb-window-body"><span class="tb-app-letter big">${esc(w.short)}</span></div></div>`;
          })
          .join('');
        stage.querySelectorAll('.monitor-taskbar .tb-app').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.i) === order[0]));
        label.textContent = `Aktives Fenster: ${wins[order[0]].name}`;
      }

      function renderOverlay() {
        overlay.hidden = !open;
        if (!open) return;
        cards.innerHTML = order
          .map((x, k) => {
            const w = wins[x];
            return `<div class="sw-card${k === pick ? ' is-picked' : ''}" style="--app-color:${w.color}"><span class="tb-app-letter big">${esc(w.short)}</span><span>${esc(w.name)}</span></div>`;
          })
          .join('');
        caption.textContent = `Alt loslassen wechselt zu: ${wins[order[pick]].name}`;
      }

      function commit() {
        if (!open) return;
        const chosen = order[pick];
        order = [chosen, ...order.filter((x) => x !== chosen)];
        open = false;
        renderOverlay();
        renderDesk();
        check();
      }

      function check() {
        const t = targets[i];
        if (t === undefined) return;
        if (wins[order[0]].name === t) {
          api.say(`Gewechselt zu ${esc(t)}!`, 'ok');
          i++;
          if (i >= targets.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
          }
        } else {
          api.say(`Du bist jetzt bei ${esc(wins[order[0]].name)}. Gesucht ist ${esc(t)} – nochmal!`, 'warn');
        }
      }

      const off = TM.keys.on((e) => {
        if (e.type === 'release' && e.token === 'Alt') {
          commit();
          return;
        }
        if (e.type === 'latch' && e.token === 'Alt' && e.on) {
          api.say('Alt ist eingerastet. Jetzt {Tab} tippen – so oft, bis das richtige Fenster markiert ist.', 'info');
          return;
        }
        if (e.type !== 'combo') return;
        const c = TM.keys.canon(e.combo);
        if (c === 'Alt+Tab' || c === 'Alt+Shift+Tab') {
          if (e.event) e.event.preventDefault();
          if (!open) {
            open = true;
            pick = c === 'Alt+Tab' ? 1 : order.length - 1;
          } else {
            pick = (pick + (c === 'Alt+Tab' ? 1 : -1) + order.length) % order.length;
          }
          renderOverlay();
          if (e.source === 'virtual' || TM.keys.isLatched('Alt')) {
            api.say('Fertig ausgewählt? Dann klick auf der Bildschirmtastatur nochmal auf {Alt} zum Loslassen.', 'info');
          }
        } else if (open && c === 'Alt+Escape') {
          open = false;
          renderOverlay();
        } else if (c === 'Tab' && !TM.keys.isHeld('Alt')) {
          // ohne Alt: nichts tun, damit der Fokus nicht wegspringt
        } else if (TM.keys.looksLikeAttempt(e)) {
          api.wrong(e.combo, 'Alt+Tab');
        }
      });

      renderDesk();
      api.steps(targets.map((t) => `Wechsle zu <strong>${esc(t)}</strong> mit {Alt+Tab}`));
      api.step(0);
      api.targets('Alt+Tab');

      return {
        destroy() {
          off();
          TM.keys.setSticky(false);
          TM.keys.clearLatch();
        },
      };
    },
  });
})(window.TM);
