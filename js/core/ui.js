/* Kleine Helfer für Darstellung, Animation und Texte. */
(function (TM) {
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const WIN_LOGO =
    '<svg class="win-logo" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h7.4v7.4H0zM8.6 0H16v7.4H8.6zM0 8.6h7.4V16H0zM8.6 8.6H16V16H8.6z"/></svg>';

  function keyInner(tok) {
    const t = TM.keys.token(tok);
    if (t === 'Win') return WIN_LOGO + '<span>Win</span>';
    return esc(TM.keys.label(t));
  }

  /* Eine einzelne Taste als <kbd> (oder als Button, wenn tag="button"). */
  function kbd(tok, tag = 'kbd', attrs = '') {
    const t = TM.keys.token(tok);
    const wide = TM.keys.label(t).length > 2 || t === 'Win' ? ' key-wide' : '';
    return `<${tag} class="key${wide}" data-token="${esc(t)}" ${attrs}>${keyInner(t)}</${tag}>`;
  }

  /* "Ctrl+C" → Strg + C als Tastenkappen. Arrays werden mit "oder" verbunden. */
  function combo(c) {
    if (Array.isArray(c)) return c.map(combo).join('<span class="combo-or">oder</span>');
    const parts = String(c).split('+').filter(Boolean);
    return `<span class="combo">${parts.map((p) => kbd(p)).join('<span class="combo-plus" aria-hidden="true">+</span>')}</span>`;
  }

  /* Text mit {Ctrl+C}-Platzhaltern in HTML mit Tastenkappen umwandeln.
     Alternativen: {Ctrl+Y|Ctrl+Shift+Z}. Die Daten dürfen einfaches HTML enthalten. */
  function rich(s) {
    return String(s ?? '').replace(/\{([^{}]+)\}/g, (_, inner) => combo(inner.includes('|') ? inner.split('|') : inner));
  }

  function toast(html, tone = 'info') {
    const region = document.getElementById('toasts');
    if (!region) return;
    const el = document.createElement('div');
    el.className = `toast toast-${tone}`;
    el.innerHTML = rich(html);
    region.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 200);
    }, 2600);
  }

  /* Konfetti als kurzer Erfolgs-Moment. Bewusste Ausnahme von den 100–300 ms:
     einmalig, nur transform/opacity, bei reduzierter Bewegung komplett aus. */
  function confetti(anchor) {
    if (reduceMotion() || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'confetti';
    layer.style.left = `${r.left + r.width / 2}px`;
    layer.style.top = `${r.top + Math.min(60, r.height / 2)}px`;
    document.body.appendChild(layer);
    const colors = ['var(--accent)', 'var(--success)', '#f59f00', '#e64980', '#15aabf'];
    const n = 30;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.background = colors[i % colors.length];
      if (i % 3 === 0) p.style.borderRadius = '50%';
      layer.appendChild(p);
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const dist = 70 + Math.random() * 130;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 50;
      p.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy + 140}px) rotate(${Math.random() * 600 - 300}deg) scale(0.8)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 400, easing: EASE_OUT, fill: 'forwards' }
      );
    }
    setTimeout(() => layer.remove(), 1500);
  }

  /* FLIP: Layout sofort ändern, dann per transform weich hinübergleiten. */
  function flip(el, mutate, duration = 300) {
    const first = el.getBoundingClientRect();
    mutate();
    const last = el.getBoundingClientRect();
    if (reduceMotion() || !first.width || !last.width || !first.height || !last.height) return;
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width;
    const sy = first.height / last.height;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
    el.animate(
      [
        { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transformOrigin: 'top left', transform: 'none' },
      ],
      { duration, easing: EASE_OUT }
    );
  }

  function shake(el) {
    if (!el || reduceMotion()) return;
    el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
      { duration: 300, easing: 'ease-out' }
    );
  }

  /* Kurz "aufploppen" lassen (Erfolg). */
  function pop(el) {
    if (!el || reduceMotion()) return;
    el.animate([{ transform: 'scale(0.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 200, easing: EASE_OUT });
  }

  function onBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
  }
  function guardUnload(on) {
    window.removeEventListener('beforeunload', onBeforeUnload);
    if (on) window.addEventListener('beforeunload', onBeforeUnload);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Ist der Fokus gerade in einem Eingabefeld/Button? Dann Enter & Co. nicht abfangen. */
  function isInteractiveTarget(evt) {
    const t = evt && evt.event && evt.event.target;
    return Boolean(t && t.closest && t.closest('button, a, input, textarea, select, [contenteditable="true"]'));
  }

  TM.ui = { esc, kbd, keyInner, combo, rich, toast, confetti, flip, shake, pop, guardUnload, shuffle, reduceMotion, isInteractiveTarget, WIN_LOGO };

  /* Kleine Prüf-Helfer für Text-Übungen (in den Lektionsdaten nutzbar). */
  TM.check = {
    lines: (t) => String(t).split('\n').map((l) => l.trim()).filter(Boolean),
    norm: (t) => String(t).replace(/\s+/g, ' ').trim(),
    words: (t) => String(t).trim().split(/\s+/).filter(Boolean),
    count: (t, needle) => String(t).split(needle).length - 1,
    sameList: (a, b) => a.length === b.length && a.every((x, i) => x === b[i]),
  };
})(window.TM);
