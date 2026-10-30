/* Kapitel 5 – Taskleiste & Windows-Tricks. Aufbau einer Lektion: siehe 01-grundlagen.js */
TM.addChapter({
  id: 'system',
  order: 5,
  title: 'Taskleiste & Windows-Tricks',
  description: 'Programme per Zahl starten, PC sperren, Screenshots und kleine Helfer.',
  mac: { title: 'Spotlight & macOS-Tricks', description: 'Programme finden, Mac sperren, Screenshots und kleine Helfer.' },
  lessons: [
    {
      id: 'sperren',
      title: 'PC sperren',
      level: 1,
      keys: ['Win+L'],
      summary: 'Kurz weg vom Platz? Ein Griff, und niemand sieht deinen Bildschirm.',
      explain: `
        <p><strong>{Win+L}</strong> sperrt den PC sofort. Alle Programme laufen weiter, aber zum Entsperren braucht es dein Passwort oder deine PIN.</p>
        <p>Merkhilfe: <em>L wie Lock</em> (engl. abschließen).</p>`,
      tip: 'Mach es dir zur Gewohnheit, sobald du aufstehst – im Büro ist das oft sogar Pflicht.',
      mac: {
        title: 'Mac sperren',
        keys: ['Ctrl+Cmd+Q'],
        explain: `
          <p><strong>{Ctrl+Cmd+Q}</strong> sperrt den Mac sofort. Alle Programme laufen weiter, aber zum Entsperren braucht es dein Passwort oder Touch ID.</p>
          <p>Merkhilfe: wie Beenden ({Cmd+Q}) – nur mit {Ctrl} dazu.</p>`,
        cheats: [{ keys: 'Ctrl+Cmd+Q', text: 'Mac sperren' }],
      },
      cheats: [{ keys: 'Win+L', text: 'PC sperren' }],
      exercise: {
        type: 'combo',
        scene: { icon: '🖥️', title: 'Du arbeitest gerade', text: 'Vertrauliche Tabelle offen …' },
        steps: [
          {
            say: 'Kaffeepause! Sperr den PC mit {Win+L}.',
            combo: 'Win+L',
            effect: { icon: '🔒', title: 'Gesperrt', text: 'Zum Entsperren PIN oder Passwort eingeben.' },
            mac: { say: 'Kaffeepause! Sperr den Mac mit {Ctrl+Cmd+Q}.', combo: 'Ctrl+Cmd+Q', effect: { icon: '🔒', title: 'Gesperrt', text: 'Zum Entsperren Passwort oder Touch ID.' } },
          },
        ],
      },
    },

    {
      id: 'taskleiste',
      title: 'Programme mit Win + Zahl',
      level: 2,
      keys: ['Win+1…9'],
      summary: 'Die Programme in deiner Taskleiste haben Nummern – du musst sie nur kennen.',
      explain: `
        <p><strong>{Win}</strong> + eine Zahl von <strong>1 bis 9</strong> öffnet das Programm an dieser Stelle der Taskleiste. Gezählt wird von links, die Start-Schaltfläche zählt nicht mit.</p>
        <p>Läuft das Programm schon, wird es nach vorn geholt. Nochmal drücken minimiert es.</p>
        <p>Tipp: Leg deine wichtigsten Programme ganz nach links – dann sind sie {Win+1}, {Win+2}, {Win+3}.</p>`,
      tip: '{Win+Shift+1} öffnet ein <em>zusätzliches</em> Fenster des ersten Programms.',
      mac: {
        title: 'Programme starten mit Spotlight',
        keys: ['Cmd+Space'],
        summary: 'Programm, Datei oder schnelle Rechnung – Spotlight findet alles in Sekunden.',
        explain: `
          <p><strong>{Cmd+Space}</strong> öffnet Spotlight. Die ersten Buchstaben eintippen – „Rech“ für den Rechner – und mit {Enter} öffnen.</p>
          <p>Spotlight findet auch Dateien, Mails und Einstellungen und rechnet sogar: Tipp einfach „17*23“.</p>`,
        tip: 'Laufende Programme erreichst du noch schneller mit {Cmd+Tab}.',
        cheats: [{ keys: 'Cmd+Space', text: 'Spotlight: Programme & Dateien finden' }],
        exercise: {
          type: 'combo',
          scene: { icon: '🖥️', title: 'Schreibtisch', text: 'Du willst schnell den Rechner öffnen.' },
          steps: [
            { say: 'Öffne Spotlight: {Cmd+Space}.', combo: 'Cmd+Space', effect: { icon: '🔍', title: 'Spotlight', text: 'Tipp „Rech“ – der Rechner erscheint. Return öffnet ihn.' } },
          ],
        },
      },
      cheats: [
        { keys: 'Win+1…9', text: 'Programm Nr. 1–9 der Taskleiste öffnen' },
        { keys: 'Win+Shift+1…9', text: 'Neues Fenster dieses Programms' },
      ],
      exercise: {
        type: 'taskbar',
        apps: [
          { name: 'Explorer', short: 'E', color: '#e8a317' },
          { name: 'Browser', short: 'B', color: '#0f7b6c' },
          { name: 'Outlook', short: 'O', color: '#0f6cbd' },
          { name: 'Word', short: 'W', color: '#2b579a' },
          { name: 'Excel', short: 'X', color: '#217346' },
          { name: 'Teams', short: 'T', color: '#5b5fc7' },
          { name: 'Rechner', short: '=', color: '#495057' },
          { name: 'Musik', short: '♪', color: '#c2255c' },
        ],
        rounds: 3,
        showNumbers: 1,
      },
    },

    {
      id: 'kleine-helfer',
      title: 'Zwischenablage, Emojis, Screenshot',
      level: 2,
      keys: ['Win+V', 'Win+Period', 'Win+Shift+S'],
      summary: 'Drei eingebaute Helfer, die kaum jemand kennt.',
      explain: `
        <p><strong>{Win+V}</strong> zeigt den Verlauf der Zwischenablage – also auch Dinge, die du <em>vorher</em> kopiert hast. (Beim ersten Mal einmal einschalten.)</p>
        <p><strong>{Win+Period}</strong> öffnet die Emoji-Auswahl – in jedem Textfeld. 🎉</p>
        <p><strong>{Win+Shift+S}</strong> macht einen Screenshot von einem Bereich, den du mit der Maus aufziehst. Er landet in der Zwischenablage.</p>`,
      tip: 'Den Screenshot einfach mit {Ctrl+V} in eine Mail oder einen Chat einfügen.',
      mac: {
        title: 'Emojis & Screenshots',
        keys: ['Ctrl+Cmd+Space', 'Cmd+Shift+4', 'Cmd+Shift+3'],
        summary: 'Eingebaute Helfer, die kaum jemand kennt.',
        explain: `
          <p><strong>{Ctrl+Cmd+Space}</strong> öffnet die Emoji-Auswahl – in jedem Textfeld. 🎉 (Oder einfach die Globus-Taste {Fn} drücken.)</p>
          <p><strong>{Cmd+Shift+4}</strong> macht einen Screenshot von einem Bereich, den du mit der Maus aufziehst. <strong>{Cmd+Shift+3}</strong> fotografiert den ganzen Bildschirm.</p>
          <p>{Cmd+Shift+5} öffnet das Screenshot-Werkzeug – damit kannst du sogar Videos aufnehmen.</p>`,
        tip: 'Mit {Ctrl} dazu ({Ctrl+Cmd+Shift+4}) landet der Screenshot in der Zwischenablage statt auf dem Schreibtisch – dann einfach mit {Cmd+V} einfügen.',
        cheats: [
          { keys: 'Ctrl+Cmd+Space', text: 'Emojis einfügen' },
          { keys: 'Cmd+Shift+4', text: 'Screenshot von einem Bereich' },
          { keys: 'Cmd+Shift+3', text: 'Screenshot vom ganzen Bildschirm' },
          { keys: 'Cmd+Shift+5', text: 'Screenshot-Werkzeug (auch Video)' },
        ],
        exercise: {
          type: 'combo',
          scene: { icon: '📝', title: 'Du schreibst eine Nachricht', text: '„Schau mal, hier ist der Fehler …“' },
          steps: [
            { say: 'Füg ein Emoji ein: {Ctrl+Cmd+Space}.', combo: 'Ctrl+Cmd+Space', effect: { icon: '😀', title: 'Emoji-Auswahl', text: 'Tippen zum Suchen, z. B. „daumen“ 👍' } },
            { say: 'Mach einen Screenshot von einem Bereich: {Cmd+Shift+4}.', combo: 'Cmd+Shift+4', effect: { icon: '✂️', title: 'Bereich auswählen', text: 'Rahmen aufziehen – das Bild liegt auf dem Schreibtisch.' } },
            { say: 'Und den ganzen Bildschirm: {Cmd+Shift+3}.', combo: 'Cmd+Shift+3', effect: { icon: '📸', title: 'Klick!', text: 'Bildschirmfoto gesichert.' } },
          ],
        },
      },
      cheats: [
        { keys: 'Win+V', text: 'Zwischenablage-Verlauf' },
        { keys: 'Win+Period', text: 'Emojis einfügen' },
        { keys: 'Win+Shift+S', text: 'Screenshot von einem Bereich' },
        { keys: 'PrintScreen', text: 'Screenshot vom ganzen Bildschirm' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '📝', title: 'Du schreibst eine Nachricht', text: '„Hier ist der Link von vorhin …“' },
        steps: [
          { say: 'Öffne den Zwischenablage-Verlauf: {Win+V}.', combo: 'Win+V', effect: { icon: '📋', title: 'Zwischenablage', text: '1. https://… · 2. Rechnungsnummer · 3. Adresse' } },
          { say: 'Füg ein Emoji ein: {Win+Period}.', combo: 'Win+Period', effect: { icon: '😀', title: 'Emoji-Auswahl', text: 'Tippen zum Suchen, z. B. „daumen“ 👍' } },
          { say: 'Mach einen Screenshot: {Win+Shift+S}.', combo: 'Win+Shift+S', effect: { icon: '✂️', title: 'Bereich auswählen', text: 'Rahmen aufziehen – fertig, liegt in der Zwischenablage.' } },
        ],
      },
    },

    {
      id: 'system-profi',
      title: 'Task-Manager & Systemmenüs',
      level: 3,
      keys: ['Ctrl+Shift+Escape', 'Win+X', 'Win+R', 'Win+I'],
      summary: 'Wenn etwas hängt oder du schnell an die Einstellungen willst.',
      explain: `
        <p><strong>{Ctrl+Shift+Escape}</strong> öffnet direkt den Task-Manager – um hängende Programme zu beenden.</p>
        <p><strong>{Win+X}</strong> öffnet das Schnellmenü (Geräte-Manager, Terminal, Herunterfahren …).</p>
        <p><strong>{Win+R}</strong> öffnet „Ausführen“, <strong>{Win+I}</strong> die Einstellungen.</p>`,
      tip: 'In „Ausführen“ ({Win+R}) bringt dich <code>%temp%</code> direkt zu den temporären Dateien.',
      mac: {
        title: 'Sofort beenden & Einstellungen',
        keys: ['Cmd+Alt+Escape', 'Cmd+Comma', 'Ctrl+Cmd+F'],
        summary: 'Wenn etwas hängt – oder du schnell an die Einstellungen willst.',
        explain: `
          <p><strong>{Cmd+Alt+Escape}</strong> öffnet „Programme sofort beenden“ – für hängende Programme.</p>
          <p><strong>{Cmd+Comma}</strong> öffnet die Einstellungen des Programms, in dem du gerade bist. Das klappt fast überall.</p>
          <p><strong>{Ctrl+Cmd+F}</strong> schaltet das Fenster in den Vollbildmodus und zurück.</p>`,
        tip: 'Die Aktivitätsanzeige (der „Task-Manager“ des Mac) findest du mit Spotlight: {Cmd+Space}, dann „Aktivität“.',
        cheats: [
          { keys: 'Cmd+Alt+Escape', text: 'Programme sofort beenden' },
          { keys: 'Cmd+Comma', text: 'Einstellungen des Programms' },
          { keys: 'Ctrl+Cmd+F', text: 'Vollbild an/aus' },
        ],
        exercise: {
          type: 'combo',
          scene: { icon: '⏳', title: 'Programm reagiert nicht', text: 'Der bunte Ball dreht sich und dreht sich …' },
          steps: [
            { say: 'Öffne „Sofort beenden“: {Cmd+Alt+Escape}.', combo: 'Cmd+Alt+Escape', effect: { icon: '🛑', title: 'Programme sofort beenden', text: 'Programm auswählen → „Sofort beenden“.' } },
            { say: 'Öffne die Einstellungen des aktiven Programms: {Cmd+Comma}.', combo: 'Cmd+Comma', effect: { icon: '⚙️', title: 'Einstellungen', text: 'Gilt für Safari, Mail, Word & Co.' } },
            { say: 'Schalte den Vollbildmodus ein: {Ctrl+Cmd+F}.', combo: 'Ctrl+Cmd+F', effect: { icon: '⛶', title: 'Vollbild', text: 'Nochmal drücken beendet den Vollbildmodus.' } },
          ],
        },
      },
      cheats: [
        { keys: 'Ctrl+Shift+Escape', text: 'Task-Manager' },
        { keys: 'Win+X', text: 'Schnellmenü' },
        { keys: 'Win+R', text: 'Ausführen' },
        { keys: 'Win+I', text: 'Einstellungen' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '⏳', title: 'Programm reagiert nicht', text: 'Die Maus dreht sich und dreht sich …' },
        steps: [
          { say: 'Öffne den Task-Manager: {Ctrl+Shift+Escape}.', combo: 'Ctrl+Shift+Escape', effect: { icon: '📊', title: 'Task-Manager', text: 'Programm auswählen → „Task beenden“.' } },
          { say: 'Öffne das Schnellmenü: {Win+X}.', combo: 'Win+X', effect: { icon: '🧰', title: 'Schnellmenü', text: 'Geräte-Manager, Datenträger, Terminal, Herunterfahren …' } },
          { say: 'Öffne „Ausführen“: {Win+R}.', combo: 'Win+R', effect: { icon: '▶️', title: 'Ausführen', text: 'Befehl eintippen, z. B. „notepad“.' } },
          { say: 'Öffne die Einstellungen: {Win+I}.', combo: 'Win+I', effect: { icon: '⚙️', title: 'Einstellungen', text: 'System, Bluetooth, Netzwerk, Konten …' } },
        ],
      },
    },
  ],
});
