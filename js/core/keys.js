/*
 * Tastenkombinationen erkennen, vergleichen und anzeigen.
 *
 * Schreibweise in den Daten: "Ctrl+Shift+ArrowRight", "Win+Period", "Alt+F4" …
 * Deutsche Namen gehen auch: "Strg+Umschalt+Entf", "Win+Pos1".
 *
 * Sondertasten wie Win oder Strg+W fängt Windows bzw. der Browser ab. Darum gibt es
 * "eingerastete" Tasten: Ein Klick auf der Bildschirmtastatur hält z. B. Win fest,
 * die zweite Taste kommt dann von der echten Tastatur (oder auch per Klick).
 */
(function (TM) {
  const MODS = ['Ctrl', 'Win', 'Alt', 'Shift'];

  const ALIAS = {
    strg: 'Ctrl', ctrl: 'Ctrl', control: 'Ctrl',
    win: 'Win', meta: 'Win', os: 'Win', windows: 'Win',
    alt: 'Alt',
    shift: 'Shift', umschalt: 'Shift',
    esc: 'Escape', escape: 'Escape',
    entf: 'Delete', del: 'Delete', delete: 'Delete',
    pos1: 'Home', home: 'Home', ende: 'End', end: 'End',
    enter: 'Enter', return: 'Enter', tab: 'Tab',
    space: 'Space', leertaste: 'Space',
    backspace: 'Backspace', 'rücktaste': 'Backspace',
    arrowleft: 'ArrowLeft', left: 'ArrowLeft', '←': 'ArrowLeft',
    arrowright: 'ArrowRight', right: 'ArrowRight', '→': 'ArrowRight',
    arrowup: 'ArrowUp', up: 'ArrowUp', '↑': 'ArrowUp',
    arrowdown: 'ArrowDown', down: 'ArrowDown', '↓': 'ArrowDown',
    plus: 'Plus', minus: 'Minus', period: 'Period', punkt: 'Period', comma: 'Comma', komma: 'Comma',
    pageup: 'PageUp', pagedown: 'PageDown', printscreen: 'PrintScreen', druck: 'PrintScreen',
    klick: 'Klick', click: 'Klick',
  };

  const LABEL = {
    Ctrl: 'Strg', Win: 'Win', Alt: 'Alt', Shift: 'Shift',
    ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓',
    Escape: 'Esc', Delete: 'Entf', Home: 'Pos1', End: 'Ende',
    Backspace: 'Rücktaste', Enter: 'Enter', Tab: 'Tab', Space: 'Leertaste',
    Plus: '+', Minus: '-', Period: '.', Comma: ',',
    PageUp: 'Bild ↑', PageDown: 'Bild ↓', PrintScreen: 'Druck', Klick: 'Klick',
  };

  /* Kombis, die Windows oder der Browser schlucken, bevor die Seite sie sieht. */
  const RESERVED = [
    'Ctrl+T', 'Ctrl+W', 'Ctrl+N', 'Ctrl+Shift+T', 'Ctrl+Shift+N', 'Ctrl+Shift+W',
    'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Alt+Tab', 'Alt+Shift+Tab', 'Alt+F4',
    'Ctrl+Shift+Escape', 'Ctrl+Alt+Delete',
  ];
  /* Kombis, die diese Seite schließen würden, wenn man sie echt drückt. */
  const DANGEROUS = ['Ctrl+W', 'Alt+F4', 'Ctrl+Shift+W'];

  function token(raw) {
    const s = String(raw).trim();
    const low = s.toLowerCase();
    if (ALIAS[low]) return ALIAS[low];
    if (/^f\d{1,2}$/i.test(s)) return 'F' + s.slice(1);
    if (s.length === 1) return s.toUpperCase();
    return s;
  }

  function parse(combo) {
    const toks = String(combo).split('+').filter(Boolean).map(token);
    const mods = MODS.filter((m) => toks.includes(m));
    const rest = toks.filter((t) => !MODS.includes(t));
    return { mods, key: rest.length ? rest[rest.length - 1] : null };
  }

  function canon(combo) {
    const p = parse(combo);
    return [...p.mods, p.key].filter(Boolean).join('+');
  }

  function matches(combo, targets) {
    if (!targets) return false;
    const c = canon(combo);
    return [].concat(targets).some((t) => canon(t) === c);
  }

  const RESERVED_C = RESERVED.map(canon);
  const DANGEROUS_C = DANGEROUS.map(canon);

  function isReserved(combo) {
    return parse(combo).mods.includes('Win') || RESERVED_C.includes(canon(combo));
  }
  function isDangerous(combo) {
    return DANGEROUS_C.includes(canon(combo));
  }

  function label(tok) {
    return LABEL[tok] ?? tok;
  }

  /* ---------- Ereignisse ---------- */

  const MOD_OF_KEY = { Control: 'Ctrl', Shift: 'Shift', Alt: 'Alt', Meta: 'Win', OS: 'Win' };
  const listeners = new Set();
  const latched = new Set();
  const held = new Set();
  let sticky = false;

  function emit(evt) {
    [...listeners].forEach((fn) => {
      try {
        fn(evt);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function keyFromEvent(e) {
    const k = e.key;
    if (!k || MOD_OF_KEY[k] || k === 'AltGraph' || k === 'Dead' || k === 'Unidentified') return null;
    if (/^Digit\d$/.test(e.code)) return e.code.slice(5);
    if (/^Numpad\d$/.test(e.code)) return e.code.slice(6);
    if (e.code === 'Period') return 'Period';
    if (e.code === 'Comma') return 'Comma';
    if (k === ' ' || e.code === 'Space') return 'Space';
    if (k === '+') return 'Plus';
    if (k === '-') return 'Minus';
    if (k.length === 1) return k.toUpperCase();
    return token(k);
  }

  function build(mods, key) {
    const set = new Set(mods);
    return [...MODS.filter((m) => set.has(m)), key].filter(Boolean).join('+');
  }

  function realMods(e) {
    const m = [];
    if (e.ctrlKey) m.push('Ctrl');
    if (e.metaKey) m.push('Win');
    if (e.altKey) m.push('Alt');
    if (e.shiftKey) m.push('Shift');
    // AltGr meldet sich unter Windows als Strg+Alt – das ist keine Kombination
    if (e.getModifierState && e.getModifierState('AltGraph')) {
      return m.filter((x) => x !== 'Ctrl' && x !== 'Alt');
    }
    return m;
  }

  document.addEventListener('keydown', (e) => {
    const mod = MOD_OF_KEY[e.key];
    if (mod) {
      held.add(mod);
      emit({ type: 'down', token: mod, source: 'real', event: e });
      return;
    }
    const key = keyFromEvent(e);
    if (!key) return;
    emit({ type: 'down', token: key, source: 'real', event: e });
    const usedLatch = latched.size > 0;
    const mods = new Set([...realMods(e), ...latched]);
    emit({
      type: 'combo',
      combo: build([...mods], key),
      key,
      mods: MODS.filter((m) => mods.has(m)),
      source: usedLatch ? 'virtual' : 'real',
      repeat: e.repeat,
      event: e,
    });
    if (usedLatch && !sticky) clearLatch();
  });

  document.addEventListener('keyup', (e) => {
    const mod = MOD_OF_KEY[e.key];
    if (mod) {
      held.delete(mod);
      emit({ type: 'up', token: mod, source: 'real', event: e });
      emit({ type: 'release', token: mod, source: 'real', event: e });
      return;
    }
    const key = keyFromEvent(e);
    if (key) emit({ type: 'up', token: key, source: 'real', event: e });
  });

  window.addEventListener('blur', () => {
    held.forEach((t) => emit({ type: 'up', token: t, source: 'real' }));
    held.clear();
  });

  /* ---------- Virtuelle Tasten (Bildschirmtastatur) ---------- */

  function toggleLatch(tok, force) {
    tok = token(tok);
    const on = force === undefined ? !latched.has(tok) : force;
    if (on === latched.has(tok)) return;
    if (on) latched.add(tok);
    else latched.delete(tok);
    emit({ type: 'latch', token: tok, on });
    if (!on) emit({ type: 'release', token: tok, source: 'virtual' });
  }

  function clearLatch() {
    [...latched].forEach((t) => toggleLatch(t, false));
  }

  function press(tok) {
    tok = token(tok);
    if (MODS.includes(tok)) {
      toggleLatch(tok);
      return;
    }
    emit({ type: 'down', token: tok, source: 'virtual' });
    setTimeout(() => emit({ type: 'up', token: tok, source: 'virtual' }), 160);
    const mods = new Set([...latched, ...held]);
    emit({
      type: 'combo',
      combo: build([...mods], tok),
      key: tok,
      mods: MODS.filter((m) => mods.has(m)),
      source: 'virtual',
      repeat: false,
      event: null,
    });
    if (!sticky) clearLatch();
  }

  TM.keys = {
    MODS,
    token,
    parse,
    canon,
    matches,
    label,
    isReserved,
    isDangerous,
    on(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    press,
    toggleLatch,
    clearLatch,
    isLatched: (t) => latched.has(token(t)),
    isHeld: (t) => held.has(token(t)) || latched.has(token(t)),
    setSticky(v) {
      sticky = Boolean(v);
    },
    /* Wurde dieser Tastendruck wohl absichtlich als Kombination gemeint? */
    looksLikeAttempt(evt) {
      const m = evt.mods.filter((x) => x !== 'Shift');
      return m.length > 0 || /^F\d+$/.test(evt.key);
    },
  };
})(window.TM);
