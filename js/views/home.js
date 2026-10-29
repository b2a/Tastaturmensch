/* Startseite mit kleiner Tasten-Demo. */
(function (TM) {
  const { combo, rich } = TM.ui;

  const DEMO = [
    { keys: 'Ctrl+C', text: 'Kopieren' },
    { keys: 'Ctrl+V', text: 'Einfügen' },
    { keys: 'Win+ArrowLeft', text: 'Fenster andocken' },
    { keys: 'Win+D', text: 'Desktop zeigen' },
    { keys: 'Ctrl+Shift+T', text: 'Tab zurückholen' },
  ];

  TM.registerView('home', {
    title: 'Start',
    render(main) {
      const st = TM.store.get();
      const hasQuiz = Boolean(st.quiz);
      const next = TM.journey.next();
      const stats = TM.journey.stats();

      main.innerHTML = `
        <section class="page hero">
          <div class="hero-text">
            <p class="eyebrow">Windows-Tastenkombinationen lernen</p>
            <h1>Werde zum <span class="accent">Tastaturmenschen</span>.</h1>
            <p class="lead">Ein kurzes Quiz zeigt, wo du stehst. Danach geht es auf eine kompakte Lernreise – jede Kombi probierst du direkt hier aus und bekommst sofort Rückmeldung.</p>
            <div class="hero-actions">
              ${
                hasQuiz
                  ? `<a class="btn btn-primary" href="${next ? `#/lektion/${next.id}` : '#/reise'}">${next ? 'Weiter lernen' : 'Zur Lernreise'}</a>
                     <a class="btn btn-ghost" href="#/quiz">Quiz neu machen</a>`
                  : `<a class="btn btn-primary" href="#/quiz">Quiz starten</a>
                     <a class="btn btn-ghost" href="#/reise">Direkt zur Lernreise</a>`
              }
            </div>
            ${hasQuiz ? `<p class="hero-meta">${stats.done} von ${stats.done + stats.todo} Lektionen geschafft</p>` : '<p class="hero-meta">10 Fragen · etwa 2 Minuten · Tipp: Antworten gehen auch mit den Tasten 1–5</p>'}
          </div>

          <div class="hero-demo" aria-hidden="true">
            <div class="demo-card">
              <div class="demo-keys"></div>
              <div class="demo-label"></div>
            </div>
          </div>
        </section>

        <section class="page how">
          <ol class="how-list">
            <li class="how-item"><span class="how-num">1</span><div><h2>Kurzes Quiz</h2><p>Zehn Fragen zu deinem Wissensstand. Kein Druck – „Weiß ich nicht“ ist erlaubt.</p></div></li>
            <li class="how-item"><span class="how-num">2</span><div><h2>Deine Lernreise</h2><p>Was du schon kannst, überspringen wir. Der Rest kommt in sinnvoller Reihenfolge.</p></div></li>
            <li class="how-item"><span class="how-num">3</span><div><h2>Direkt ausprobieren</h2><p>Jede Kombi übst du an echten Textfeldern, einem Mini-Explorer oder simulierten Fenstern.</p></div></li>
          </ol>
        </section>`;

      // Kleine Demo: zeigt einmal nacheinander ein paar Kombis und bleibt dann stehen.
      const keysEl = main.querySelector('.demo-keys');
      const labelEl = main.querySelector('.demo-label');
      const reduce = TM.ui.reduceMotion();
      let idx = 0;
      let timer = null;

      function showDemo() {
        const d = DEMO[idx];
        keysEl.innerHTML = combo(d.keys);
        labelEl.innerHTML = rich(d.text);
        keysEl.classList.remove('is-entering');
        void keysEl.offsetWidth;
        keysEl.classList.add('is-entering');
        if (!reduce) {
          const caps = keysEl.querySelectorAll('.key');
          caps.forEach((cap, k) => setTimeout(() => cap.classList.add('is-pressed'), 350 + k * 120));
          setTimeout(() => caps.forEach((cap) => cap.classList.remove('is-pressed')), 350 + caps.length * 120 + 260);
        }
        idx++;
        if (idx < DEMO.length) timer = setTimeout(showDemo, 1700);
      }
      showDemo();

      return { destroy: () => clearTimeout(timer) };
    },
  });
})(window.TM);
