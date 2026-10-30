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
  /* "Win" = Meta-Taste (Windows-Taste bzw. ⌘ Cmd am Mac). "Fn" gibt es nur virtuell. */
  const MODS = ['Fn', 'Ctrl', 'Win', 'Alt', 'Shift'];
  const isMac = () => Boolean(TM.platform && TM.platform.isMac());

  const ALIAS = {
    strg: 'Ctrl', ctrl: 'Ctrl', control: 'Ctrl',
    win: 'Win', meta: 'Win', os: 'Win', windows: 'Win', cmd: 'Win', command: 'Win', '⌘': 'Win',
    alt: 'Alt', option: 'Alt', opt: 'Alt', '⌥': 'Alt',
    fn: 'Fn',
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
    PageUp: 'Bild ↑', PageDown: 'Bild ↓', PrintScreen: 'Druck', Klick: 'Klick', Fn: 'Fn',
  };

  const MAC_LABEL = {
    Ctrl: '⌃ Ctrl', Win: '⌘ Cmd', Alt: '⌥ Option', Shift: '⇧ Shift', Fn: 'fn',
    Backspace: '⌫', Delete: '⌦ Entf', Enter: '↩ Return', Escape: 'esc', Home: 'Home', End: 'End', Tab: '⇥ Tab',
    PageUp: 'Page ↑', PageDown: 'Page ↓',
  };

  /* Kombis, die das System oder der Browser schlucken, bevor die Seite sie sieht. */
  const LISTS = {
    win: {
      reserved: [
        'Ctrl+T', 'Ctrl+W', 'Ctrl+N', 'Ctrl+Shift+T', 'Ctrl+Shift+N', 'Ctrl+Shift+W',
        'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Alt+Tab', 'Alt+Shift+Tab', 'Alt+F4',
        'Ctrl+Shift+Escape', 'Ctrl+Alt+Delete',
      ],
      // würden diese Seite schließen
      dangerous: ['Ctrl+W', 'Alt+F4', 'Ctrl+Shift+W'],
      // könnten die Seite neu laden (werden abgefangen, aber sicher ist sicher)
      unload: ['Ctrl+R', 'F5', 'Ctrl+F5'],
    },
    mac: {
      reserved: [
        'Cmd+T', 'Cmd+W', 'Cmd+N', 'Cmd+Q', 'Cmd+H', 'Cmd+M', 'Cmd+Alt+H',
        'Cmd+Shift+T', 'Cmd+Shift+N', 'Cmd+Shift+W', 'Cmd+Tab', 'Cmd+Shift+Tab',
        'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Cmd+Space', 'Ctrl+Space', 'Ctrl+Cmd+Space', 'Ctrl+Cmd+Q', 'Ctrl+Cmd+F',
        'Cmd+Alt+Escape', 'Cmd+Shift+3', 'Cmd+Shift+4', 'Cmd+Shift+5', 'Ctrl+Cmd+Shift+4',
        'Ctrl+ArrowUp', 'Ctrl+ArrowDown', 'Ctrl+ArrowLeft', 'Ctrl+ArrowRight',
      ],
      dangerous: ['Cmd+W', 'Cmd+Q', 'Cmd+Shift+W'],
      unload: ['Cmd+R', 'Cmd+Shift+R'],
    },
  };

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

  const listCache = {};
  function list(kind) {
    const p = isMac() ? 'mac' : 'win';
    const key = p + kind;
    if (!listCache[key]) listCache[key] = LISTS[p][kind].map(canon);
    return listCache[key];
  }

  function isReserved(combo) {
    const mods = parse(combo).mods;
    if (mods.includes('Fn')) return true;
    if (!isMac() && mods.includes('Win')) return true;
    return list('reserved').includes(canon(combo));
  }
  function isDangerous(combo) {
    return list('dangerous').includes(canon(combo));
  }
  function risksUnload(combo) {
    return isDangerous(combo) || list('unload').includes(canon(combo));
  }

  function label(tok) {
    return (isMac() && MAC_LABEL[tok]) || LABEL[tok] || tok;
  }

  /* ---------- Ereignisse ---------- */

  const MOD_OF_KEY = { Control: 'Ctrl', Shift: 'Shift', Alt: 'Alt', Meta: 'Win', OS: 'Win' };
  const listeners = new Set();
  const latched = new Set();
  const held = new Set();
  const downKeys = new Set();
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
    // Mac: Option+Buchstabe liefert Sonderzeichen (z. B. ⌥+H = ˙) – dann den Buchstaben der Taste nehmen
    if (e.altKey && /^Key[A-Z]$/.test(e.code) && !/^[a-zäöü]$/i.test(k)) {
      let letter = e.code.slice(3);
      if (/^de/i.test(navigator.language || '')) letter = letter === 'Y' ? 'Z' : letter === 'Z' ? 'Y' : letter;
      return letter;
    }
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
    downKeys.add(key);
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
      // Mac: Solange ⌘ gedrückt ist, kommen für andere Tasten keine keyup-Ereignisse
      if (mod === 'Win') {
        downKeys.forEach((t) => emit({ type: 'up', token: t, source: 'real' }));
        downKeys.clear();
      }
      return;
    }
    const key = keyFromEvent(e);
    if (key) {
      downKeys.delete(key);
      emit({ type: 'up', token: key, source: 'real', event: e });
    }
  });

  window.addEventListener('blur', () => {
    [...held, ...downKeys].forEach((t) => emit({ type: 'up', token: t, source: 'real' }));
    held.clear();
    downKeys.clear();
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
    risksUnload,
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
