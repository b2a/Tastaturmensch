/*
 * Übungstyp "text": echtes Textfeld, in dem man kopiert, markiert, löscht …
 * Hier wirken die echten Browser-Funktionen, darum keine Bildschirmtastatur-Eingabe.
 *
 * Config:
 *   { type: 'text',
 *     source: 'Text zum Kopieren',   // optional: grauer Kasten über dem Feld
 *     label: 'Dein Textfeld',        // optional
 *     text: 'Startinhalt',
 *     rows: 4, wrap: 'off',          // optional
 *     steps: [{
 *       say: 'Anleitung mit {Ctrl+C}',
 *       combo: 'Ctrl+C',             // optional: muss in diesem Schritt gedrückt werden
 *       times: 1,                    // optional: wie oft
 *       test: (ctx, check) => true,  // optional: Prüfung des Ergebnisses
 *       ok: 'Lob nach dem Schritt',  // optional
 *     }] }
 *
 * ctx = { text, selStart, selEnd, caret, selected, copied, keyboardSelection, focused }
 * check = TM.check (lines, norm, words, count, sameList)
 */
(function (TM) {
  const { esc, rich } = TM.ui;

  TM.registerExercise('text', {
    virtualInput: false,
    mount(stage, cfg, api) {
      const steps = cfg.steps || [];
      let i = 0;
      let count = 0;
      let copied = '';
      let selSource = 'mouse';
      let timer = null;

      stage.innerHTML = `
        <div class="textex">
          ${cfg.source ? `<div class="text-source"><span class="text-source-label">Zum Kopieren</span><p class="text-source-body">${esc(cfg.source)}</p></div>` : ''}
          <label class="field-label" for="ex-text">${esc(cfg.label || 'Übungsfeld')}</label>
          <textarea id="ex-text" class="text-field" rows="${cfg.rows || 4}" spellcheck="false" autocomplete="off" ${cfg.wrap === 'off' ? 'wrap="off"' : ''}>${esc(cfg.text || '')}</textarea>
          <button type="button" class="btn btn-ghost btn-small text-reset">Text zurücksetzen</button>
        </div>`;

      const ta = stage.querySelector('textarea');

      function ctx() {
        const s = ta.selectionStart;
        const e = ta.selectionEnd;
        const focused = document.activeElement === ta;
        const pageSel = String(window.getSelection ? window.getSelection() : '');
        return {
          text: ta.value,
          selStart: s,
          selEnd: e,
          caret: e,
          selected: focused ? ta.value.slice(s, e) : pageSel,
          copied,
          keyboardSelection: selSource === 'keyboard',
          focused,
        };
      }

      function check() {
        if (i >= steps.length) return;
        const st = steps[i];
        const okCombo = !st.combo || count >= (st.times || 1);
        let okTest = true;
        try {
          okTest = !st.test || st.test(ctx(), TM.check);
        } catch (err) {
          okTest = false;
        }
        if (okCombo && okTest) {
          api.say(st.ok || 'Richtig!', 'ok');
          next();
        }
      }

      function next() {
        i++;
        count = 0;
        if (i >= steps.length) {
          api.targets([]);
          api.complete();
          return;
        }
        api.step(i);
        api.targets(steps[i].combo || []);
      }

      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(check, 40);
      };

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || i >= steps.length) return;
        if (e.combo === 'Ctrl+C' || e.combo === 'Ctrl+X') copied = ctx().selected;
        if (e.combo === 'Ctrl+A' || (e.mods.includes('Shift') && /^(Arrow|Home|End|Page)/.test(e.key))) selSource = 'keyboard';
        const st = steps[i];
        if (st.combo && TM.keys.matches(e.combo, st.combo)) {
          count++;
          const need = st.times || 1;
          if (count < need && !st.test) api.say(`Gut! Noch ${need - count}× ${rich(`{${e.combo}}`)}`, 'info');
        }
        schedule();
      });

      ta.addEventListener('mousedown', () => {
        selSource = 'mouse';
      });
      ['input', 'select', 'keyup', 'mouseup'].forEach((ev) => ta.addEventListener(ev, schedule));
      document.addEventListener('selectionchange', schedule);

      stage.querySelector('.text-reset').addEventListener('click', () => {
        ta.value = cfg.text || '';
        ta.focus();
        api.say('Text zurückgesetzt.', 'info');
      });

      api.steps(steps.map((s) => s.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].combo || [] : []);

      return {
        destroy() {
          off();
          clearTimeout(timer);
          document.removeEventListener('selectionchange', schedule);
        },
      };
    },
  });
})(window.TM);
