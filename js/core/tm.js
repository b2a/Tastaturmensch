/*
 * Tastaturmensch – globaler Namensraum.
 *
 * Alles hängt an window.TM. So läuft die Seite ohne Build-Schritt,
 * auf GitHub Pages und auch direkt per Doppelklick (file://).
 *
 * Erweitern:
 *   TM.addChapter({...})            → neues Kapitel mit Lektionen (siehe js/data/lessons/)
 *   TM.registerExercise('typ', {...}) → neuer Übungstyp (siehe js/exercises/)
 *   TM.registerView('name', {...})  → neue Ansicht (siehe js/views/)
 *
 * TM.chapters / TM.lessons enthalten immer die Fassung für das aktuelle System
 * (Windows oder Mac, siehe js/core/platform.js). Die Rohdaten liegen in rawChapters.
 */
window.TM = (function () {
  const rawChapters = [];
  const chapters = [];
  const lessons = [];
  const exercises = {};
  const views = {};

  const TM = {
    chapters,
    lessons,
    exercises,
    views,
    quiz: [],

    addChapter(chapter) {
      if (!chapter || !chapter.id) throw new Error('Kapitel braucht eine id');
      chapter.lessons = (chapter.lessons || []).map((l) => Object.assign({ level: 1 }, l, { chapterId: chapter.id }));
      rawChapters.push(chapter);
      rawChapters.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      TM.rebuild();
    },

    /* Kapitel und Lektionen für das aktuelle System neu zusammenstellen. */
    rebuild() {
      const P = TM.platform;
      chapters.length = 0;
      lessons.length = 0;
      rawChapters.forEach((c) => {
        const ac = P ? P.adaptChapter(c) : c;
        if (!ac) return;
        const ls = c.lessons.map((l) => (P ? P.adaptLesson(l) : l)).filter(Boolean);
        if (!ls.length) return;
        chapters.push(Object.assign({}, ac, { lessons: ls }));
        lessons.push(...ls);
      });
    },

    /* Quizfragen für das aktuelle System. */
    quizItems() {
      const P = TM.platform;
      return TM.quiz.map((q) => (P ? P.adaptQuiz(q) : q)).filter(Boolean);
    },

    registerExercise(type, impl) {
      exercises[type] = Object.assign({ virtualInput: true }, impl);
    },

    registerView(name, impl) {
      views[name] = impl;
    },

    lesson(id) {
      return lessons.find((l) => l.id === id) || null;
    },

    /* Lektion unabhängig vom System (z. B. für "gibt es nur unter Windows"). */
    rawLesson(id) {
      for (const c of rawChapters) {
        const l = c.lessons.find((x) => x.id === id);
        if (l) return l;
      }
      return null;
    },

    chapter(id) {
      return chapters.find((c) => c.id === id) || null;
    },
  };
  return TM;
})();
