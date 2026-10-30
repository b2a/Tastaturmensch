/*
 * Kapitel 1 – Die Basis.
 *
 * Aufbau einer Lektion:
 *   id       eindeutig, wird in der URL benutzt (#/lektion/<id>)
 *   title    Überschrift
 *   level    1 = Einsteiger, 2 = Fortgeschritten, 3 = Profi
 *   keys     die Kombis, um die es geht (werden groß angezeigt)
 *   summary  ein Satz zum Einstieg
 *   explain  Erklärung (HTML erlaubt, {Ctrl+C} wird zur Tastenkappe)
 *   tip      Profi-Tipp (optional)
 *   cheats   Einträge für den Spickzettel (optional, sonst keys + title)
 *   exercise Übung – type ist einer der Übungstypen aus js/exercises/
 */
TM.addChapter({
  id: 'basis',
  order: 1,
  title: 'Die Basis',
  description: 'Die Kombis, die jeder kennen sollte – sie funktionieren in fast jedem Programm.',
  lessons: [
    {
      id: 'kopieren-einfuegen',
      title: 'Kopieren & Einfügen',
      level: 1,
      keys: ['Ctrl+C', 'Ctrl+V'],
      summary: 'Einmal kopieren, beliebig oft einfügen – mit Text, Bildern und sogar Dateien.',
      explain: `
        <p><strong>{Ctrl+C}</strong> kopiert, was gerade markiert ist, in die Zwischenablage.</p>
        <p><strong>{Ctrl+V}</strong> fügt den Inhalt dort ein, wo der Cursor steht. So oft du willst.</p>
        <p>Merkhilfe: <em>C wie Copy</em> – und das V liegt direkt daneben.</p>`,
      tip: 'Mit {Ctrl+Shift+V} fügst du in vielen Programmen Text <em>ohne Formatierung</em> ein – praktisch, wenn du aus dem Internet kopierst.',
      cheats: [
        { keys: 'Ctrl+C', text: 'Kopieren' },
        { keys: 'Ctrl+V', text: 'Einfügen' },
        { keys: 'Ctrl+Shift+V', text: 'Ohne Formatierung einfügen (viele Programme)' },
      ],
      exercise: {
        type: 'text',
        source: 'Tastaturmensch',
        label: 'Dein Textfeld',
        text: 'Mein neues Lieblingswort: ',
        rows: 3,
        steps: [
          {
            say: 'Markiere das Wort im grauen Kasten (z. B. per Doppelklick) und drück {Ctrl+C}.',
            combo: 'Ctrl+C',
            test: (c) => c.copied.includes('Tastaturmensch'),
            ok: 'Kopiert! Das Wort liegt jetzt unsichtbar in der Zwischenablage.',
          },
          {
            say: 'Klick ins Textfeld hinter den Doppelpunkt und drück {Ctrl+V}.',
            combo: 'Ctrl+V',
            test: (c) => c.text.includes('Tastaturmensch'),
            ok: 'Eingefügt!',
          },
          {
            say: 'Die Zwischenablage bleibt voll: Füg das Wort mit {Ctrl+V} gleich noch einmal ein.',
            combo: 'Ctrl+V',
            test: (c, check) => check.count(c.text, 'Tastaturmensch') >= 2,
          },
        ],
      },
    },

    {
      id: 'ausschneiden',
      title: 'Ausschneiden & Verschieben',
      level: 1,
      keys: ['Ctrl+X', 'Ctrl+V'],
      summary: 'Ausschneiden ist Kopieren und Löschen in einem – perfekt zum Verschieben.',
      explain: `
        <p><strong>{Ctrl+X}</strong> schneidet das Markierte aus: Es verschwindet und liegt in der Zwischenablage.</p>
        <p>Mit <strong>{Ctrl+V}</strong> setzt du es an der neuen Stelle wieder ein.</p>
        <p>Im Explorer verschiebst du so Dateien in einen anderen Ordner.</p>`,
      tip: 'Eine ganze Zeile markierst du schnell so: Cursor ans Zeilenende, dann {Shift+Home}.',
      mac: {
        explain: `
          <p><strong>{Cmd+X}</strong> schneidet das Markierte aus: Es verschwindet und liegt in der Zwischenablage.</p>
          <p>Mit <strong>{Cmd+V}</strong> setzt du es an der neuen Stelle wieder ein.</p>
          <p>Im Finder geht Ausschneiden bei Dateien nicht. Dort kopierst du mit {Cmd+C} und verschiebst beim Einsetzen mit {Cmd+Alt+V}.</p>`,
      },
      cheats: [{ keys: 'Ctrl+X', text: 'Ausschneiden (zum Verschieben)' }],
      exercise: {
        type: 'text',
        label: 'Einkaufsliste – bring sie in die richtige Reihenfolge',
        text: 'Einkaufsliste:\n2. Eier\n3. Brot\n1. Milch',
        rows: 5,
        steps: [
          {
            say: 'Markiere die Zeile „1. Milch“ und schneide sie mit {Ctrl+X} aus.',
            combo: 'Ctrl+X',
            test: (c) => !c.text.includes('Milch'),
            ok: 'Ausgeschnitten – die Zeile wartet in der Zwischenablage.',
          },
          {
            say: 'Setz den Cursor ans Ende von „Einkaufsliste:“, drück Enter und füge mit {Ctrl+V} ein.',
            combo: 'Ctrl+V',
            test: (c, check) => check.sameList(check.lines(c.text), ['Einkaufsliste:', '1. Milch', '2. Eier', '3. Brot']),
            ok: 'Perfekt sortiert!',
          },
        ],
      },
    },

    {
      id: 'rueckgaengig',
      title: 'Rückgängig & Wiederholen',
      level: 1,
      keys: ['Ctrl+Z', 'Ctrl+Y'],
      summary: 'Die Zeitmaschine für fast jedes Programm: Fehler einfach zurücknehmen.',
      explain: `
        <p><strong>{Ctrl+Z}</strong> macht den letzten Schritt rückgängig – auch mehrmals hintereinander.</p>
        <p><strong>{Ctrl+Y}</strong> stellt einen rückgängig gemachten Schritt wieder her.</p>
        <p>Das klappt sogar im Explorer: Datei aus Versehen gelöscht oder verschoben? {Ctrl+Z}!</p>`,
      tip: 'In manchen Programmen heißt Wiederholen {Ctrl+Shift+Z} statt {Ctrl+Y}.',
      mac: {
        explain: `
          <p><strong>{Cmd+Z}</strong> macht den letzten Schritt rückgängig – auch mehrmals hintereinander.</p>
          <p><strong>{Cmd+Shift+Z}</strong> stellt einen rückgängig gemachten Schritt wieder her.</p>
          <p>Das klappt sogar im Finder: Datei aus Versehen in den Papierkorb gelegt? {Cmd+Z}!</p>`,
        tip: 'In Word und einigen anderen Programmen geht Wiederholen auch mit {Cmd+Y}.',
      },
      cheats: [
        { keys: 'Ctrl+Z', text: 'Rückgängig' },
        { keys: 'Ctrl+Y', text: 'Wiederherstellen' },
      ],
      exercise: {
        type: 'text',
        text: 'Dieser Satz ist wirklich wichtig.',
        rows: 2,
        steps: [
          {
            say: 'Lösch das Wort „wichtig“ – zum Beispiel mit der Rücktaste.',
            test: (c) => !c.text.includes('wichtig'),
            ok: 'Weg ist es …',
          },
          {
            say: 'Oh nein! Hol es mit {Ctrl+Z} zurück (ruhig mehrmals drücken).',
            combo: 'Ctrl+Z',
            test: (c) => c.text.includes('wichtig'),
            ok: 'Gerettet!',
          },
          {
            say: 'Doch lieber weg? Mit {Ctrl+Y|Ctrl+Shift+Z} wiederholst du das Löschen.',
            combo: ['Ctrl+Y', 'Ctrl+Shift+Z'],
            mac: { say: 'Doch lieber weg? Mit {Cmd+Shift+Z} wiederholst du das Löschen.', combo: ['Cmd+Shift+Z', 'Cmd+Y'] },
            test: (c) => !c.text.includes('wichtig'),
          },
        ],
      },
    },

    {
      id: 'alles-markieren',
      title: 'Alles markieren',
      level: 1,
      keys: ['Ctrl+A'],
      summary: 'Ein Griff – und der ganze Text, alle Dateien oder alle Mails sind markiert.',
      explain: `
        <p><strong>{Ctrl+A}</strong> markiert alles im aktuellen Bereich: den ganzen Text, alle Dateien im Ordner, alle Zellen.</p>
        <p>Danach kannst du direkt kopieren, löschen oder überschreiben.</p>
        <p>Merkhilfe: <em>A wie Alles</em>.</p>`,
      tip: 'Markierter Text wird beim Tippen sofort ersetzt. {Ctrl+A} und lostippen ist der schnellste Weg, ein Feld neu zu füllen.',
      cheats: [{ keys: 'Ctrl+A', text: 'Alles markieren' }],
      exercise: {
        type: 'text',
        text: 'Dieser Text ist viel zu lang und völlig überflüssig. Niemand will ihn lesen. Er steht nur hier, damit du ihn mit einem einzigen Griff loswerden kannst.',
        rows: 4,
        steps: [
          {
            say: 'Klick ins Textfeld und markiere mit {Ctrl+A} den ganzen Text.',
            combo: 'Ctrl+A',
            test: (c) => c.text.length > 0 && c.selStart === 0 && c.selEnd === c.text.length,
            ok: 'Alles markiert.',
          },
          {
            say: 'Jetzt einfach lostippen: Schreib „Hallo“ – der markierte Text wird ersetzt.',
            test: (c, check) => check.norm(c.text).toLowerCase() === 'hallo',
            ok: 'Ersetzt in einem Rutsch!',
          },
        ],
      },
    },

    {
      id: 'speichern-suchen',
      title: 'Speichern, Suchen, Drucken',
      level: 1,
      keys: ['Ctrl+S', 'Ctrl+F', 'Ctrl+P'],
      summary: 'Drei Kombis, die in Word, Excel, Browser und fast überall gleich sind.',
      explain: `
        <p><strong>{Ctrl+S}</strong> speichert – gewöhn es dir einfach zwischendurch an.</p>
        <p><strong>{Ctrl+F}</strong> öffnet die Suche: Wort eintippen, mit Enter von Treffer zu Treffer springen.</p>
        <p><strong>{Ctrl+P}</strong> öffnet den Druckdialog (auch zum Speichern als PDF).</p>`,
      tip: '{F12} öffnet in Word und Excel direkt „Speichern unter“.',
      mac: {
        tip: '{Cmd+Shift+S} öffnet in vielen Programmen „Speichern unter“ bzw. „Duplizieren“.',
        cheats: [
          { keys: 'Cmd+S', text: 'Sichern' },
          { keys: 'Cmd+F', text: 'Suchen' },
          { keys: 'Cmd+P', text: 'Drucken' },
          { keys: 'Cmd+Shift+S', text: 'Speichern unter / Duplizieren' },
        ],
      },
      cheats: [
        { keys: 'Ctrl+S', text: 'Speichern' },
        { keys: 'Ctrl+F', text: 'Suchen' },
        { keys: 'Ctrl+P', text: 'Drucken' },
        { keys: 'F12', text: 'Speichern unter (Office)' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '📄', title: 'Bericht.docx •', text: 'Ungespeicherte Änderungen' },
        steps: [
          { say: 'Speichere das Dokument mit {Ctrl+S}.', combo: 'Ctrl+S', effect: { icon: '💾', title: 'Gespeichert', text: 'Bericht.docx – alle Änderungen gesichert.' } },
          { say: 'Such nach einem Wort mit {Ctrl+F}.', combo: 'Ctrl+F', effect: { icon: '🔍', title: 'Suche geöffnet', text: 'Wort eintippen, Enter springt zum nächsten Treffer.' } },
          { say: 'Und jetzt drucken mit {Ctrl+P}.', combo: 'Ctrl+P', effect: { icon: '🖨️', title: 'Drucken', text: 'Der Druckdialog ist offen – hier geht auch „Als PDF speichern“.' } },
        ],
      },
    },
  ],
});
