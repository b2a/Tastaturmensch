/* Kapitel 2 – Text markieren & bearbeiten. Aufbau einer Lektion: siehe 01-grundlagen.js */
TM.addChapter({
  id: 'markieren',
  order: 2,
  title: 'Text markieren',
  description: 'Schneller als jede Maus: Text zeichen-, wort- und zeilenweise auswählen.',
  lessons: [
    {
      id: 'shift-pfeile',
      title: 'Markieren mit Shift',
      level: 1,
      keys: ['Shift+ArrowLeft', 'Shift+ArrowRight'],
      summary: 'Halte Shift gedrückt – und die Pfeiltasten markieren statt nur zu bewegen.',
      explain: `
        <p>Ohne Shift bewegen die Pfeiltasten nur den Cursor. <strong>Mit {Shift}</strong> wird alles markiert, worüber der Cursor wandert.</p>
        <p>{Shift+ArrowRight} und {Shift+ArrowLeft} markieren Zeichen für Zeichen, {Shift+ArrowDown} und {Shift+ArrowUp} ganze Zeilen.</p>
        <p>Zu viel markiert? Einfach mit der Gegenrichtung zurück.</p>`,
      tip: 'Das funktioniert auch im Explorer: {Shift+ArrowDown} erweitert die Dateiauswahl.',
      mac: { tip: 'Das funktioniert auch im Finder (Listenansicht): {Shift+ArrowDown} erweitert die Dateiauswahl.' },
      cheats: [
        { keys: 'Shift+ArrowRight', text: 'Zeichenweise markieren (auch ←)' },
        { keys: 'Shift+ArrowDown', text: 'Zeilenweise markieren (auch ↑)' },
      ],
      exercise: {
        type: 'text',
        text: 'Zum Frühstück gibt es Banane mit Quark.',
        rows: 2,
        steps: [
          {
            say: 'Klick direkt vor „Banane“. Halte {Shift} und drück {ArrowRight}, bis genau „Banane“ markiert ist.',
            combo: 'Shift+ArrowRight',
            test: (c) => c.selected.trim() === 'Banane' && c.keyboardSelection,
            ok: 'Banane markiert!',
          },
          {
            say: 'Jetzt rückwärts: Klick direkt hinter „Quark“ (vor den Punkt) und markiere es mit {Shift+ArrowLeft}.',
            combo: 'Shift+ArrowLeft',
            test: (c) => c.selected.trim() === 'Quark' && c.keyboardSelection,
            ok: 'Quark markiert!',
          },
        ],
      },
    },

    {
      id: 'wortweise',
      title: 'Wortweise springen',
      level: 2,
      keys: ['Ctrl+ArrowRight', 'Ctrl+Shift+ArrowRight'],
      summary: 'Mit Strg springt der Cursor Wort für Wort statt Buchstabe für Buchstabe.',
      mac: { summary: 'Mit der Option-Taste springt der Cursor Wort für Wort statt Buchstabe für Buchstabe.' },
      explain: `
        <p><strong>{Ctrl+ArrowRight}</strong> und <strong>{Ctrl+ArrowLeft}</strong> springen ein ganzes Wort weiter.</p>
        <p>Mit zusätzlichem {Shift} wird dabei markiert: <strong>{Ctrl+Shift+ArrowRight}</strong> wählt Wort für Wort aus.</p>`,
      tip: 'Kombinierbar mit allem: {Ctrl+Shift+ArrowLeft} und dann {Ctrl+X} schneidet die letzten Wörter aus.',
      cheats: [
        { keys: 'Ctrl+ArrowRight', text: 'Ein Wort weiter springen (auch ←)' },
        { keys: 'Ctrl+Shift+ArrowRight', text: 'Wortweise markieren (auch ←)' },
      ],
      exercise: {
        type: 'text',
        text: 'Mit Strg springst du blitzschnell von Wort zu Wort durch jeden Text.',
        mac: { text: 'Mit Option springst du blitzschnell von Wort zu Wort durch jeden Text.' },
        rows: 2,
        steps: [
          { say: 'Klick an den Anfang des Textes und spring mit {Ctrl+ArrowRight} dreimal ein Wort weiter.', combo: 'Ctrl+ArrowRight', times: 3, ok: 'Hopp, hopp, hopp!' },
          {
            say: 'Halte jetzt zusätzlich {Shift}: Markiere mit {Ctrl+Shift+ArrowRight} genau zwei Wörter.',
            combo: 'Ctrl+Shift+ArrowRight',
            test: (c, check) => c.keyboardSelection && check.words(c.selected).length === 2,
            ok: 'Zwei Wörter, zwei Griffe.',
          },
          { say: 'Und zurück geht es mit {Ctrl+ArrowLeft}. Drück es zweimal.', combo: 'Ctrl+ArrowLeft', times: 2 },
        ],
      },
    },

    {
      id: 'pos1-ende',
      title: 'Zeilenanfang & -ende',
      level: 2,
      keys: ['Home', 'End', 'Shift+Home', 'Ctrl+End'],
      summary: 'Pos1 und Ende bringen dich sofort an den Anfang oder das Ende einer Zeile.',
      mac: {
        summary: 'Cmd und die Pfeiltasten bringen dich sofort an den Anfang oder das Ende einer Zeile.',
        explain: `
          <p><strong>{Cmd+ArrowLeft}</strong> springt an den Zeilenanfang, <strong>{Cmd+ArrowRight}</strong> ans Zeilenende.</p>
          <p>Mit {Shift} markierst du dabei: {Cmd+Shift+ArrowLeft} wählt alles bis zum Zeilenanfang aus.</p>
          <p>{Cmd+ArrowUp} und {Cmd+ArrowDown} bringen dich an den Anfang oder das Ende des <em>ganzen</em> Textes.</p>`,
      },
      explain: `
        <p><strong>{Home}</strong> springt an den Zeilenanfang, <strong>{End}</strong> ans Zeilenende.</p>
        <p>Mit {Shift} markierst du dabei: {Shift+Home} wählt alles bis zum Zeilenanfang aus.</p>
        <p>Mit {Ctrl} geht es an den Anfang oder das Ende des <em>ganzen</em> Textes: {Ctrl+Home} und {Ctrl+End}.</p>`,
      tip: '{Ctrl+Shift+End} markiert alles vom Cursor bis zum Textende.',
      cheats: [
        { keys: 'Home', text: 'Zeilenanfang' },
        { keys: 'End', text: 'Zeilenende' },
        { keys: 'Shift+Home', text: 'Bis Zeilenanfang markieren (auch Ende)' },
        { keys: 'Ctrl+Home', text: 'Textanfang' },
        { keys: 'Ctrl+End', text: 'Textende' },
      ],
      exercise: {
        type: 'text',
        text: 'Erste Zeile: Hallo zusammen\nZweite Zeile: Diese hier wird markiert\nDritte Zeile: Ende gut, alles gut',
        rows: 4,
        wrap: 'off',
        steps: [
          {
            say: 'Klick irgendwo in die zweite Zeile und spring mit {End} ans Zeilenende.',
            combo: 'End',
            test: (c) => c.selStart === c.selEnd && c.text.slice(0, c.caret).split('\n').length === 2 && c.text[c.caret] === '\n',
            ok: 'Am Ende angekommen.',
          },
          {
            say: 'Markiere jetzt die ganze Zeile mit {Shift+Home}.',
            combo: 'Shift+Home',
            test: (c) => c.selected.trim() === 'Zweite Zeile: Diese hier wird markiert',
            ok: 'Ganze Zeile markiert!',
          },
          {
            say: 'Spring mit {Ctrl+End} ganz ans Ende des Textes.',
            combo: 'Ctrl+End',
            test: (c) => c.caret === c.text.length && c.selStart === c.selEnd,
          },
        ],
      },
    },

    {
      id: 'wort-loeschen',
      title: 'Ganze Wörter löschen',
      level: 2,
      keys: ['Ctrl+Backspace', 'Ctrl+Delete'],
      summary: 'Statt zehnmal die Rücktaste: Strg löscht ein ganzes Wort auf einmal.',
      mac: {
        summary: 'Statt zehnmal die Löschtaste: Mit Option löschst du ein ganzes Wort auf einmal.',
        explain: `
          <p><strong>{Alt+Backspace}</strong> löscht das Wort links vom Cursor.</p>
          <p><strong>{Alt+Delete}</strong> löscht das Wort rechts vom Cursor. Am MacBook ohne Entf-Taste drückst du dafür {Fn+Alt+Backspace}.</p>
          <p>Und {Cmd+Backspace} löscht sogar alles bis zum Zeilenanfang.</p>`,
      },
      explain: `
        <p><strong>{Ctrl+Backspace}</strong> löscht das Wort links vom Cursor.</p>
        <p><strong>{Ctrl+Delete}</strong> löscht das Wort rechts vom Cursor.</p>`,
      tip: 'Funktioniert auch in der Adressleiste, in Suchfeldern und in Chat-Programmen.',
      cheats: [
        { keys: 'Ctrl+Backspace', text: 'Wort links löschen' },
        { keys: 'Ctrl+Delete', text: 'Wort rechts löschen' },
      ],
      exercise: {
        type: 'text',
        text: 'Das ist ein total wirklich echt super Satz.',
        rows: 2,
        steps: [
          {
            say: 'Setz den Cursor direkt hinter „echt“ und lösch die drei Füllwörter mit {Ctrl+Backspace} – ein Druck pro Wort.',
            combo: 'Ctrl+Backspace',
            test: (c, check) => check.norm(c.text) === 'Das ist ein super Satz.',
            ok: 'Schon viel besser.',
          },
          {
            say: 'Setz den Cursor vor „super“ und lösch es mit {Ctrl+Delete}.',
            combo: 'Ctrl+Delete',
            test: (c, check) => check.norm(c.text) === 'Das ist ein Satz.',
          },
        ],
      },
    },
  ],
});
