/* Kapitel 3 – Datei-Explorer. Aufbau einer Lektion: siehe 01-grundlagen.js */
(function () {
  const FILES = [
    'Bericht_01.docx', 'Bericht_02.docx', 'Bericht_03.docx', 'Bericht_04.docx', 'Bericht_05.docx',
    'Budget.xlsx', 'Entwurf.docx', 'Geburtstag.jpg', 'Hausaufgaben.pdf', 'Katze.jpg', 'Notizen.txt', 'Rezept.pdf', 'Strand.jpg',
  ];
  const JPGS = ['Geburtstag.jpg', 'Katze.jpg', 'Strand.jpg'];
  const BERICHTE = ['Bericht_01.docx', 'Bericht_02.docx', 'Bericht_03.docx', 'Bericht_04.docx', 'Bericht_05.docx'];

  TM.addChapter({
    id: 'explorer',
    order: 3,
    title: 'Datei-Explorer',
    description: 'Dateien gezielt auswählen, umbenennen und flott durch Ordner navigieren.',
    lessons: [
      {
        id: 'explorer-auswahl',
        title: 'Dateien auswählen mit Strg & Shift',
        level: 1,
        keys: ['Ctrl+Klick', 'Shift+Klick'],
        summary: 'Einzelne Dateien herauspicken oder einen ganzen Block auf einmal auswählen.',
        explain: `
          <p><strong>{Ctrl}+Klick</strong> wählt einzelne Dateien zusätzlich aus – oder wieder ab. Ideal für verstreute Dateien.</p>
          <p><strong>{Shift}+Klick</strong> wählt alles <em>zwischen</em> der zuerst angeklickten und der jetzt angeklickten Datei.</p>
          <p>Beides lässt sich kombinieren. Das klappt übrigens genauso in Outlook, in Listen und bei Fotos.</p>`,
        tip: 'Ausgewählte Dateien kannst du direkt mit {Ctrl+C} kopieren oder mit {Ctrl+X} verschieben.',
        cheats: [
          { keys: 'Ctrl+Klick', text: 'Einzelne Dateien dazu-/abwählen' },
          { keys: 'Shift+Klick', text: 'Bereich auswählen' },
        ],
        exercise: {
          type: 'explorer',
          folder: 'Dokumente',
          files: FILES,
          steps: [
            { say: 'Wähle nur die drei Fotos (.jpg) aus: Halte {Ctrl} und klick sie nacheinander an.', target: 'Ctrl', expect: JPGS, via: 'ctrlClick', ok: 'Drei Fotos, sauber herausgepickt.' },
            { say: 'Jetzt ein ganzer Block: Klick „Bericht_01“ an, halte {Shift} und klick „Bericht_05“.', target: 'Shift', expect: BERICHTE, via: 'shiftClick', ok: 'Fünf Dateien mit zwei Klicks!' },
            { say: 'Kombiniere: Halte {Ctrl} und klick zusätzlich „Budget.xlsx“ dazu.', target: 'Ctrl', expect: [...BERICHTE, 'Budget.xlsx'], via: 'ctrlClick' },
          ],
        },
      },

      {
        id: 'explorer-tastatur',
        title: 'Auswählen mit der Tastatur',
        level: 2,
        keys: ['Ctrl+A', 'Shift+ArrowDown'],
        summary: 'Alles auswählen oder die Auswahl mit den Pfeiltasten erweitern – ganz ohne Maus.',
        explain: `
          <p><strong>{Ctrl+A}</strong> wählt alle Dateien im Ordner aus.</p>
          <p>Mit den <strong>Pfeiltasten</strong> wanderst du durch die Liste, mit <strong>{Shift}</strong> dazu erweiterst du die Auswahl.</p>
          <p>{Escape} hebt die Auswahl wieder auf.</p>`,
        tip: 'Einfach den Anfang eines Dateinamens tippen – der Explorer springt direkt dorthin.',
        cheats: [
          { keys: 'Ctrl+A', text: 'Alle Dateien auswählen' },
          { keys: 'Shift+ArrowDown', text: 'Auswahl erweitern (auch ↑)' },
        ],
        exercise: {
          type: 'explorer',
          folder: 'Dokumente',
          files: FILES,
          steps: [
            { say: 'Klick in die Dateiliste und wähle mit {Ctrl+A} alles aus.', target: 'Ctrl+A', expect: FILES, via: 'ctrlA', ok: 'Alles ausgewählt.' },
            {
              say: 'Klick eine einzelne Datei an und erweitere die Auswahl mit {Shift+ArrowDown} um zwei Dateien nach unten.',
              target: 'Shift+ArrowDown',
              expect: (names, info) => names.length === 3 && info.indices[2] - info.indices[0] === 2,
              via: 'shiftArrow',
              ok: 'Drei Dateien am Stück – ohne Maus.',
            },
          ],
        },
      },

      {
        id: 'umbenennen',
        title: 'Umbenennen mit F2',
        level: 2,
        keys: ['F2'],
        summary: 'Kein Rechtsklick nötig: F2 und lostippen.',
        explain: `
          <p>Datei auswählen, <strong>{F2}</strong> drücken – schon kannst du den Namen ändern. Windows markiert dabei nur den Namen, nicht die Endung.</p>
          <p>Mit {Enter} bestätigen, mit {Escape} abbrechen.</p>
          <p>Profi-Trick: Mehrere Dateien auswählen und {F2} drücken benennt alle auf einmal – mit Nummern.</p>`,
        tip: '{F2} funktioniert auch in Excel: Es öffnet die Zelle zum Bearbeiten.',
        cheats: [{ keys: 'F2', text: 'Umbenennen (Excel: Zelle bearbeiten)' }],
        exercise: {
          type: 'explorer',
          folder: 'Dokumente',
          files: FILES,
          steps: [
            {
              say: 'Wähle „Entwurf.docx“ aus und drück {F2}. Tipp „Final“ und bestätige mit {Enter}.',
              target: 'F2',
              renamed: (files) => files.some((f) => f.toLowerCase() === 'final.docx'),
              via: 'f2',
              ok: 'Umbenannt – die Endung .docx ist geblieben.',
            },
            {
              say: 'Profi-Trick: Wähle alle drei Fotos aus ({Ctrl}+Klick), drück {F2}, tipp „Urlaub“ und {Enter}.',
              target: 'F2',
              renamed: (files) => files.filter((f) => /^Urlaub \(\d\)\.jpg$/i.test(f)).length === 3,
              via: 'f2',
              ok: 'Drei Dateien auf einmal umbenannt!',
            },
          ],
        },
      },

      {
        id: 'explorer-navigation',
        title: 'Explorer-Turbo',
        level: 2,
        keys: ['Win+E', 'Ctrl+Shift+N', 'Alt+ArrowUp'],
        summary: 'Explorer öffnen, neuen Ordner anlegen und eine Ebene höher – alles per Tastatur.',
        explain: `
          <p><strong>{Win+E}</strong> öffnet den Explorer – von überall aus.</p>
          <p><strong>{Ctrl+Shift+N}</strong> legt im Explorer einen neuen Ordner an.</p>
          <p><strong>{Alt+ArrowUp}</strong> springt eine Ordnerebene nach oben, {Alt+ArrowLeft} geht zurück.</p>`,
        tip: '{Alt+Enter} zeigt die Eigenschaften der ausgewählten Datei, z. B. ihre Größe.',
        cheats: [
          { keys: 'Win+E', text: 'Explorer öffnen' },
          { keys: 'Ctrl+Shift+N', text: 'Neuer Ordner (im Explorer)' },
          { keys: 'Alt+ArrowUp', text: 'Eine Ordnerebene höher' },
          { keys: 'Alt+Enter', text: 'Eigenschaften anzeigen' },
        ],
        exercise: {
          type: 'combo',
          scene: { icon: '🖥️', title: 'Desktop', text: 'Noch ist kein Fenster offen.' },
          steps: [
            { say: 'Öffne den Explorer mit {Win+E}.', combo: 'Win+E', effect: { icon: '📁', title: 'Explorer geöffnet', text: 'Schnellzugriff – deine zuletzt genutzten Ordner.' } },
            { say: 'Leg einen neuen Ordner an: {Ctrl+Shift+N}.', combo: 'Ctrl+Shift+N', effect: { icon: '🗂️', title: 'Neuer Ordner', text: 'Name eintippen, mit Enter bestätigen.' } },
            { say: 'Spring eine Ebene höher: {Alt+ArrowUp}.', combo: 'Alt+ArrowUp', effect: { icon: '⬆️', title: 'Eine Ebene höher', text: 'Von „Dokumente › Projekte“ zurück zu „Dokumente“.' } },
          ],
        },
      },
    ],
  });
})();
