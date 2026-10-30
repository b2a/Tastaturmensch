/*
 * Übungstyp "word": kleines Word-Dokument zum Formatieren.
 * Kann: Fett/Kursiv/Unterstrichen, Ausrichten (links/zentriert/rechts/Blocksatz),
 *       Groß-/Kleinschreibung umschalten (Shift+F3), Seitenumbruch.
 * Die Tasten passen sich automatisch an Windows bzw. Mac an.
 *
 * Config:
 *   { type: 'word',
 *     title: 'Einladung.docx',
 *     doc: ['Absatz 1', 'Absatz 2', ...],
 *     steps: [{ say, combo?, times?, test: (ctx) => true, ok? }] }
 *
 * ctx = {
 *   text,                       // gesamter Text
 *   has(wort, 'bold'|'italic'|'underline'),   // ist das Wort komplett so formatiert?
 *   alignOf(textstück),         // 'left' | 'center' | 'right' | 'justify' des Absatzes
 *   pageBreaks,                 // Anzahl Seitenumbrüche
 * }
 */
(function (TM) {
  const { esc } = TM.ui;

  const COMMANDS = {
    win: {
      bold: ['Ctrl+B'], italic: ['Ctrl+I'], underline: ['Ctrl+U'],
      left: ['Ctrl+L'], center: ['Ctrl+E'], right: ['Ctrl+R'], justify: ['Ctrl+J'],
      case: ['Shift+F3'], pagebreak: ['Ctrl+Enter'],
    },
    mac: {
      bold: ['Cmd+B'], italic: ['Cmd+I'], underline: ['Cmd+U'],
      left: ['Cmd+L'], center: ['Cmd+E'], right: ['Cmd+R'], justify: ['Cmd+J'],
      case: ['Shift+F3'], pagebreak: ['Cmd+Enter'],
    },
  };

  const ALIGN_LINES = {
    left: [[1, 15], [1, 10], [1, 15], [1, 8]],
    center: [[1, 15], [4, 12], [1, 15], [5, 11]],
    right: [[1, 15], [6, 15], [1, 15], [8, 15]],
    justify: [[1, 15], [1, 15], [1, 15], [1, 15]],
  };
  const alignIcon = (al) =>
    `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">${ALIGN_LINES[al]
      .map(([x1, x2], k) => `<line x1="${x1}" x2="${x2}" y1="${2 + k * 4}" y2="${2 + k * 4}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`)
      .join('')}</svg>`;

  function normAlign(v) {
    if (v === 'center' || v === '-webkit-center') return 'center';
    if (v === 'right' || v === 'end') return 'right';
    if (v === 'justify') return 'justify';
    return 'left';
  }

  function nextCase(t) {
    if (t === t.toUpperCase()) return t.toLowerCase();
    if (t === t.toLowerCase()) return t.replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());
    return t.toUpperCase();
  }

  TM.registerExercise('word', {
    virtualInput: false,
    mount(stage, cfg, api) {
      const mac = TM.platform.isMac();
      const CMD = COMMANDS[mac ? 'mac' : 'win'];
      const lookup = {};
      Object.keys(CMD).forEach((name) => CMD[name].forEach((c) => (lookup[TM.keys.canon(c)] = name)));
      const steps = cfg.steps || [];
      let i = 0;
      let count = 0;
      let timer = null;

      stage.innerHTML = `
        <div class="word">
          <div class="win-titlebar is-colored" style="--app-color:#2b579a"><span class="win-title">${esc(cfg.title || 'Dokument1')} – Word</span><span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
          <div class="wd-ribbon" aria-hidden="true">
            <span class="wd-btn" data-state="bold"><b>F</b></span>
            <span class="wd-btn" data-state="italic"><i>K</i></span>
            <span class="wd-btn" data-state="underline"><u>U</u></span>
            <span class="wd-sep"></span>
            ${['left', 'center', 'right', 'justify'].map((al) => `<span class="wd-btn wd-align" data-align="${al}">${alignIcon(al)}</span>`).join('')}
          </div>
          <div class="wd-page">
            <div class="wd-doc" contenteditable="true" spellcheck="false" role="textbox" aria-multiline="true" aria-label="Word-Dokument">
              ${(cfg.doc || []).map((p) => `<p>${esc(p)}</p>`).join('')}
            </div>
          </div>
        </div>`;

      const doc = stage.querySelector('.wd-doc');

      /* ---- Helfer ---- */
      const blocks = () => [...doc.children].filter((el) => el.tagName === 'P' || el.tagName === 'DIV');

      function selectedBlocks() {
        const sel = window.getSelection();
        if (!sel.rangeCount || !doc.contains(sel.anchorNode)) return [];
        const r = sel.getRangeAt(0);
        return blocks().filter((b) => !b.classList.contains('wd-break') && r.intersectsNode(b));
      }

      function textNodes() {
        const out = [];
        const w = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) out.push(n);
        return out;
      }

      function styled(el, fmt) {
        if (!el || el === doc) return false;
        const cs = getComputedStyle(el);
        if (fmt === 'bold') return Number(cs.fontWeight) >= 600 || cs.fontWeight === 'bold';
        if (fmt === 'italic') return cs.fontStyle === 'italic';
        for (let x = el; x && x !== doc; x = x.parentElement) {
          if ((getComputedStyle(x).textDecorationLine || '').includes('underline')) return true;
        }
        return false;
      }

      function has(word, fmt) {
        const nodes = textNodes();
        let full = '';
        const spans = nodes.map((n) => {
          const start = full.length;
          full += n.nodeValue;
          return { n, start, end: full.length };
        });
        const idx = full.indexOf(word);
        if (idx < 0) return false;
        const end = idx + word.length;
        return spans.filter((s) => s.end > idx && s.start < end && s.n.nodeValue.trim()).every((s) => styled(s.n.parentElement, fmt));
      }

      function ctx() {
        return {
          text: doc.innerText,
          has,
          alignOf(part) {
            const b = blocks().find((x) => x.textContent.includes(part));
            return b ? normAlign(getComputedStyle(b).textAlign) : null;
          },
          pageBreaks: doc.querySelectorAll('.wd-break').length,
        };
      }

      function updateRibbon() {
        ['bold', 'italic', 'underline'].forEach((cmd) => {
          let on = false;
          try {
            on = document.queryCommandState(cmd);
          } catch (e) {
            on = false;
          }
          stage.querySelector(`[data-state="${cmd}"]`).classList.toggle('is-on', on && doc.contains(document.activeElement));
        });
        const b = selectedBlocks()[0];
        const a = b ? normAlign(getComputedStyle(b).textAlign) : null;
        stage.querySelectorAll('.wd-align').forEach((el) => el.classList.toggle('is-on', el.dataset.align === a));
      }

      /* ---- Befehle ---- */
      function run(name) {
        if (['bold', 'italic', 'underline'].includes(name)) {
          document.execCommand(name);
        } else if (['left', 'center', 'right', 'justify'].includes(name)) {
          const bs = selectedBlocks();
          bs.forEach((b) => (b.style.textAlign = name));
        } else if (name === 'case') {
          const sel = window.getSelection();
          const t = String(sel);
          if (!t) {
            api.say('Markier zuerst ein Wort, dann {Shift+F3}.', 'warn');
            return;
          }
          const nt = nextCase(t);
          document.execCommand('insertText', false, nt);
          if (sel.modify) for (let k = 0; k < nt.length; k++) sel.modify('extend', 'backward', 'character');
        } else if (name === 'pagebreak') {
          const b = selectedBlocks()[0] || blocks()[blocks().length - 1];
          const br = document.createElement('div');
          br.className = 'wd-break';
          br.contentEditable = 'false';
          br.textContent = 'Seitenumbruch';
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          b.after(br, p);
          const r = document.createRange();
          r.setStart(p, 0);
          r.collapse(true);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
        }
        updateRibbon();
      }

      /* ---- Schritte ---- */
      function check() {
        if (i >= steps.length) return;
        const st = steps[i];
        const okCombo = !st.combo || count >= (st.times || 1);
        let okTest = true;
        try {
          okTest = !st.test || st.test(ctx());
        } catch (err) {
          okTest = false;
        }
        if (okCombo && okTest) {
          api.say(st.ok || 'Richtig!', 'ok');
          i++;
          count = 0;
          if (i >= steps.length) {
            api.targets([]);
            api.complete();
          } else {
            api.step(i);
            api.targets(steps[i].combo || []);
          }
        }
      }
      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(check, 40);
      };

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || e.repeat) return;
        const name = lookup[TM.keys.canon(e.combo)];
        const st = steps[i];
        if (name) {
          if (e.event) e.event.preventDefault();
          if (!doc.contains(document.activeElement)) {
            api.say('Klick zuerst ins Dokument und markier den Text.', 'warn');
            return;
          }
          run(name);
        }
        if (st && st.combo && TM.keys.matches(e.combo, st.combo)) count++;
        schedule();
      });

      const onSel = () => {
        updateRibbon();
        schedule();
      };
      document.addEventListener('selectionchange', onSel);
      doc.addEventListener('input', schedule);

      api.steps(steps.map((s) => s.say));
      api.step(0);
      api.targets(steps[0] ? steps[0].combo || [] : []);

      return {
        destroy() {
          off();
          clearTimeout(timer);
          document.removeEventListener('selectionchange', onSel);
        },
      };
    },
  });
})(window.TM);
