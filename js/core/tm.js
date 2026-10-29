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
 */
window.TM = (function () {
  const chapters = [];
  const lessons = [];
  const exercises = {};
  const views = {};

  function rebuildLessons() {
    lessons.length = 0;
    chapters.forEach((c) => lessons.push(...c.lessons));
  }

  return {
    chapters,
    lessons,
    exercises,
    views,
    quiz: [],

    addChapter(chapter) {
      if (!chapter || !chapter.id) throw new Error('Kapitel braucht eine id');
      chapter.lessons = (chapter.lessons || []).map((l) => Object.assign({ level: 1 }, l, { chapterId: chapter.id }));
      chapters.push(chapter);
      chapters.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      rebuildLessons();
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

    chapter(id) {
      return chapters.find((c) => c.id === id) || null;
    },
  };
})();
