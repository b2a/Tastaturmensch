/* Einstiegs-Quiz: eine Frage pro Bildschirm, Antworten auch per Taste 1–5. */
(function (TM) {
  const { rich, esc } = TM.ui;
  const DONT_KNOW = 'Weiß ich nicht';

  TM.registerView('quiz', {
    title: 'Quiz',
    render(main) {
      const questions = TM.quizItems();
      const answers = {};
      let qi = 0;
      let answered = false;
      let options = [];

      main.innerHTML = `
        <section class="page quiz">
          <div class="quiz-progress" aria-hidden="true"><span></span></div>
          <p class="eyebrow quiz-count" aria-live="polite"></p>
          <div class="quiz-card card"></div>
        </section>`;

      const card = main.querySelector('.quiz-card');
      const bar = main.querySelector('.quiz-progress span');
      const count = main.querySelector('.quiz-count');

      function buildOptions(q) {
        if (q.type === 'self') return q.options.map((o, index) => ({ text: o.text, index }));
        const list = TM.ui.shuffle(q.options.map((text, index) => ({ text, index })));
        list.push({ text: DONT_KNOW, index: -1 });
        return list;
      }

      function show() {
        const q = questions[qi];
        answered = false;
        options = buildOptions(q);
        bar.style.transform = `scaleX(${qi / questions.length})`;
        count.textContent = `Frage ${qi + 1} von ${questions.length}`;
        card.innerHTML = `
          <h1 class="quiz-question">${rich(q.question)}</h1>
          <div class="quiz-options" role="group" aria-label="Antworten">
            ${options
              .map(
                (o, k) => `<button type="button" class="quiz-option${o.index === -1 ? ' is-dontknow' : ''}" data-k="${k}">
                  <span class="key quiz-num" aria-hidden="true">${k + 1}</span><span class="quiz-option-text">${rich(o.text)}</span>
                </button>`
              )
              .join('')}
          </div>
          <div class="quiz-feedback" aria-live="polite"></div>
          <div class="quiz-actions"></div>`;
        card.classList.remove('is-entering');
        void card.offsetWidth;
        card.classList.add('is-entering');
        card.querySelectorAll('.quiz-option').forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.k))));
        const first = card.querySelector('.quiz-option');
        if (first) first.focus({ preventScroll: true });
      }

      function choose(k) {
        if (answered) return;
        const q = questions[qi];
        const o = options[k];
        if (!o) return;
        answered = true;
        const isSelf = q.type === 'self';
        const correct = !isSelf && o.index === q.correct;
        answers[q.id] = { index: o.index, correct };

        card.querySelectorAll('.quiz-option').forEach((b, idx) => {
          b.disabled = true;
          const opt = options[idx];
          if (isSelf) b.classList.toggle('is-chosen', idx === k);
          else if (opt.index === q.correct) b.classList.add('is-correct');
          else if (idx === k) b.classList.add('is-wrong');
        });

        const fb = card.querySelector('.quiz-feedback');
        if (isSelf) fb.innerHTML = '<p>Danke! Jetzt ein paar kurze Wissensfragen.</p>';
        else if (correct) fb.innerHTML = `<p class="fb-ok"><strong>Richtig!</strong> ${rich(q.explain || '')}</p>`;
        else fb.innerHTML = `<p class="fb-learn"><strong>${o.index === -1 ? 'Kein Problem – genau dafür gibt es die Lernreise.' : 'Nicht ganz.'}</strong> ${rich(q.explain || '')}</p>`;

        const last = qi === questions.length - 1;
        card.querySelector('.quiz-actions').innerHTML = `<button type="button" class="btn btn-primary quiz-next">${last ? 'Ergebnis anzeigen' : 'Nächste Frage'} <span class="key key-small" aria-hidden="true">Enter</span></button>`;
        const nextBtn = card.querySelector('.quiz-next');
        nextBtn.addEventListener('click', next);
        nextBtn.focus({ preventScroll: true });
      }

      function next() {
        if (!answered) return;
        if (qi < questions.length - 1) {
          qi++;
          show();
          return;
        }
        bar.style.transform = 'scaleX(1)';
        TM.store.set({ quiz: TM.journey.evaluate(answers) });
        location.hash = '#/ergebnis';
      }

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || e.mods.length) return;
        if (/^[1-9]$/.test(e.key) && !answered) {
          e.event && e.event.preventDefault();
          choose(Number(e.key) - 1);
        } else if (e.key === 'Enter' && answered && !TM.ui.isInteractiveTarget(e) && !e.repeat) {
          next();
        }
      });

      show();
      return { destroy: off };
    },
  });
})(window.TM);
