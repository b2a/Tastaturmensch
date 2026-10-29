/* Kapitel 6 – Browser-Turbo. Aufbau einer Lektion: siehe 01-grundlagen.js */
TM.addChapter({
  id: 'browser',
  order: 6,
  title: 'Browser-Turbo',
  description: 'Tabs, Adressleiste und Zoom – gilt für Edge, Chrome und Firefox.',
  lessons: [
    {
      id: 'browser-tabs',
      title: 'Tabs im Griff',
      level: 2,
      keys: ['Ctrl+T', 'Ctrl+W', 'Ctrl+Shift+T', 'Ctrl+Tab'],
      summary: 'Neuer Tab, Tab zu, Tab zurückholen, Tab wechseln.',
      explain: `
        <p><strong>{Ctrl+T}</strong> öffnet einen neuen Tab, <strong>{Ctrl+W}</strong> schließt den aktuellen.</p>
        <p><strong>{Ctrl+Shift+T}</strong> holt den zuletzt geschlossenen Tab zurück – der Lebensretter!</p>
        <p><strong>{Ctrl+Tab}</strong> springt zum nächsten Tab, {Ctrl+Shift+Tab} zum vorherigen. {Ctrl+1} bis {Ctrl+8} springen direkt zu Tab 1–8.</p>
        <p><strong>Achtung:</strong> Echt gedrückt würde dein Browser diese Kombis selbst ausführen (und {Ctrl+W} diese Seite schließen). Darum: {Ctrl} auf der Bildschirmtastatur anklicken, dann die Taste drücken.</p>`,
      tip: '{Ctrl+Shift+T} funktioniert mehrmals hintereinander – und holt nach einem Absturz sogar ganze Fenster zurück.',
      cheats: [
        { keys: 'Ctrl+T', text: 'Neuer Tab' },
        { keys: 'Ctrl+W', text: 'Tab schließen' },
        { keys: 'Ctrl+Shift+T', text: 'Geschlossenen Tab wiederherstellen' },
        { keys: 'Ctrl+Tab', text: 'Nächster Tab' },
        { keys: 'Ctrl+1…8', text: 'Direkt zu Tab 1–8' },
      ],
      exercise: {
        type: 'browser',
        tabs: [
          { title: 'Nachrichten', url: 'nachrichten.de', text: 'Die wichtigsten Meldungen des Tages.' },
          { title: 'Wetter', url: 'wetter.de', text: 'Morgen: sonnig, 21 °C.' },
        ],
        steps: [
          { say: 'Öffne einen neuen Tab: {Ctrl+T}.', combo: 'Ctrl+T' },
          { say: 'Schließ ihn wieder: {Ctrl+W}.', combo: 'Ctrl+W' },
          { say: 'Ups, doch gebraucht! Hol ihn zurück: {Ctrl+Shift+T}.', combo: 'Ctrl+Shift+T' },
          { say: 'Spring zum nächsten Tab: {Ctrl+Tab}.', combo: 'Ctrl+Tab' },
        ],
      },
    },

    {
      id: 'browser-navigation',
      title: 'Adressleiste, Zoom & Neu laden',
      level: 2,
      keys: ['Ctrl+L', 'Ctrl+Plus', 'Ctrl+Minus', 'Ctrl+0', 'F5'],
      summary: 'Sofort eine neue Adresse tippen, Text größer machen, Seite neu laden.',
      explain: `
        <p><strong>{Ctrl+L}</strong> (oder {F6}) markiert die Adressleiste – einfach lostippen.</p>
        <p><strong>{Ctrl+Plus}</strong> und <strong>{Ctrl+Minus}</strong> zoomen, <strong>{Ctrl+0}</strong> setzt den Zoom zurück. Das klappt auch in Word, Excel und im Explorer.</p>
        <p><strong>{F5}</strong> lädt die Seite neu. {Ctrl+F5} lädt sie komplett frisch, ohne Zwischenspeicher.</p>`,
      tip: '{Ctrl+D} setzt ein Lesezeichen, {Ctrl+H} zeigt den Verlauf.',
      cheats: [
        { keys: 'Ctrl+L', text: 'Adressleiste' },
        { keys: 'Ctrl+Plus', text: 'Vergrößern (Ctrl+Minus: verkleinern)' },
        { keys: 'Ctrl+0', text: 'Zoom zurücksetzen' },
        { keys: 'F5', text: 'Neu laden' },
        { keys: 'Ctrl+D', text: 'Lesezeichen setzen' },
      ],
      exercise: {
        type: 'browser',
        tabs: [{ title: 'Rezepte', url: 'rezepte.de', text: 'Omas Apfelkuchen: 250 g Mehl, 3 Äpfel …' }],
        steps: [
          { say: 'Spring in die Adressleiste: {Ctrl+L}.', combo: ['Ctrl+L', 'F6'] },
          { say: 'Die Schrift ist zu klein – vergrößere mit {Ctrl+Plus}.', combo: 'Ctrl+Plus' },
          { say: 'Zoom zurücksetzen: {Ctrl+0}.', combo: 'Ctrl+0' },
          { say: 'Lade die Seite neu: {F5}.', combo: ['F5', 'Ctrl+R'] },
        ],
      },
    },
  ],
});
