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
 *
 * Am Mac werden Fragen automatisch umgerechnet (Strg → Cmd). Abweichende Fragen bekommen
 * `mac: { question, options, correct, explain, lessons }` oder `mac: false`.
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
    mac: { explain: '{Cmd+Z} macht den letzten Schritt rückgängig – in fast jedem Programm, sogar im Finder.' },
  },
  {
    id: 'explorer',
    question: 'Im Explorer willst du die 1., 4. und 7. Datei gleichzeitig auswählen. Welche Taste hältst du beim Klicken?',
    options: ['{Shift}', '{Alt}', '{Ctrl}', '{Win}'],
    correct: 2,
    lessons: ['explorer-auswahl'],
    explain: 'Mit {Ctrl} pickst du einzelne Dateien heraus. {Shift} wählt dagegen alles <em>zwischen</em> zwei Klicks.',
    mac: {
      question: 'Im Finder willst du die 1., 4. und 7. Datei gleichzeitig auswählen. Welche Taste hältst du beim Klicken?',
      options: ['{Shift}', '{Alt}', '{Cmd}', '{Ctrl}'],
      correct: 2,
      explain: 'Mit {Cmd} pickst du einzelne Dateien heraus. {Shift} wählt dagegen alles <em>zwischen</em> zwei Klicks.',
    },
  },
  {
    id: 'markieren',
    question: 'Wie markierst du Text ohne Maus Buchstabe für Buchstabe?',
    options: ['{Ctrl+ArrowRight}', '{Alt+ArrowRight}', '{Tab}', '{Shift+ArrowRight}'],
    correct: 3,
    lessons: ['shift-pfeile'],
    explain: '{Shift} + Pfeiltaste markiert zeichenweise. Mit {Ctrl+Shift+ArrowRight} geht es sogar wortweise.',
    mac: { options: ['{Cmd+ArrowRight}', '{Ctrl+ArrowRight}', '{Tab}', '{Shift+ArrowRight}'] },
  },
  {
    id: 'desktop',
    question: 'Alle Fenster sollen auf einmal verschwinden, du willst den Desktop sehen. Was drückst du?',
    options: ['{Win+D}', '{Win+L}', '{Alt+Tab}', '{Ctrl+D}'],
    correct: 0,
    lessons: ['desktop'],
    explain: '{Win+D} wie <em>Desktop</em>. Nochmal drücken holt alle Fenster zurück.',
    mac: {
      question: 'Du willst das aktive Programm kurz ausblenden, ohne es zu beenden. Was drückst du?',
      options: ['{Cmd+H}', '{Cmd+Q}', '{Cmd+D}', '{Ctrl+H}'],
      correct: 0,
      explain: '{Cmd+H} wie <em>hide</em>. Mit {Cmd+Tab} holst du das Programm zurück. {Cmd+Q} würde es beenden.',
    },
  },
  {
    id: 'andocken',
    question: 'Wie schiebst du das aktive Fenster blitzschnell auf die rechte Bildschirmhälfte?',
    options: ['{Ctrl+ArrowRight}', '{Win+ArrowRight}', '{Alt+ArrowRight}', '{Shift+ArrowRight}'],
    correct: 1,
    lessons: ['fenster-andocken'],
    explain: '{Win} + Pfeiltaste dockt Fenster an. Ideal, um zwei Fenster nebeneinander zu haben.',
    mac: {
      question: 'Wie wechselst du am Mac am schnellsten zwischen offenen Programmen?',
      options: ['{Ctrl+Tab}', '{Cmd+Tab}', '{Alt+Tab}', '{Cmd+W}'],
      correct: 1,
      lessons: ['alt-tab'],
      explain: '{Cmd} gedrückt halten und {Tab} tippen – beim Loslassen wird gewechselt.',
    },
  },
  {
    id: 'taskleiste',
    question: 'Was passiert bei {Win+3}?',
    options: ['Der dritte virtuelle Desktop öffnet sich.', 'Der Bildschirm zoomt auf 300 %.', 'Das dritte Programm in der Taskleiste öffnet sich.', 'Der Rechner startet.'],
    correct: 2,
    lessons: ['taskleiste'],
    explain: '{Win} + Zahl öffnet das Programm an dieser Stelle der Taskleiste – oder holt es nach vorn.',
    mac: {
      question: 'Wie öffnest du am Mac blitzschnell ein Programm, ohne es im Dock oder Launchpad zu suchen?',
      options: ['{Cmd+O}', '{Cmd+Shift+A}', '{Cmd+Space}', '{Ctrl+Space}'],
      correct: 2,
      explain: '{Cmd+Space} öffnet Spotlight: Namen anfangen zu tippen, {Enter} – fertig.',
    },
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
    mac: {
      question: 'Ein Programm hängt. Wie öffnest du „Programme sofort beenden“?',
      options: ['{Cmd+Q}', '{Cmd+Alt+Escape}', '{Ctrl+Escape}', '{Cmd+Shift+Q}'],
      correct: 1,
      explain: '{Cmd+Alt+Escape} öffnet das Fenster „Programme sofort beenden“.',
    },
  },
  {
    id: 'word-fett',
    question: 'Wie machst du in Word markierten Text fett?',
    options: ['{Ctrl+F}', '{Ctrl+B}', '{Ctrl+D}', '{Alt+F}'],
    correct: 1,
    lessons: ['word-formatieren'],
    explain: '{Ctrl+B} wie <em>bold</em>. In deutschem Word geht je nach Version auch {Ctrl+Shift+F}.',
    mac: { explain: '{Cmd+B} wie <em>bold</em> – das klappt auch in Pages, Mail und Notizen.' },
  },
  {
    id: 'excel-springen',
    question: 'In Excel willst du in einer langen Spalte sofort zur letzten gefüllten Zelle. Was drückst du?',
    options: ['{Shift+ArrowDown}', '{Alt+ArrowDown}', '{PageDown}', '{Ctrl+ArrowDown}'],
    correct: 3,
    lessons: ['excel-springen'],
    explain: '{Ctrl} + Pfeiltaste springt an den Rand des Datenbereichs – egal wie lang die Tabelle ist.',
    mac: {
      options: ['{Shift+ArrowDown}', '{Alt+ArrowDown}', '{Fn+ArrowDown}', '{Cmd+ArrowDown}'],
      explain: '{Cmd} + Pfeiltaste springt an den Rand des Datenbereichs – egal wie lang die Tabelle ist.',
    },
  },
];
