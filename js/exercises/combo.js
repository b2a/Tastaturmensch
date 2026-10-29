/*
 * Übungstyp "combo": Kombination(en) der Reihe nach drücken, ein Mini-Bildschirm reagiert.
 *
 * Jeder Übungstyp hat dieselbe Form:
 *   TM.registerExercise('typ', {
 *     virtualInput: true,              // darf die Bildschirmtastatur Eingaben auslösen?
 *     mount(stage, config, api) {      // stage = leeres <div>, config = lesson.exercise
 *       ...
 *       return { destroy() {} };       // aufräumen, wenn die Lektion verlassen wird
 *     },
 *   });
 *
 * api:
 *   api.steps([...])      Schritt-Liste anzeigen (Text mit {Ctrl+C}-Platzhaltern)
 *   api.step(i)           Schritt i ist dran (alle davor gelten als erledigt)
 *   api.targets(combo)    gesuchte Tasten hervorheben (String, Array oder [])
 *   api.say(html, tone)   Statuszeile: 'info' | 'ok' | 'warn'
 *   api.wrong(gedrückt, gesucht)   freundlicher Hinweis + kurzes Wackeln
 *   api.complete()        Lektion geschafft
 *
 * Config für "combo":
 *   { type: 'combo',
 *     scene: { icon, title, text },                       // Startbild (optional)
 *     steps: [{ say, combo, times?, effect: { icon, title, text } }] }
 */
(function (TM) {
  const { rich, esc } = TM.ui;

  TM.registerExercise('combo', {
    mount(stage, cfg, api) {
      const steps = cfg.steps || [];
      let i = 0;
      let count = 0;

      stage.innerHTML = `
        <div class="screen">
          <div class="screen-bezel">
            <div class="screen-display"><div class="scene"></div></div>
          </div>
          <div class="screen-foot" aria-hidden="true"></div>
        </div>`;
      const sceneEl = stage.querySelector('.scene');

      function show(scene, animate = true) {
        if (!scene) return;
        sceneEl.innerHTML = `
          <div class="scene-icon" aria-hidden="true">${esc(scene.icon || '⌨️')}</div>
          <div class="scene-title">${rich(esc(scene.title || ''))}</div>
          ${scene.text ? `<div class="scene-text">${rich(scene.text)}</div>` : ''}`;
        if (animate) {
          sceneEl.classList.remove('is-entering');
          void sceneEl.offsetWidth;
          sceneEl.classList.add('is-entering');
        }
      }

      function go(n) {
        i = n;
        count = 0;
        if (i >= steps.length) {
          api.targets([]);
          api.complete();
          return;
        }
        api.step(i);
        api.targets(steps[i].combo);
      }

      show(cfg.scene || { icon: '⌨️', title: 'Bereit?', text: 'Drück die gesuchte Kombination.' }, false);
      api.steps(steps.map((s) => s.say));
      go(0);

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || i >= steps.length) return;
        const st = steps[i];
        if (TM.keys.matches(e.combo, st.combo)) {
          if (e.event) e.event.preventDefault();
          if (e.repeat) return;
          count++;
          const need = st.times || 1;
          if (count < need) {
            api.say(`Gut! Noch ${need - count}× ${rich(`{${e.combo}}`)}`, 'info');
            return;
          }
          show(st.effect || { icon: '✓', title: TM.keys.canon(e.combo) });
          api.say(st.ok || `Richtig: ${rich(`{${e.combo}}`)}`, 'ok');
          go(i + 1);
        } else if (TM.keys.looksLikeAttempt(e)) {
          if (e.event && TM.keys.isReserved(e.combo)) e.event.preventDefault();
          api.wrong(e.combo, st.combo);
        }
      });

      return { destroy: off };
    },
  });
})(window.TM);
