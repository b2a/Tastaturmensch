/*
 * Windows oder Mac?
 *
 * Die Lektionen sind in Windows-Schreibweise verfasst. Für den Mac werden sie hier umgerechnet:
 *   - automatisch: Strg → Cmd, Strg+Pfeil → Option+Pfeil, Pos1/Ende → Cmd+Pfeil, Strg+Y → Cmd+Shift+Z …
 *   - von Hand:    jede Lektion, Quizfrage, jedes Kapitel und jeder Übungsschritt kann ein
 *                  `mac: { ... }` mit eigenen Feldern haben (diese werden NICHT umgerechnet),
 *                  oder `mac: false` (gibt es am Mac nicht) bzw. `win: false` (nur Mac).
 *
 * Intern steht "Win" für die Meta-Taste: unter Windows die Windows-Taste, am Mac ⌘ Cmd.
 * In Mac-Texten darf man deshalb einfach {Cmd+C} schreiben.
 */
(function (TM) {
  const NAMES = { win: 'Windows', mac: 'Mac' };

  function detect() {
    const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    const ua = navigator.userAgent || '';
    return /mac|iphone|ipad|ipod/i.test(plat) || /Macintosh|Mac OS X|iPhone|iPad/i.test(ua) ? 'mac' : 'win';
  }
  const detected = detect();

  function current() {
    const p = TM.store.get().platform;
    return p === 'mac' || p === 'win' ? p : detected;
  }
  const isMac = () => current() === 'mac';

  /* Kombis, die am Mac anders heißen als "Strg durch Cmd ersetzen". */
  const SPECIAL_RAW = {
    'Ctrl+ArrowLeft': 'Alt+ArrowLeft',
    'Ctrl+ArrowRight': 'Alt+ArrowRight',
    'Ctrl+ArrowUp': 'Alt+ArrowUp',
    'Ctrl+ArrowDown': 'Alt+ArrowDown',
    'Ctrl+Shift+ArrowLeft': 'Alt+Shift+ArrowLeft',
    'Ctrl+Shift+ArrowRight': 'Alt+Shift+ArrowRight',
    'Ctrl+Backspace': 'Alt+Backspace',
    'Ctrl+Delete': 'Alt+Delete',
    Home: 'Cmd+ArrowLeft',
    End: 'Cmd+ArrowRight',
    'Shift+Home': 'Cmd+Shift+ArrowLeft',
    'Shift+End': 'Cmd+Shift+ArrowRight',
    'Ctrl+Home': 'Cmd+ArrowUp',
    'Ctrl+End': 'Cmd+ArrowDown',
    'Ctrl+Shift+Home': 'Cmd+Shift+ArrowUp',
    'Ctrl+Shift+End': 'Cmd+Shift+ArrowDown',
    'Ctrl+Y': 'Cmd+Shift+Z',
    'Ctrl+Shift+V': 'Cmd+Alt+Shift+V',
    'Ctrl+Tab': 'Ctrl+Tab',
    'Ctrl+Shift+Tab': 'Ctrl+Shift+Tab',
    'Ctrl+Space': 'Ctrl+Space',
    F5: 'Cmd+R',
    'Ctrl+F5': 'Cmd+Shift+R',
    F6: 'Cmd+L',
    'Ctrl+H': 'Cmd+Y',
    'Alt+F4': 'Cmd+Q',
    'Ctrl+Shift+Escape': 'Cmd+Alt+Escape',
    F12: 'Cmd+Shift+S',
  };
  let special = null;
  function specials() {
    if (!special) {
      special = {};
      Object.keys(SPECIAL_RAW).forEach((k) => (special[TM.keys.canon(k)] = SPECIAL_RAW[k]));
    }
    return special;
  }

  function uniq(list) {
    const seen = new Set();
    return list.filter((c) => {
      const k = TM.keys.canon(c);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  /* Eine Windows-Kombi in die Mac-Kombi umrechnen. */
  function toMac(c) {
    if (c === undefined || c === null || c === '') return c;
    if (Array.isArray(c)) return uniq(c.map(toMac));
    const s = String(c);
    const sp = specials()[TM.keys.canon(s)];
    if (sp) return sp;
    const parts = s.split('+').filter(Boolean);
    const toks = parts.map(TM.keys.token);
    if (toks.includes('Win')) return s; // Windows-Taste: braucht eine eigene Mac-Variante
    return parts.map((p, i) => (toks[i] === 'Ctrl' ? 'Cmd' : p)).join('+');
  }

  const map = (c) => (isMac() ? toMac(c) : c);

  /* {Ctrl+C}-Platzhalter in Texten umrechnen. */
  function mapText(s) {
    if (!isMac() || typeof s !== 'string') return s;
    return s.replace(/\{([^{}]+)\}/g, (_, inner) => `{${uniq(inner.split('|').map(toMac)).join('|')}}`);
  }

  const has = (o, k) => Boolean(o) && Object.prototype.hasOwnProperty.call(o, k);
  const pick = (o, k, fallback) => (has(o, k) ? o[k] : fallback());

  function adaptSteps(steps) {
    return steps.map((s) => {
      const out = Object.assign({}, s, {
        say: mapText(s.say),
        ok: mapText(s.ok),
        combo: map(s.combo),
        target: map(s.target),
      });
      if (s.effect) out.effect = Object.assign({}, s.effect, { title: mapText(s.effect.title), text: mapText(s.effect.text) });
      if (s.mac) Object.assign(out, s.mac);
      delete out.mac;
      return out;
    });
  }

  function adaptExercise(ex) {
    if (!ex) return ex;
    const out = Object.assign({}, ex);
    if (ex.steps) out.steps = adaptSteps(ex.steps);
    if (ex.scene) out.scene = Object.assign({}, ex.scene, { title: mapText(ex.scene.title), text: mapText(ex.scene.text) });
    if (ex.mac) Object.assign(out, ex.mac);
    delete out.mac;
    return out;
  }

  function adaptLesson(l) {
    if (!isMac()) return l.win === false ? null : l;
    if (l.mac === false) return null;
    const o = l.mac || {};
    const out = Object.assign({}, l);
    delete out.mac;
    ['title', 'summary', 'explain', 'tip'].forEach((f) => (out[f] = pick(o, f, () => mapText(l[f]))));
    out.keys = pick(o, 'keys', () => uniq(l.keys.map(toMac)));
    out.cheats = pick(o, 'cheats', () => l.cheats && l.cheats.map((c) => Object.assign({}, c, { keys: toMac(c.keys) })));
    out.exercise = pick(o, 'exercise', () => adaptExercise(l.exercise));
    if (has(o, 'level')) out.level = o.level;
    return out;
  }

  function adaptChapter(c) {
    if (!isMac()) return c.win === false ? null : c;
    if (c.mac === false) return null;
    const out = Object.assign({}, c, c.mac || {});
    delete out.mac;
    return out;
  }

  function adaptQuiz(q) {
    if (!isMac()) return q.win === false ? null : q;
    if (q.mac === false) return null;
    const o = q.mac || {};
    const out = Object.assign({}, q);
    delete out.mac;
    out.question = pick(o, 'question', () => mapText(q.question));
    out.explain = pick(o, 'explain', () => mapText(q.explain));
    out.options = pick(o, 'options', () =>
      q.type === 'self' ? q.options.map((op) => Object.assign({}, op, { text: mapText(op.text) })) : q.options.map(mapText)
    );
    if (has(o, 'correct')) out.correct = o.correct;
    if (has(o, 'lessons')) out.lessons = o.lessons;
    return out;
  }

  function apply() {
    document.documentElement.dataset.platform = current();
  }

  function set(p) {
    TM.store.set({ platform: p });
    apply();
    TM.rebuild();
  }

  TM.platform = {
    detected,
    current,
    isMac,
    name: () => NAMES[current()],
    osName: () => (isMac() ? 'macOS' : 'Windows'),
    isAuto: () => !['mac', 'win'].includes(TM.store.get().platform),
    toMac,
    map,
    mapText,
    adaptLesson,
    adaptChapter,
    adaptQuiz,
    set,
  };

  apply();
})(window.TM);
