/*
 * Übungstyp "excel": kleine Tabelle mit echter Tastatur-Navigation.
 * Kann: Pfeile (+Shift), an den Datenrand springen (Strg/Cmd+Pfeil, +Shift), Strg+Pos1/Ende,
 *       Spalte/Zeile markieren, alles markieren, Zelle bearbeiten, nach unten/rechts ausfüllen,
 *       AutoSumme, einfache Formeln (=B2-C2, =SUMME(B2:B7)).
 * Die Tasten passen sich automatisch an Windows bzw. Mac an.
 *
 * Config:
 *   { type: 'excel',
 *     title: 'Umsatz.xlsx', cols: 6, rows: 10, start: 'A1',
 *     data: [['Monat', 'Umsatz'], ['Januar', 4200], ...],
 *     steps: [{
 *       say, target,                 // Text + hervorgehobene Tasten
 *       via: 'jump' | 'extendJump' | 'home' | 'end' | 'col' | 'row' | 'all' | 'edit' | 'fill' | 'autosum',
 *       test: (ctx) => true,
 *     }] }
 *
 * ctx = { active: 'B4', sel: 'B2:B7', full: 'col'|'row'|'all'|null, editing, value(addr), raw(addr) }
 */
(function (TM) {
  const { esc } = TM.ui;

  const COMMANDS = {
    win: {
      jump: 'Ctrl', home: ['Ctrl+Home'], end: ['Ctrl+End'], col: ['Ctrl+Space'], row: ['Shift+Space'], all: ['Ctrl+A'],
      edit: ['F2'], fillDown: ['Ctrl+D', 'Ctrl+U'], fillRight: ['Ctrl+R'], autosum: ['Alt+Shift+0', 'Alt+='],
    },
    mac: {
      jump: 'Win', home: ['Ctrl+Home', 'Fn+Ctrl+ArrowLeft'], end: ['Ctrl+End', 'Fn+Ctrl+ArrowRight'], col: ['Ctrl+Space'], row: ['Shift+Space'], all: ['Cmd+A'],
      edit: ['Ctrl+U', 'F2'], fillDown: ['Cmd+D', 'Ctrl+D'], fillRight: ['Cmd+R', 'Ctrl+R'], autosum: ['Cmd+Shift+T'],
    },
  };
  const DIRS = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

  const colName = (c) => String.fromCharCode(65 + c);
  const addr = (r, c) => colName(c) + (r + 1);
  function parseAddr(a) {
    const m = /^([A-Z])(\d+)$/.exec(String(a).toUpperCase());
    return m ? { r: Number(m[2]) - 1, c: m[1].charCodeAt(0) - 65 } : { r: 0, c: 0 };
  }

  TM.registerExercise('excel', {
    mount(stage, cfg, api) {
      const mac = TM.platform.isMac();
      const CMD = COMMANDS[mac ? 'mac' : 'win'];
      const COLS = cfg.cols || 6;
      const ROWS = cfg.rows || 10;
      const steps = cfg.steps || [];
      const cells = {};
      (cfg.data || []).forEach((row, r) => row.forEach((v, c) => {
        if (v !== '' && v !== null && v !== undefined) cells[addr(r, c)] = String(v);
      }));
      let active = parseAddr(cfg.start || 'A1');
      let ext = Object.assign({}, active);
      let full = null;
      let editing = false;
      let used = {};
      let i = 0;

      const lookup = {};
      ['home', 'end', 'col', 'row', 'all', 'edit', 'fillDown', 'fillRight', 'autosum'].forEach((name) =>
        CMD[name].forEach((c) => (lookup[TM.keys.canon(c)] = name))
      );

      stage.innerHTML = `
        <div class="excel">
          <div class="win-titlebar is-colored" style="--app-color:#217346"><span class="win-title">${esc(cfg.title || 'Mappe1.xlsx')} – Excel</span><span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
          <div class="xl-bar"><span class="xl-name" aria-label="Aktive Zelle"></span><span class="xl-fx" aria-hidden="true">fx</span><span class="xl-formula"></span></div>
          <div class="xl-wrap">
            <table class="xl-grid" tabindex="0" aria-label="Tabelle – mit den Pfeiltasten bewegen">
              <thead><tr><th class="xl-corner"></th>${Array.from({ length: COLS }, (_, c) => `<th class="xl-colhead" data-c="${c}">${colName(c)}</th>`).join('')}</tr></thead>
              <tbody>${Array.from({ length: ROWS }, (_, r) => `<tr><th class="xl-rowhead" data-r="${r}">${r + 1}</th>${Array.from({ length: COLS }, (_, c) => `<td data-r="${r}" data-c="${c}"></td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
        </div>`;

      const grid = stage.querySelector('.xl-grid');
      const nameBox = stage.querySelector('.xl-name');
      const formulaBox = stage.querySelector('.xl-formula');

      /* ---- Rechnen ---- */
      const raw = (a) => cells[a] ?? '';
      const filled = (r, c) => r >= 0 && c >= 0 && r < ROWS && c < COLS && raw(addr(r, c)) !== '';
      const inBounds = (r, c) => r >= 0 && c >= 0 && r < ROWS && c < COLS;

      function num(v) {
        const n = Number(String(v).replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
      }
      function sumRange(a, b, depth) {
        const p = parseAddr(a);
        const q = parseAddr(b);
        let s = 0;
        for (let r = Math.min(p.r, q.r); r <= Math.max(p.r, q.r); r++) {
          for (let c = Math.min(p.c, q.c); c <= Math.max(p.c, q.c); c++) s += num(value(addr(r, c), depth + 1));
        }
        return s;
      }
      function value(a, depth = 0) {
        const v = raw(a);
        if (!v.startsWith('=')) return v;
        if (depth > 30) return '#ZIRKEL!';
        let expr = v.slice(1).toUpperCase();
        expr = expr.replace(/(SUMME|SUM)\(([A-Z]\d+):([A-Z]\d+)\)/g, (_, fn, x, y) => `(${sumRange(x, y, depth)})`);
        expr = expr.replace(/\b([A-Z])(\d+)\b/g, (_, c, r) => `(${num(value(c + r, depth + 1))})`);
        expr = expr.replace(/,/g, '.');
        if (!/^[\d+\-*/().\s]+$/.test(expr)) return '#WERT!';
        try {
          const res = Function(`"use strict"; return (${expr});`)();
          return Number.isFinite(res) ? Math.round(res * 100) / 100 : '#DIV/0!';
        } catch (e) {
          return '#WERT!';
        }
      }
      function display(a) {
        const v = value(a);
        if (v === '') return '';
        const n = Number(v);
        return v !== '' && Number.isFinite(n) && String(v).trim() !== '' ? n.toLocaleString('de-DE') : String(v);
      }
      const shiftFormula = (f, dr, dc) =>
        f.startsWith('=') ? f.replace(/\b([A-Z])(\d+)\b/g, (_, c, r) => addr(Number(r) - 1 + dr, c.charCodeAt(0) - 65 + dc)) : f;

      /* ---- Auswahl ---- */
      function selRect() {
        if (full === 'all') return { r1: 0, c1: 0, r2: ROWS - 1, c2: COLS - 1 };
        const c1 = Math.min(active.c, ext.c);
        const c2 = Math.max(active.c, ext.c);
        const r1 = Math.min(active.r, ext.r);
        const r2 = Math.max(active.r, ext.r);
        if (full === 'col') return { r1: 0, r2: ROWS - 1, c1, c2 };
        if (full === 'row') return { r1, r2, c1: 0, c2: COLS - 1 };
        return { r1, r2, c1, c2 };
      }
      function selText() {
        const s = selRect();
        return s.r1 === s.r2 && s.c1 === s.c2 ? addr(s.r1, s.c1) : `${addr(s.r1, s.c1)}:${addr(s.r2, s.c2)}`;
      }

      function jumpFrom(p, dr, dc) {
        let r = p.r;
        let c = p.c;
        if (!inBounds(r + dr, c + dc)) return p;
        if (filled(r, c) && filled(r + dr, c + dc)) {
          while (filled(r + dr, c + dc)) {
            r += dr;
            c += dc;
          }
          return { r, c };
        }
        r += dr;
        c += dc;
        while (!filled(r, c) && inBounds(r + dr, c + dc)) {
          r += dr;
          c += dc;
        }
        return { r, c };
      }
      function lastUsed() {
        let r = 0;
        let c = 0;
        Object.keys(cells).forEach((a) => {
          if (raw(a) === '') return;
          const p = parseAddr(a);
          r = Math.max(r, p.r);
          c = Math.max(c, p.c);
        });
        return { r, c };
      }
      const clamp = (p) => ({ r: Math.max(0, Math.min(ROWS - 1, p.r)), c: Math.max(0, Math.min(COLS - 1, p.c)) });
      function moveTo(p) {
        active = clamp(p);
        ext = Object.assign({}, active);
        full = null;
      }

      /* ---- Bearbeiten ---- */
      function startEdit(initial, caretAtEnd = true) {
        editing = true;
        render();
        const td = grid.querySelector(`td[data-r="${active.r}"][data-c="${active.c}"]`);
        td.innerHTML = `<input class="xl-input" type="text" aria-label="Zelle ${addr(active.r, active.c)} bearbeiten">`;
        const input = td.querySelector('input');
        input.value = initial;
        input.focus();
        if (caretAtEnd) input.setSelectionRange(input.value.length, input.value.length);
        input.addEventListener('input', () => (formulaBox.textContent = input.value));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            e.stopPropagation();
            commit(input.value);
            moveTo({ r: active.r + (e.key === 'Enter' ? (e.shiftKey ? -1 : 1) : 0), c: active.c + (e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0) });
            render();
            check();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            editing = false;
            render();
            grid.focus({ preventScroll: true });
          }
        });
        input.addEventListener('blur', () => {
          if (editing) {
            commit(input.value);
            render();
            check();
          }
        });
      }
      function commit(v) {
        editing = false;
        const a = addr(active.r, active.c);
        if (v === '') delete cells[a];
        else cells[a] = v.trim();
        grid.focus({ preventScroll: true });
      }

      function fill(down) {
        const s = selRect();
        let { r1, c1, r2, c2 } = s;
        if (down && r1 === r2 && r1 > 0) r1 -= 1; // einzelne Zelle: von oben übernehmen
        if (!down && c1 === c2 && c1 > 0) c1 -= 1;
        if (down) {
          for (let c = c1; c <= c2; c++) for (let r = r1 + 1; r <= r2; r++) setFrom(addr(r1, c), addr(r, c), r - r1, 0);
        } else {
          for (let r = r1; r <= r2; r++) for (let c = c1 + 1; c <= c2; c++) setFrom(addr(r, c1), addr(r, c), 0, c - c1);
        }
      }
      function setFrom(src, dst, dr, dc) {
        const v = raw(src);
        if (v === '') delete cells[dst];
        else cells[dst] = shiftFormula(v, dr, dc);
      }

      function autosum() {
        let r = active.r - 1;
        while (r >= 0 && raw(addr(r, active.c)) !== '' && Number.isFinite(Number(value(addr(r, active.c))))) r--;
        const top = r + 1;
        if (top > active.r - 1) {
          api.say('Über dieser Zelle stehen keine Zahlen. Stell dich unter eine Zahlenspalte.', 'warn');
          return;
        }
        startEdit(`=SUMME(${addr(top, active.c)}:${addr(active.r - 1, active.c)})`);
      }

      /* ---- Darstellung ---- */
      function render() {
        const s = selRect();
        const multi = !(s.r1 === s.r2 && s.c1 === s.c2);
        grid.querySelectorAll('td').forEach((td) => {
          const r = Number(td.dataset.r);
          const c = Number(td.dataset.c);
          const isActive = r === active.r && c === active.c;
          if (!(editing && isActive)) {
            const a = addr(r, c);
            td.textContent = display(a);
            td.classList.toggle('is-num', Number.isFinite(Number(value(a))) && raw(a) !== '');
          }
          td.classList.toggle('in-sel', multi && r >= s.r1 && r <= s.r2 && c >= s.c1 && c <= s.c2);
          td.classList.toggle('is-active', isActive);
        });
        grid.querySelectorAll('.xl-colhead').forEach((th) => {
          const c = Number(th.dataset.c);
          th.classList.toggle('in-sel', c >= s.c1 && c <= s.c2);
        });
        grid.querySelectorAll('.xl-rowhead').forEach((th) => {
          const r = Number(th.dataset.r);
          th.classList.toggle('in-sel', r >= s.r1 && r <= s.r2);
        });
        nameBox.textContent = addr(active.r, active.c);
        if (!editing) formulaBox.textContent = raw(addr(active.r, active.c));
      }

      /* ---- Prüfen ---- */
      function ctx() {
        return { active: addr(active.r, active.c), sel: selText(), full, editing, value: (a) => value(a), raw };
      }
      function check() {
        const st = steps[i];
        if (!st) return;
        let ok = true;
        try {
          ok = !st.test || st.test(ctx());
        } catch (e) {
          ok = false;
        }
        if (st.via) ok = ok && Boolean(used[st.via]);
        if (ok) {
          api.say(st.ok || 'Richtig!', 'ok');
          i++;
          used = {};
          if (i >= steps.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
            api.targets(steps[i].target || []);
          }
        }
      }

      /* ---- Maus ---- */
      grid.addEventListener('mousedown', (e) => {
        if (e.target.closest('.xl-input')) return;
        e.preventDefault();
        if (editing) {
          const input = grid.querySelector('.xl-input');
          if (input) commit(input.value);
        }
        const td = e.target.closest('td');
        const colHead = e.target.closest('.xl-colhead');
        const rowHead = e.target.closest('.xl-rowhead');
        if (td) {
          const p = { r: Number(td.dataset.r), c: Number(td.dataset.c) };
          if (e.shiftKey || TM.keys.isHeld('Shift')) {
            ext = p;
            full = null;
          } else moveTo(p);
        } else if (colHead) {
          moveTo({ r: 0, c: Number(colHead.dataset.c) });
          full = 'col';
        } else if (rowHead) {
          moveTo({ r: Number(rowHead.dataset.r), c: 0 });
          full = 'row';
        }
        grid.focus({ preventScroll: true });
        render();
        check();
      });
      grid.addEventListener('dblclick', (e) => {
        if (e.target.closest('td') && !editing) startEdit(raw(addr(active.r, active.c)));
      });

      /* ---- Tastatur ---- */
      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || editing) return;
        if (!stage.contains(document.activeElement)) return;
        const c = TM.keys.canon(e.combo);
        const mods = e.mods.filter((m) => m !== 'Fn');
        const cmd = lookup[c];
        let handled = true;

        if (DIRS[e.key] && !cmd) {
          const [dr, dc] = DIRS[e.key];
          const jumping = mods.includes(CMD.jump);
          const shift = mods.includes('Shift');
          const others = mods.filter((m) => m !== 'Shift' && m !== CMD.jump);
          if (others.length) handled = false;
          else if (jumping && shift) {
            ext = jumpFrom(ext, dr, dc);
            full = null;
            used.extendJump = true;
          } else if (jumping) {
            moveTo(jumpFrom(active, dr, dc));
            used.jump = true;
          } else if (shift) {
            ext = clamp({ r: ext.r + dr, c: ext.c + dc });
            full = null;
            used.extend = true;
          } else {
            moveTo({ r: active.r + dr, c: active.c + dc });
          }
        } else if (cmd === 'home') {
          moveTo({ r: 0, c: 0 });
          used.home = true;
        } else if (cmd === 'end') {
          moveTo(lastUsed());
          used.end = true;
        } else if (cmd === 'col') {
          full = 'col';
          used.col = true;
        } else if (cmd === 'row') {
          full = 'row';
          used.row = true;
        } else if (cmd === 'all') {
          full = 'all';
          used.all = true;
        } else if (cmd === 'edit') {
          used.edit = true;
          if (e.event) e.event.preventDefault();
          startEdit(raw(addr(active.r, active.c)));
          return;
        } else if (cmd === 'fillDown' || cmd === 'fillRight') {
          fill(cmd === 'fillDown');
          used.fill = true;
        } else if (cmd === 'autosum') {
          used.autosum = true;
          if (e.event) e.event.preventDefault();
          autosum();
          return;
        } else if (c === 'Enter' || c === 'Shift+Enter') {
          moveTo({ r: active.r + (c === 'Enter' ? 1 : -1), c: active.c });
        } else if (c === 'Tab' || c === 'Shift+Tab') {
          moveTo({ r: active.r, c: active.c + (c === 'Tab' ? 1 : -1) });
        } else if (c === 'Delete' || c === 'Backspace') {
          const s = selRect();
          for (let r = s.r1; r <= s.r2; r++) for (let cc = s.c1; cc <= s.c2; cc++) delete cells[addr(r, cc)];
        } else if (c === 'Escape') {
          full = null;
          ext = Object.assign({}, active);
        } else if (!mods.filter((m) => m !== 'Shift').length && e.event && e.event.key.length === 1) {
          // Einfach lostippen ersetzt den Zellinhalt – wie in Excel
          e.event.preventDefault();
          startEdit(e.event.key);
          return;
        } else {
          handled = false;
        }

        if (handled) {
          if (e.event) e.event.preventDefault();
          render();
          check();
        }
      });

      render();
      api.steps(steps.map((s) => s.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].target || [] : []);
      grid.focus({ preventScroll: true });

      return { destroy: off };
    },
  });
})(window.TM);
