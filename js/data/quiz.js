/*
 * Einstiegs-Quiz.
 *
 * Fragetypen:
 *   type: 'self'  → Selbsteinschätzung, jede Antwort hat ein level (1–3)
 *   (Standard)    → Wissensfrage: options + correct (Index der richtigen Antwort)
 *
 * lessons: Lektionen, die als "kannst du schon" gelten, wenn richtig beantwortet –
 *          bzw. fest in die Reise kommen, wenn falsch.
 * In Texten werden {Ctrl+C}-Platzhalter als Tastenkappen angezeigt.
 */
TM.quiz = [
  {
    id: 'nutzung',
    type: 'self',
    question: 'Wie oft nutzt du Tastenkombinationen am PC?',
    options: [
      { text: 'Fast nie – ich mache alles mit der Maus.', level: 1 },
      { text: 'Ab und zu, vor allem {Ctrl+C} und {Ctrl+V}.', level: 1 },
      { text: 'Regelmäßig, ich kenne einige.', level: 2 },
      { text: 'Ständig – die Maus ist eher Deko.', level: 3 },
    ],
  },
  {
    id: 'kopieren',
    question: 'Du willst einen Satz kopieren und in eine E-Mail einfügen. Welche Kombis brauchst du?',
    options: ['{Ctrl+C}, dann {Ctrl+V}', '{Ctrl+X}, dann {Ctrl+Z}', '{Ctrl+K}, dann {Ctrl+E}', '{Alt+C}, dann {Alt+V}'],
    correct: 0,
    lessons: ['kopieren-einfuegen'],
    explain: '{Ctrl+C} kopiert, {Ctrl+V} fügt ein. C wie <em>Copy</em> – und V liegt direkt daneben.',
  },
  {
    id: 'rueckgaengig',
    question: 'Ups – du hast aus Versehen einen ganzen Absatz gelöscht. Was hilft sofort?',
    options: ['{Ctrl+Y}', '{Ctrl+Z}', '{Ctrl+X}', '{Ctrl+R}'],
    correct: 1,
    lessons: ['rueckgaengig'],
    explain: '{Ctrl+Z} macht den letzten Schritt rückgängig – in fast jedem Programm, sogar im Explorer.',
  },
  {
    id: 'explorer',
    question: 'Im Explorer willst du die 1., 4. und 7. Datei gleichzeitig auswählen. Welche Taste hältst du beim Klicken?',
    options: ['{Shift}', '{Alt}', '{Ctrl}', '{Win}'],
    correct: 2,
    lessons: ['explorer-auswahl'],
    explain: 'Mit {Ctrl} pickst du einzelne Dateien heraus. {Shift} wählt dagegen alles <em>zwischen</em> zwei Klicks.',
  },
  {
    id: 'markieren',
    question: 'Wie markierst du Text ohne Maus Buchstabe für Buchstabe?',
    options: ['{Ctrl+ArrowRight}', '{Alt+ArrowRight}', '{Tab}', '{Shift+ArrowRight}'],
    correct: 3,
    lessons: ['shift-pfeile'],
    explain: '{Shift} + Pfeiltaste markiert zeichenweise. Mit {Ctrl+Shift+ArrowRight} geht es sogar wortweise.',
  },
  {
    id: 'desktop',
    question: 'Alle Fenster sollen auf einmal verschwinden, du willst den Desktop sehen. Was drückst du?',
    options: ['{Win+D}', '{Win+L}', '{Alt+Tab}', '{Ctrl+D}'],
    correct: 0,
    lessons: ['desktop'],
    explain: '{Win+D} wie <em>Desktop</em>. Nochmal drücken holt alle Fenster zurück.',
  },
  {
    id: 'andocken',
    question: 'Wie schiebst du das aktive Fenster blitzschnell auf die rechte Bildschirmhälfte?',
    options: ['{Ctrl+ArrowRight}', '{Win+ArrowRight}', '{Alt+ArrowRight}', '{Shift+ArrowRight}'],
    correct: 1,
    lessons: ['fenster-andocken'],
    explain: '{Win} + Pfeiltaste dockt Fenster an. Ideal, um zwei Fenster nebeneinander zu haben.',
  },
  {
    id: 'taskleiste',
    question: 'Was passiert bei {Win+3}?',
    options: ['Der dritte virtuelle Desktop öffnet sich.', 'Der Bildschirm zoomt auf 300 %.', 'Das dritte Programm in der Taskleiste öffnet sich.', 'Der Rechner startet.'],
    correct: 2,
    lessons: ['taskleiste'],
    explain: '{Win} + Zahl öffnet das Programm an dieser Stelle der Taskleiste – oder holt es nach vorn.',
  },
  {
    id: 'tab',
    question: 'Du hast aus Versehen einen Browser-Tab geschlossen. Wie holst du ihn zurück?',
    options: ['{Ctrl+Z}', '{Ctrl+T}', '{Ctrl+Shift+T}', '{Alt+F4}'],
    correct: 2,
    lessons: ['browser-tabs'],
    explain: '{Ctrl+Shift+T} öffnet den zuletzt geschlossenen Tab wieder – auch mehrmals hintereinander.',
  },
  {
    id: 'taskmanager',
    question: 'Ein Programm hängt. Wie öffnest du direkt den Task-Manager?',
    options: ['{Ctrl+Alt+T}', '{Win+T}', '{Alt+Escape}', '{Ctrl+Shift+Escape}'],
    correct: 3,
    lessons: ['system-profi'],
    explain: '{Ctrl+Shift+Escape} öffnet den Task-Manager sofort – ohne Umweg über {Ctrl+Alt+Delete}.',
  },
];
