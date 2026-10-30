/*
 * Übungstyp "explorer": nachgebauter Datei-Explorer.
 * Kann: Klick, Strg+Klick, Shift+Klick, Pfeiltasten (+Shift), Strg+A, F2 (auch für mehrere), Esc.
 *
 * Config:
 *   { type: 'explorer',
 *     folder: 'Dokumente',
 *     files: ['Bericht.docx', 'Foto.jpg', ...],
 *     steps: [{
 *       say: 'Anleitung',
 *       target: 'Ctrl',                    // Tasten zum Hervorheben (optional)
 *       expect: ['a.jpg', 'b.jpg']         // genau diese Dateien ausgewählt …
 *            | (names, info) => true,      // … oder eigene Prüfung (info = { indices, files })
 *       via: 'ctrlClick' | 'shiftClick' | 'shiftArrow' | 'ctrlA' | 'f2',   // so muss es passieren
 *       renamed: (files) => true,          // optional: Prüfung nach Umbenennen
 *     }],
 *     renameKey: 'F2',                     // optional; Standard: F2 (Windows) bzw. Enter (Mac-Finder)
 *     crumb: 'Dieser PC' }                 // optional
 *
 * Am Mac heißt das Ding "Finder", Mehrfachauswahl geht mit Cmd statt Strg.
 */
