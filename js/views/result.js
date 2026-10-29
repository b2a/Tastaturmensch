/* Ergebnis nach dem Quiz. */
(function (TM) {
  const { esc, combo } = TM.ui;

  TM.registerView('result', {
    title: 'Dein Ergebnis',
    render(main) {
      const q = TM.store.get().quiz;
      if (!q) {
        location.hash = '#/quiz';
        return null;
      }
      const lvl = TM.journey.LEVELS[q.level];
      const stats = TM.journey.stats();
      const next = TM.journey.next();
      const todo = TM.lessons.filter((l) => TM.journey.status(l) === 'todo');

      main.innerHTML = `
        <section class="page result">
          <div class="result-card card">
            <p class="eyebrow">Dein Ergebnis</p>
            <div class="level-meter" aria-hidden="true">
              ${[1, 2, 3].map((n) => `<span class="level-step${n <= q.level ? ' is-on' : ''}" style="--i:${n}"></span>`).join('')}
            </div>
            <h1>${esc(lvl.name)}</h1>
            <p class="lead">${esc(lvl.text)}</p>
            <dl class="result-stats">
              <div><dt>Richtig beantwortet</dt><dd>${q.correct} von ${q.total}</dd></div>
              <div><dt>Kannst du schon</dt><dd>${stats.known} Lektionen</dd></div>
              <div><dt>Deine Reise</dt><dd>${stats.todo} Lektionen</dd></div>
            </dl>
            <div class="result-preview">
              <p class="field-label">Darauf kannst du dich freuen</p>
              <ul class="preview-list">
                ${todo.slice(0, 6).map((l, k) => `<li style="--i:${k}">${combo(l.keys[0])}<span>${esc(l.title)}</span></li>`).join('')}
                ${todo.length > 6 ? `<li class="preview-more" style="--i:6">und ${todo.length - 6} weitere …</li>` : ''}
              </ul>
            </div>
            <div class="hero-actions">
              ${next ? `<a class="btn btn-primary" href="#/lektion/${next.id}">Lernreise starten</a>` : ''}
              <a class="btn btn-ghost" href="#/reise">Alle Stationen ansehen</a>
            </div>
          </div>
        </section>`;
      return null;
    },
  });
})(window.TM);
