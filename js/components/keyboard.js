/*
 * Bildschirmtastatur (deutsches QWERTZ-Layout, Laptop-Stil).
 * Zeigt echte Tastendrücke an, hebt gesuchte Tasten hervor und lässt sich anklicken.
 * Sondertasten (Strg, Shift, Alt, Win) rasten beim Klick ein.
 */
(function (TM) {
  const k = (t, l, w = 1, cls = '') => ({ t, l: l === undefined ? t : l, w, cls });
  const letters = (s) => s.split('').map((c) => k(c));

  const ROWS = [
    [k('Escape', 'Esc'), ...Array.from({ length: 12 }, (_, i) => k('F' + (i + 1), 'F' + (i + 1), 0.9, 'is-fn')), k('Home', 'Pos1', 1.05, 'is-fn'), k('End', 'Ende', 1.05, 'is-fn'), k('Delete', 'Entf', 1.1, 'is-fn')],
    [k('^'), ...letters('1234567890'), k('ß'), k('´'), k('Backspace', '⌫', 2)],
    [k('Tab', 'Tab', 1.5), ...letters('QWERTZUIOPÜ'), k('Plus', '+'), k('Enter', 'Enter', 1.5)],
    [k('CapsLock', '⇪', 1.75, 'is-dead'), ...letters('ASDFGHJKLÖÄ'), k('#'), k('Enter', '↵', 1.25)],
    [k('Shift', '⇧ Shift', 1.25), k('<'), ...letters('YXCVBNM'), k('Comma', ','), k('Period', '.'), k('Minus', '-'), k('Shift', '⇧ Shift', 2.75)],
    [k('Ctrl', 'Strg', 1.5), k('Win', '', 1.25), k('Alt', 'Alt', 1.25), k('Space', '', 5.5), k('AltGr', 'Alt Gr', 1.25, 'is-dead'), k('Ctrl', 'Strg', 1.25), { arrows: true, w: 3 }],
  ];

  const MOD_TOKENS = ['Ctrl', 'Shift', 'Alt', 'Win'];

  function keyButton(key) {
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.className = `vk-key ${key.cls}`.trim();
    if (MOD_TOKENS.includes(key.t)) b.classList.add('is-mod');
    b.dataset.token = key.t;
    b.style.flexGrow = key.w;
    if (key.t === 'Win') {
      b.innerHTML = TM.ui.WIN_LOGO;
      b.setAttribute('aria-label', 'Windows-Taste');
    } else if (key.t === 'Space') {
      b.setAttribute('aria-label', 'Leertaste');
    } else {
      b.textContent = key.l;
    }
    return b;
  }

  function arrowCluster(w) {
    const box = document.createElement('div');
    box.className = 'vk-arrows';
    box.style.flexGrow = w;
    const col = document.createElement('div');
    col.className = 'vk-arrows-col';
    col.append(keyButton(k('ArrowUp', '↑', 1, 'is-half')), keyButton(k('ArrowDown', '↓', 1, 'is-half')));
    box.append(keyButton(k('ArrowLeft', '←')), col, keyButton(k('ArrowRight', '→')));
    return box;
  }

  function create(host, { interactive = true } = {}) {
    host.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'vk' + (interactive ? '' : ' is-passive');
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Bildschirmtastatur');

    ROWS.forEach((row) => {
      const r = document.createElement('div');
      r.className = 'vk-row';
      row.forEach((key) => r.appendChild(key.arrows ? arrowCluster(key.w) : keyButton(key)));
      wrap.appendChild(r);
    });
    host.appendChild(wrap);

    const keysFor = (tok) => wrap.querySelectorAll(`[data-token="${CSS.escape(tok)}"]`);
    const setState = (tok, cls, on) => keysFor(tok).forEach((b) => b.classList.toggle(cls, on));

    // Fokus nicht klauen (z. B. Markierung im Textfeld behalten)
    wrap.addEventListener('mousedown', (e) => {
      if (e.target.closest('.vk-key')) e.preventDefault();
    });
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('.vk-key');
      if (!b || !interactive || b.classList.contains('is-dead')) return;
      TM.keys.press(b.dataset.token);
    });

    // Aktuellen Einrast-Zustand übernehmen
    MOD_TOKENS.forEach((t) => setState(t, 'is-latched', TM.keys.isLatched(t)));

    const off = TM.keys.on((ev) => {
      if (ev.type === 'down') setState(ev.token, 'is-down', true);
      else if (ev.type === 'up') setState(ev.token, 'is-down', false);
      else if (ev.type === 'latch') setState(ev.token, 'is-latched', ev.on);
    });

    return {
      setTargets(combos) {
        wrap.querySelectorAll('.is-target').forEach((b) => b.classList.remove('is-target'));
        [].concat(combos || []).forEach((c) => {
          const p = TM.keys.parse(c);
          [...p.mods, p.key].filter(Boolean).forEach((t) => setState(t, 'is-target', true));
        });
      },
      destroy() {
        off();
        host.innerHTML = '';
      },
    };
  }

  TM.Keyboard = { create };
})(window.TM);