(function (TM) {
  const { esc } = TM.ui;

  const TYPES = {
    docx: ['Word-Dokument', 'W', '#2b579a'],
    xlsx: ['Excel-Tabelle', 'X', '#217346'],
    pdf: ['PDF-Dokument', 'PDF', '#c62828'],
    jpg: ['JPG-Bild', 'JPG', '#7048e8'],
    png: ['PNG-Bild', 'PNG', '#7048e8'],
    txt: ['Textdokument', 'TXT', '#5c5f66'],
    pptx: ['PowerPoint', 'P', '#c43e1c'],
  };
  const extOf = (n) => (n.includes('.') ? n.split('.').pop().toLowerCase() : '');
  const baseOf = (n) => (n.includes('.') ? n.slice(0, n.lastIndexOf('.')) : n);
  const sizeOf = (n) => `${(n.length * 37) % 900 + 12} KB`;

  TM.registerExercise('explorer', {
    mount(stage, cfg, api) {
      const steps = cfg.steps || [];
      let files = cfg.files.map((name) => ({ name }));
      let sel = new Set();
      let anchor = 0;
      let focus = 0;
      let renaming = -1;
      let used = {};
      let i = 0;
      const mac = TM.platform.isMac();
      const MULTI = mac ? 'Win' : 'Ctrl';
      const renameKey = TM.keys.canon(cfg.renameKey || (mac ? 'Enter' : 'F2'));
      const crumb = cfg.crumb || (mac ? 'Macintosh HD › Benutzer' : 'Dieser PC');

      stage.innerHTML = `
        <div class="explorer">
          <div class="win-titlebar">
            <span class="win-title"><span class="folder-icon" aria-hidden="true"></span>${esc(cfg.folder || 'Dokumente')}</span>
            <span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span>
          </div>
          <div class="explorer-bar">
            <span class="explorer-crumb">${esc(crumb)} › ${esc(cfg.folder || 'Dokumente')}</span>
          </div>
          <div class="explorer-head" aria-hidden="true"><span>Name</span><span>Typ</span><span>Größe</span></div>
          <ul class="explorer-list" role="listbox" aria-multiselectable="true" tabindex="0" aria-label="Dateien in ${esc(cfg.folder || 'Dokumente')}"></ul>
          <div class="explorer-status" aria-live="polite"></div>
        </div>`;

      const list = stage.querySelector('.explorer-list');
      const statusEl = stage.querySelector('.explorer-status');

      function render() {
        list.innerHTML = files
          .map((f, idx) => {
            const [type, abbr, color] = TYPES[extOf(f.name)] || ['Datei', '?', '#5c5f66'];
            const nameHtml =
              idx === renaming
                ? `<input class="rename-input" type="text" value="${esc(f.name)}" aria-label="Neuer Dateiname">`
                : `<span class="file-name">${esc(f.name)}</span>`;
            return `<li role="option" data-i="${idx}" aria-selected="${sel.has(idx)}" class="file-row${sel.has(idx) ? ' is-selected' : ''}${idx === focus ? ' is-focus' : ''}">
              <span class="file-main"><span class="file-icon" style="--file-color:${color}" aria-hidden="true">${abbr}</span>${nameHtml}</span>
              <span class="file-type">${type}</span><span class="file-size">${sizeOf(f.name)}</span>
            </li>`;
          })
          .join('');
        const n = sel.size;
        statusEl.textContent = `${files.length} Elemente${n ? ` · ${n} ${n === 1 ? 'Element' : 'Elemente'} ausgewählt` : ''}`;
        if (renaming >= 0) {
          const input = list.querySelector('.rename-input');
          input.focus();
          input.setSelectionRange(0, baseOf(files[renaming].name).length);
          input.addEventListener('keydown', onRenameKey);
          input.addEventListener('blur', () => commitRename(input.value));
        }
      }

      const range = (a, b) => {
        const out = [];
        for (let x = Math.min(a, b); x <= Math.max(a, b); x++) out.push(x);
        return out;
      };

      /* ---- Umbenennen (F2) ---- */
      let renameTargets = [];
      function startRename() {
        if (!sel.size) return;
        renameTargets = [...sel].sort((a, b) => a - b);
        renaming = sel.has(focus) ? focus : renameTargets[0];
        render();
      }
      function onRenameKey(e) {
        // Nicht an den Dokument-Listener weiterreichen (am Mac startet Enter sonst gleich wieder das Umbenennen)
        if (e.key === 'Enter' || e.key === 'Escape') e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          commitRename(e.target.value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          renaming = -1;
          render();
          list.focus();
        }
      }
      function commitRename(value) {
        if (renaming < 0) return;
        const v = value.trim();
        const idx = renaming;
        renaming = -1;
        if (v) {
          if (renameTargets.length > 1) {
            const base = baseOf(v);
            renameTargets.forEach((t, k) => {
              const ext = extOf(files[t].name);
              files[t].name = `${base} (${k + 1})${ext ? '.' + ext : ''}`;
            });
          } else {
            files[idx].name = v;
          }
        }
        render();
        list.focus({ preventScroll: true });
        check();
      }

      /* ---- Maus ---- */
      list.addEventListener('mousedown', (e) => {
        if (e.shiftKey || TM.keys.isLatched('Shift')) e.preventDefault(); // kein Text markieren
      });
      list.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-i]');
        if (!li || e.target.closest('.rename-input')) return;
        const idx = Number(li.dataset.i);
        const ctrl = e.ctrlKey || e.metaKey || TM.keys.isHeld(MULTI);
        const shift = e.shiftKey || TM.keys.isHeld('Shift');
        if (shift) {
          const r = range(anchor, idx);
          sel = ctrl ? new Set([...sel, ...r]) : new Set(r);
          used.shiftClick = true;
        } else if (ctrl) {
          if (sel.has(idx)) sel.delete(idx);
          else sel.add(idx);
          anchor = idx;
          used.ctrlClick = true;
        } else {
          sel = new Set([idx]);
          anchor = idx;
        }
        focus = idx;
        render();
        list.focus({ preventScroll: true });
        check();
      });
      list.addEventListener('dblclick', (e) => {
        if (e.target.closest('li[data-i]') && !e.target.closest('.rename-input')) api.say('Doppelklick öffnet die Datei – hier üben wir aber das Auswählen.', 'info');
      });

      /* ---- Tastatur ---- */
      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || renaming >= 0) return;
        const active = document.activeElement;
        const inside = stage.contains(active);
        const free = inside || active === document.body || active === null;
        const c = e.combo;
        const last = files.length - 1;
        let handled = true;

        if (TM.keys.matches(c, ['Ctrl+A', 'Cmd+A']) && free) {
          sel = new Set(files.map((_, idx) => idx));
          used.ctrlA = true;
        } else if (c === renameKey && free) {
          used.f2 = true;
          if (!sel.size) {
            api.say(`Wähl zuerst eine Datei aus, dann {${renameKey}}.`, 'warn');
          } else {
            startRename();
            e.event && e.event.preventDefault();
            return;
          }
        } else if (!inside) {
          handled = false;
        } else if (/^(Shift\+)?(ArrowUp|ArrowDown|Home|End)$/.test(c)) {
          const key = e.key;
          const target = key === 'ArrowUp' ? Math.max(0, focus - 1) : key === 'ArrowDown' ? Math.min(last, focus + 1) : key === 'Home' ? 0 : last;
          focus = target;
          if (e.mods.includes('Shift')) {
            sel = new Set(range(anchor, focus));
            used.shiftArrow = true;
          } else {
            sel = new Set([focus]);
            anchor = focus;
          }
        } else if (!mac && (c === 'Ctrl+ArrowUp' || c === 'Ctrl+ArrowDown')) {
          focus = c.endsWith('Up') ? Math.max(0, focus - 1) : Math.min(last, focus + 1);
        } else if (!mac && c === 'Ctrl+Space') {
          if (sel.has(focus)) sel.delete(focus);
          else sel.add(focus);
          anchor = focus;
          used.ctrlClick = true;
        } else if (c === 'Escape') {
          sel = new Set();
        } else {
          handled = false;
        }

        if (handled) {
          if (e.event) e.event.preventDefault();
          render();
          check();
        }
      });

      /* ---- Prüfen ---- */
      function check() {
        const st = steps[i];
        if (!st) return;
        const indices = [...sel].sort((a, b) => a - b);
        const names = indices.map((x) => files[x].name);
        let ok = true;
        if (st.expect) {
          ok = typeof st.expect === 'function' ? st.expect(names, { indices, files: files.map((f) => f.name) }) : sameSet(names, st.expect);
        }
        if (st.renamed) ok = ok && st.renamed(files.map((f) => f.name));
        if (st.via) ok = ok && Boolean(used[st.via]);
        if (ok) {
          api.say(st.ok || 'Genau so!', 'ok');
          i++;
          used = {};
          if (i >= steps.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
            api.targets(steps[i].target || []);
          }
        } else if (st.expect && Array.isArray(st.expect) && names.length >= st.expect.length && st.via && !used[st.via]) {
          api.say(`Fast! Die Auswahl stimmt, aber probier es mit ${hintFor(st.via)}.`, 'warn');
        }
      }
      const sameSet = (a, b) => a.length === b.length && b.every((x) => a.includes(x));
      const hintFor = (via) =>
        TM.ui.rich({ ctrlClick: `{${MULTI}}+Klick`, shiftClick: '{Shift}+Klick', shiftArrow: '{Shift+ArrowDown}', ctrlA: `{${MULTI}+A}`, f2: `{${renameKey}}` }[via] || 'der Tastatur');

      render();
      api.steps(steps.map((s) => s.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].target || [] : []);
      list.focus({ preventScroll: true });

      return { destroy: off };
    },
  });
})(window.TM);
