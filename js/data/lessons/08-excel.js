/*
 * Kapitel 8 – Excel. Aufbau einer Lektion: siehe 01-grundlagen.js
 * Excel weicht am Mac stärker ab (Cmd+Pfeil statt Strg+Pfeil, Ctrl+U zum Bearbeiten …),
 * darum stehen die Mac-Texte hier ausdrücklich unter `mac`.
 */
(function () {
  const DATA = [
    ['Monat', 'Umsatz', 'Kosten', 'Gewinn'],
    ['Januar', 4200, 3100, '=B2-C2'],
    ['Februar', 3900, 2800, ''],
    ['März', 4800, 3300, ''],
    ['April', 5100, 3500, ''],
    ['Mai', 5600, 3600, ''],
    ['Juni', 6100, 3900, ''],
  ];

  TM.addChapter({
    id: 'excel',
    order: 8,
    title: 'Excel',
    description: 'Blitzschnell durch Tabellen springen, markieren, ausfüllen und summieren.',
    lessons: [
      {
        id: 'excel-springen',
        title: 'Durch Tabellen springen',
        level: 2,
        keys: ['Ctrl+ArrowDown', 'Ctrl+Home', 'Ctrl+End'],
        summary: 'Egal wie lang die Tabelle ist: Ein Griff bringt dich an den Rand deiner Daten.',
        explain: `
          <p><strong>{Ctrl}</strong> + Pfeiltaste springt bis zur letzten gefüllten Zelle in diese Richtung – bei 10 000 Zeilen genauso schnell wie bei 10.</p>
          <p><strong>{Ctrl+Home}</strong> bringt dich zurück nach A1, <strong>{Ctrl+End}</strong> zur letzten benutzten Zelle.</p>`,
        tip: 'Mit {Ctrl+PageDown} und {Ctrl+PageUp} wechselst du zwischen den Tabellenblättern.',
        cheats: [
          { keys: 'Ctrl+ArrowDown', text: 'An den Rand der Daten springen (alle Richtungen)' },
          { keys: 'Ctrl+Home', text: 'Zu Zelle A1' },
          { keys: 'Ctrl+End', text: 'Zur letzten benutzten Zelle' },
          { keys: 'Ctrl+PageDown', text: 'Nächstes Tabellenblatt' },
        ],
        mac: {
          keys: ['Cmd+ArrowDown', 'Ctrl+Home', 'Ctrl+End'],
          summary: 'Egal wie lang die Tabelle ist: Cmd + Pfeiltaste bringt dich an den Rand deiner Daten.',
          explain: `
            <p><strong>{Cmd}</strong> + Pfeiltaste springt bis zur letzten gefüllten Zelle in diese Richtung.</p>
            <p><strong>{Ctrl+Home}</strong> bringt dich nach A1, <strong>{Ctrl+End}</strong> zur letzten benutzten Zelle. Am MacBook ohne Home-Taste: {Fn+Ctrl+ArrowLeft} und {Fn+Ctrl+ArrowRight}.</p>`,
          tip: 'Mit {Fn+ArrowDown} und {Fn+ArrowUp} blätterst du seitenweise.',
          cheats: [
            { keys: 'Cmd+ArrowDown', text: 'An den Rand der Daten springen (alle Richtungen)' },
            { keys: 'Ctrl+Home', text: 'Zu Zelle A1 (MacBook: fn+ctrl+←)' },
            { keys: 'Ctrl+End', text: 'Zur letzten benutzten Zelle (MacBook: fn+ctrl+→)' },
          ],
        },
        exercise: {
          type: 'excel',
          title: 'Umsatz.xlsx',
          data: DATA,
          start: 'A1',
          steps: [
            { say: 'Spring mit {Ctrl+ArrowDown} ans Ende der Monats-Spalte.', target: 'Ctrl+ArrowDown', via: 'jump', test: (c) => c.active === 'A7', ok: 'Unten angekommen: Juni.', mac: { say: 'Spring mit {Cmd+ArrowDown} ans Ende der Monats-Spalte.', target: 'Cmd+ArrowDown' } },
            { say: 'Jetzt mit {Ctrl+ArrowRight} ans Ende der Zeile.', target: 'Ctrl+ArrowRight', via: 'jump', test: (c) => c.active === 'C7', mac: { say: 'Jetzt mit {Cmd+ArrowRight} ans Ende der Zeile.', target: 'Cmd+ArrowRight' } },
            { say: 'Zurück zum Anfang: {Ctrl+Home}.', target: 'Ctrl+Home', via: 'home', test: (c) => c.active === 'A1', ok: 'Zurück in A1.', mac: { say: 'Zurück zum Anfang: {Ctrl+Home} (MacBook: {Fn+Ctrl+ArrowLeft}).', target: 'Ctrl+Home' } },
            { say: 'Und zur letzten benutzten Zelle: {Ctrl+End}.', target: 'Ctrl+End', via: 'end', test: (c) => c.active === 'D7', mac: { say: 'Und zur letzten benutzten Zelle: {Ctrl+End} (MacBook: {Fn+Ctrl+ArrowRight}).', target: 'Ctrl+End' } },
          ],
        },
      },

      {
        id: 'excel-markieren',
        title: 'Spalten, Zeilen & Bereiche markieren',
        level: 2,
        keys: ['Ctrl+Shift+ArrowDown', 'Ctrl+Space', 'Shift+Space'],
        summary: 'Ganze Datenblöcke, Spalten oder Zeilen markieren – ohne zu ziehen.',
        explain: `
          <p><strong>{Ctrl+Shift+ArrowDown}</strong> markiert von der aktuellen Zelle bis zum Ende der Daten – ideal für lange Listen.</p>
          <p><strong>{Ctrl+Space}</strong> markiert die ganze Spalte, <strong>{Shift+Space}</strong> die ganze Zeile.</p>`,
        tip: 'Danach direkt weiter: {Ctrl+C} kopiert den Bereich, {Ctrl+Minus} löscht markierte Zeilen oder Spalten.',
        cheats: [
          { keys: 'Ctrl+Shift+ArrowDown', text: 'Bis zum Datenende markieren (alle Richtungen)' },
          { keys: 'Ctrl+Space', text: 'Ganze Spalte markieren' },
          { keys: 'Shift+Space', text: 'Ganze Zeile markieren' },
        ],
        mac: {
          keys: ['Cmd+Shift+ArrowDown', 'Ctrl+Space', 'Shift+Space'],
          explain: `
            <p><strong>{Cmd+Shift+ArrowDown}</strong> markiert von der aktuellen Zelle bis zum Ende der Daten.</p>
            <p><strong>{Ctrl+Space}</strong> markiert die ganze Spalte, <strong>{Shift+Space}</strong> die ganze Zeile.</p>
            <p>Hinweis: Hast du mehrere Tastatursprachen, wechselt {Ctrl+Space} am Mac womöglich die Eingabequelle. Dann hier {Ctrl} auf der Bildschirmtastatur anklicken.</p>`,
          tip: 'Danach direkt weiter: {Cmd+C} kopiert den Bereich, {Cmd+Minus} löscht markierte Zeilen oder Spalten.',
          cheats: [
            { keys: 'Cmd+Shift+ArrowDown', text: 'Bis zum Datenende markieren (alle Richtungen)' },
            { keys: 'Ctrl+Space', text: 'Ganze Spalte markieren' },
            { keys: 'Shift+Space', text: 'Ganze Zeile markieren' },
          ],
        },
        exercise: {
          type: 'excel',
          title: 'Umsatz.xlsx',
          data: DATA,
          start: 'B2',
          steps: [
            { say: 'Markiere alle Umsätze bis nach unten: {Ctrl+Shift+ArrowDown}.', target: 'Ctrl+Shift+ArrowDown', via: 'extendJump', test: (c) => c.sel === 'B2:B7', ok: 'Sechs Zellen mit einem Griff.', mac: { say: 'Markiere alle Umsätze bis nach unten: {Cmd+Shift+ArrowDown}.', target: 'Cmd+Shift+ArrowDown' } },
            { say: 'Jetzt die ganze Spalte B: {Ctrl+Space}.', target: 'Ctrl+Space', via: 'col', test: (c) => c.full === 'col' && c.active.startsWith('B'), ok: 'Ganze Spalte markiert.', mac: { target: 'Ctrl+Space' } },
            { say: 'Und die ganze Zeile: {Shift+Space}.', target: 'Shift+Space', via: 'row', test: (c) => c.full === 'row' },
          ],
        },
      },

      {
        id: 'excel-eingeben',
        title: 'Bearbeiten, ausfüllen, summieren',
        level: 2,
        keys: ['F2', 'Ctrl+D', 'Alt+Shift+0'],
        summary: 'Zelle korrigieren, Formel nach unten kopieren, Summe auf Knopfdruck.',
        explain: `
          <p><strong>{F2}</strong> öffnet die Zelle zum Bearbeiten – der Cursor steht am Ende. {Enter} bestätigt, {Escape} bricht ab.</p>
          <p><strong>{Ctrl+D}</strong> füllt die markierten Zellen mit dem Inhalt der obersten. Formeln passen sich dabei an. In manchen deutschen Excel-Versionen heißt die Kombi {Ctrl+U}.</p>
          <p><strong>{Alt+Shift+0}</strong> – also {Alt} und das Gleichheitszeichen – fügt eine AutoSumme der Zahlen darüber ein.</p>`,
        tip: '{Ctrl+R} füllt nach rechts, {Ctrl+Period} fügt das heutige Datum ein.',
        cheats: [
          { keys: 'F2', text: 'Zelle bearbeiten' },
          { keys: 'Ctrl+D', text: 'Nach unten ausfüllen (teils Strg+U)' },
          { keys: 'Ctrl+R', text: 'Nach rechts ausfüllen' },
          { keys: 'Alt+Shift+0', text: 'AutoSumme (Alt + =)' },
        ],
        mac: {
          keys: ['Ctrl+U', 'Cmd+D', 'Cmd+Shift+T'],
          explain: `
            <p><strong>{Ctrl+U}</strong> öffnet die Zelle zum Bearbeiten (oder {F2}, am MacBook mit {Fn}). {Enter} bestätigt, {Escape} bricht ab.</p>
            <p><strong>{Cmd+D}</strong> füllt die markierten Zellen mit dem Inhalt der obersten. Formeln passen sich dabei an.</p>
            <p><strong>{Cmd+Shift+T}</strong> fügt eine AutoSumme der Zahlen darüber ein.</p>`,
          tip: '{Cmd+R} füllt nach rechts – genauso wie {Cmd+D} nach unten.',
          cheats: [
            { keys: 'Ctrl+U', text: 'Zelle bearbeiten' },
            { keys: 'Cmd+D', text: 'Nach unten ausfüllen' },
            { keys: 'Cmd+R', text: 'Nach rechts ausfüllen' },
            { keys: 'Cmd+Shift+T', text: 'AutoSumme' },
          ],
        },
        exercise: {
          type: 'excel',
          title: 'Umsatz.xlsx',
          data: DATA,
          start: 'B4',
          steps: [
            {
              say: 'Der März-Umsatz ist falsch: Drück auf B4 {F2}, ändere die Zahl auf 5000 und bestätige mit {Enter}.',
              target: 'F2',
              via: 'edit',
              test: (c) => Number(c.raw('B4')) === 5000 && !c.editing,
              ok: 'Korrigiert.',
              mac: { say: 'Der März-Umsatz ist falsch: Geh auf B4, drück {Ctrl+U}, ändere die Zahl auf 5000 und bestätige mit {Enter}.', target: 'Ctrl+U' },
            },
            {
              say: 'Klick auf D2 (dort steht eine Formel), erweitere mit {Shift+ArrowDown} bis D7 und füll mit {Ctrl+D} nach unten.',
              target: 'Ctrl+D',
              via: 'fill',
              test: (c) => [3, 4, 5, 6, 7].every((r) => c.raw('D' + r).startsWith('=')),
              ok: 'Alle Gewinne berechnet – die Formel hat sich jeweils angepasst.',
              mac: { say: 'Klick auf D2 (dort steht eine Formel), erweitere mit {Shift+ArrowDown} bis D7 und füll mit {Cmd+D} nach unten.', target: 'Cmd+D' },
            },
            {
              say: 'Klick auf B8 unter die Umsätze, drück {Alt+Shift+0} für die AutoSumme und bestätige mit {Enter}.',
              target: 'Alt+Shift+0',
              via: 'autosum',
              test: (c) => !c.editing && /^=SUMME\(B2:B7\)$/i.test(c.raw('B8')),
              ok: 'Summe fertig!',
              mac: { say: 'Klick auf B8 unter die Umsätze, drück {Cmd+Shift+T} für die AutoSumme und bestätige mit {Enter}.', target: 'Cmd+Shift+T' },
            },
          ],
        },
      },
    ],
  });
})();
