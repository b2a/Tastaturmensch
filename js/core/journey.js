/* Lernreise: Niveau aus dem Quiz, Status jeder Lektion, nächste Lektion. */
(function (TM) {
  const LEVELS = {
    1: { name: 'Einsteiger', text: 'Du machst noch viel mit der Maus. Perfekt – hier holst du am meisten raus.' },
    2: { name: 'Fortgeschritten', text: 'Die Basics sitzen. Jetzt kommen die Kombis, die richtig Zeit sparen.' },
    3: { name: 'Profi', text: 'Du kennst dich aus. Wir zeigen dir die Tricks, die selbst Profis oft nicht kennen.' },
  };

  const quiz = () => TM.store.get().quiz;
  const level = () => (quiz() && quiz().level) || 1;
  const isKnown = (id) => Boolean(quiz() && (quiz().known || []).includes(id));

  function status(lesson) {
    if (TM.store.isDone(lesson.id)) return 'done';
    if (isKnown(lesson.id)) return 'known';
    return 'todo';
  }

  /* Lektionen, die über dem aktuellen Niveau liegen, sind "Extra" und kommen zuletzt. */
  function isExtra(lesson) {
    return (lesson.level || 1) > level() + 1;
  }

  function next(afterId) {
    const list = TM.lessons;
    const start = afterId ? list.findIndex((l) => l.id === afterId) + 1 : 0;
    const ordered = [...list.slice(start), ...list.slice(0, start)];
    return (
      ordered.find((l) => status(l) === 'todo' && !isExtra(l)) ||
      ordered.find((l) => status(l) === 'todo') ||
      null
    );
  }

  function stats() {
    const all = TM.lessons;
    const count = (s) => all.filter((l) => status(l) === s).length;
    const done = count('done');
    const todo = count('todo');
    return { total: all.length, done, todo, known: count('known'), progress: done + todo ? done / (done + todo) : 1 };
  }

  /* Quiz auswerten → Niveau + Lektionen, die man schon kann. */
  function evaluate(answers) {
    let self = 1;
    let correct = 0;
    let total = 0;
    const known = new Set();
    const wrong = new Set();

    TM.quizItems().forEach((q) => {
      const a = answers[q.id];
      if (!a) return;
      if (q.type === 'self') {
        self = q.options[a.index].level || 1;
        return;
      }
      total++;
      if (a.correct) {
        correct++;
        (q.lessons || []).forEach((id) => known.add(id));
      } else {
        (q.lessons || []).forEach((id) => wrong.add(id));
      }
    });

    const ratio = total ? correct / total : 0;
    const knowledge = ratio >= 0.75 ? 3 : ratio >= 0.4 ? 2 : 1;
    const lvl = Math.max(1, Math.min(3, Math.round((self + 2 * knowledge) / 3)));

    // Was unter dem eigenen Niveau liegt und nicht falsch beantwortet wurde, gilt als bekannt.
    TM.lessons.forEach((l) => {
      if ((l.level || 1) < lvl && !wrong.has(l.id)) known.add(l.id);
    });
    wrong.forEach((id) => known.delete(id));

    return { level: lvl, correct, total, known: [...known], date: Date.now() };
  }

  TM.journey = { LEVELS, level, status, isExtra, next, stats, evaluate };
})(window.TM);
