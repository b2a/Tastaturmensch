/* Lektion: Erklärung + Übung + Bildschirmtastatur + Erfolgsmeldung. */
(function (TM) {
  const { esc, rich, combo, kbd } = TM.ui;
  const PLUS = '<span class="combo-plus" aria-hidden="true">+</span>';

  function allCombos(lesson) {
    const ex = lesson.exercise || {};
    const fromSteps = (ex.steps || []).flatMap((s) => [].concat(s.combo || s.target || []));
    return [...lesson.keys, ...fromSteps];
  }

  TM.registerView('lesson', {
    title: 'Lektion',
    render(main, { id }) {
      const lesson = TM.lesson(id);
      if (!lesson) {
        const raw = TM.rawLesson(id);
        const other = TM.platform.isMac() ? 'Windows' : 'Mac';
        main.innerHTML = raw
          ? `<section class="page"><p class="eyebrow">Lektion</p><h1>${esc(raw.title)}</h1>
              <p class="lead">Diese Lektion gibt es nur für ${other}.</p>
              <p class="hero-actions"><a class="btn btn-primary" href="#/reise">Zur Lernreise</a>
              <button type="button" class="btn btn-ghost switch-platform">Auf ${other} umstellen</button></p></section>`
          : `<section class="page"><h1>Lektion nicht gefunden</h1><p><a class="btn btn-primary" href="#/reise">Zur Lernreise</a></p></section>`;
        const sw = main.querySelector('.switch-platform');
        if (sw) sw.addEventListener('click', () => TM.app.setPlatform(TM.platform.isMac() ? 'win' : 'mac'));
        return null;
      }
      document.title = `${lesson.title} – Tastaturmensch`;
      const chapter = TM.chapter(lesson.chapterId);
      const ex = TM.exercises[lesson.exercise && lesson.exercise.type];
      const idx = TM.lessons.indexOf(lesson);
      const prev = TM.lessons[idx - 1];
      const nextInList = TM.lessons[idx + 1];
      const combos = allCombos(lesson);
      const usesReserved = ex && ex.virtualInput && combos.some((c) => TM.keys.isReserved(c));
      const dangerous = combos.some((c) => TM.keys.isDangerous(c));
      const risky = combos.some((c) => TM.keys.risksUnload(c));
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const status = TM.journey.status(lesson);
      const levelName = TM.journey.LEVELS[lesson.level || 1].name;

      main.innerHTML = `
        <article class="page lesson">
          <nav class="crumbs" aria-label="Brotkrümel"><a href="#/reise">Lernreise</a><span aria-hidden="true">›</span><span>${esc(chapter.title)}</span></nav>

          <header class="lesson-head">
            <p class="eyebrow">Lektion ${idx + 1} von ${TM.lessons.length} · ${esc(levelName)}${status === 'done' ? ' · <span class="badge badge-ok">Geschafft</span>' : status === 'known' ? ' · <span class="badge">Kannst du schon</span>' : ''}</p>
            <h1>${esc(lesson.title)}</h1>
            <div class="lesson-keys">${lesson.keys.map((k, n) => `<span class="lesson-key" style="--i:${n}">${combo(k)}</span>`).join('')}</div>
            <p class="lead">${rich(lesson.summary)}</p>
          </header>

          <div class="lesson-grid">
            <section class="card explain">
              <h2>So geht’s</h2>
              ${rich(lesson.explain)}
            </section>
            ${lesson.tip ? `<aside class="card tip"><h2>Profi-Tipp</h2><p>${rich(lesson.tip)}</p></aside>` : ''}
          </div>

          <section class="card practice" aria-labelledby="practice-h">
            <div class="practice-head">
              <h2 id="practice-h">Ausprobieren</h2>
              <button type="button" class="btn btn-ghost btn-small practice-restart">Von vorn</button>
            </div>
            ${
              usesReserved
                ? `<div class="notice notice-sim"><p><strong>So übst du Kombis, die ${TM.platform.osName()} oder der Browser abfangen:</strong> Klick die Sondertaste (z. B. ${kbd('Win')} oder ${kbd(TM.platform.isMac() ? 'Fn' : 'Ctrl')}) bei „Gesucht“ oder auf der Bildschirmtastatur an – sie rastet ein. Dann drück die zweite Taste auf deiner Tastatur oder klick sie ebenfalls an.${dangerous ? ' <strong>Bitte nicht echt drücken:</strong> Das würde diese Seite schließen.' : ''}</p></div>`
                : ''
            }
            ${!ex || ex.virtualInput || !coarse ? '' : '<div class="notice"><p>Für diese Übung brauchst du eine echte Tastatur – am Handy klappt sie leider nicht.</p></div>'}
            <ol class="steps"></ol>
            <div class="target-row">
              <span class="target-label">Gesucht:</span>
              <div class="target-keys"></div>
            </div>
            <div class="stage"></div>
            <p class="status" role="status" aria-live="polite"></p>
            <div class="vk-host"></div>
            <div class="done-panel" hidden></div>
          </section>

          <nav class="lesson-nav" aria-label="Lektionen">
            ${prev ? `<a class="btn btn-ghost" href="#/lektion/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
            <button type="button" class="btn btn-ghost skip-lesson">${status === 'todo' ? 'Kann ich schon – überspringen' : 'Weiter'}</button>
            ${nextInList ? `<a class="btn btn-ghost" href="#/lektion/${nextInList.id}">${esc(nextInList.title)} →</a>` : '<span></span>'}
          </nav>
        </article>`;

      if (risky) TM.ui.guardUnload(true);

      const practice = main.querySelector('.practice');
      const stepsEl = main.querySelector('.steps');
      const targetsEl = main.querySelector('.target-keys');
      const targetRow = main.querySelector('.target-row');
      const stage = main.querySelector('.stage');
      const statusEl = main.querySelector('.status');
      const donePanel = main.querySelector('.done-panel');
      const interactive = !ex || ex.virtualInput;

      const keyboard = TM.Keyboard.create(main.querySelector('.vk-host'), { interactive });

      let instance = null;
      let completedAt = 0;
      let stepTexts = [];

      /* ---- Gesuchte Tasten groß anzeigen (bei Bedarf anklickbar) ---- */
      function renderTargets(c) {
        const first = [].concat(c || [])[0];
        keyboard.setTargets(c);
        targetRow.hidden = !first;
        if (!first) {
          targetsEl.innerHTML = '';
          return;
        }
        const parts = String(first).split('+').filter(Boolean);
        targetsEl.innerHTML = parts
          .map((p) => {
            const t = TM.keys.token(p);
            const clickable = interactive && !/…|Klick/.test(t);
            const latched = TM.keys.isLatched(t) ? ' is-latched' : '';
            const inner = TM.ui.keyInner(t);
            return clickable
              ? `<button type="button" class="key key-big key-btn${latched}" data-token="${esc(t)}" aria-label="Taste ${esc(TM.keys.label(t))} drücken">${inner}</button>`
              : `<kbd class="key key-big" data-token="${esc(t)}">${inner}</kbd>`;
          })
          .join(PLUS);
        targetsEl.classList.remove('is-entering');
        void targetsEl.offsetWidth;
        targetsEl.classList.add('is-entering');
      }

      targetsEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) e.preventDefault();
      });
      targetsEl.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-token]');
        if (b) TM.keys.press(b.dataset.token);
      });

      const offKeys = TM.keys.on((e) => {
        if (e.type === 'latch') {
          targetsEl.querySelectorAll(`[data-token="${CSS.escape(e.token)}"]`).forEach((b) => b.classList.toggle('is-latched', e.on));
          if (e.on && interactive && !completedAt) say(`${kbd(e.token)} ist eingerastet – jetzt die zweite Taste.`, 'info');
        } else if (e.type === 'down' || e.type === 'up') {
          targetsEl.querySelectorAll(`[data-token="${CSS.escape(e.token)}"]`).forEach((b) => b.classList.toggle('is-down', e.type === 'down'));
        } else if (e.type === 'combo' && completedAt && e.key === 'Enter' && !e.mods.length && !e.repeat) {
          if (Date.now() - completedAt < 500 || TM.ui.isInteractiveTarget(e)) return;
          const btn = donePanel.querySelector('.go-next');
          if (btn) btn.click();
        }
      });

      function say(html, tone = 'info') {
        statusEl.className = `status status-${tone}`;
        statusEl.innerHTML = rich(html);
        statusEl.classList.remove('is-entering');
        void statusEl.offsetWidth;
        statusEl.classList.add('is-entering');
      }

      const api = {
        lesson,
        steps(list) {
          stepTexts = list;
          stepsEl.innerHTML = list
            .map((s, n) => `<li class="step" style="--i:${n}"><span class="step-check" aria-hidden="true"></span><span class="step-text">${rich(s)}</span></li>`)
            .join('');
        },
        step(i) {
          stepsEl.querySelectorAll('.step').forEach((li, n) => {
            const wasDone = li.classList.contains('is-done');
            li.classList.toggle('is-done', n < i);
            li.classList.toggle('is-current', n === i);
            li.setAttribute('aria-current', n === i ? 'step' : 'false');
            const check = li.querySelector('.step-check');
            check.textContent = n < i ? '✓' : '';
            if (n < i && !wasDone) TM.ui.pop(check);
          });
        },
        targets: renderTargets,
        say,
        wrong(pressed, expected) {
          const exp = [].concat(expected || [])[0];
          say(exp ? `Das war ${combo(pressed)} – gesucht ist ${combo(exp)}.` : `Das war ${combo(pressed)}.`, 'warn');
          TM.ui.shake(stage);
        },
        complete() {
          api.step(stepTexts.length);
          renderTargets([]);
          completedAt = Date.now();
          TM.store.markDone(lesson.id);
          TM.ui.updatePill();
          showDone();
        },
      };

      function showDone() {
        const next = TM.journey.next(lesson.id);
        donePanel.innerHTML = `
          <div class="done-inner">
            <div class="done-badge" aria-hidden="true">✓</div>
            <div class="done-text">
              <h3>Geschafft!</h3>
              <p>Du kannst jetzt ${lesson.keys.map((k) => combo(k)).join(' ')}.</p>
            </div>
            <div class="done-actions">
              ${
                next
                  ? `<a class="btn btn-primary go-next" href="#/lektion/${next.id}">Weiter: ${esc(next.title)} <span class="key key-small" aria-hidden="true">Enter</span></a>`
                  : `<a class="btn btn-primary go-next" href="#/reise">Alle Lektionen geschafft – zur Übersicht</a>`
              }
              <button type="button" class="btn btn-ghost again">Nochmal üben</button>
            </div>
          </div>`;
        donePanel.hidden = false;
        donePanel.classList.remove('is-entering');
        void donePanel.offsetWidth;
        donePanel.classList.add('is-entering');
        donePanel.querySelector('.again').addEventListener('click', start);
        TM.ui.confetti(donePanel.querySelector('.done-badge'));
        // Panel sichtbar machen, ohne zu springen, wenn es schon im Bild ist
        const r = donePanel.getBoundingClientRect();
        if (r.bottom > window.innerHeight) donePanel.scrollIntoView({ behavior: TM.ui.reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      function start() {
        if (instance && instance.destroy) instance.destroy();
        TM.keys.clearLatch();
        TM.keys.setSticky(false);
        completedAt = 0;
        donePanel.hidden = true;
        stage.innerHTML = '';
        statusEl.textContent = '';
        statusEl.className = 'status';
        if (!ex) {
          stage.innerHTML = `<p>Unbekannter Übungstyp „${esc(lesson.exercise && lesson.exercise.type)}“.</p>`;
          return;
        }
        instance = ex.mount(stage, lesson.exercise, api) || null;
      }

      main.querySelector('.practice-restart').addEventListener('click', start);
      main.querySelector('.skip-lesson').addEventListener('click', () => {
        if (TM.journey.status(lesson) === 'todo') TM.store.markDone(lesson.id);
        const n = TM.journey.next(lesson.id);
        location.hash = n ? `#/lektion/${n.id}` : '#/reise';
      });

      start();

      return {
        destroy() {
          if (instance && instance.destroy) instance.destroy();
          offKeys();
          keyboard.destroy();
          TM.ui.guardUnload(false);
        },
      };
    },
  });
})(window.TM);
