/* Kapitel 4 – Fenster im Griff. Aufbau einer Lektion: siehe 01-grundlagen.js */
TM.addChapter({
  id: 'fenster',
  order: 4,
  title: 'Fenster im Griff',
  description: 'Zwischen Programmen wechseln, Fenster andocken und auf andere Monitore schieben.',
  lessons: [
    {
      id: 'alt-tab',
      title: 'Programme wechseln',
      level: 1,
      keys: ['Alt+Tab'],
      summary: 'Der schnellste Weg zwischen offenen Fenstern hin und her.',
      explain: `
        <p><strong>{Alt}</strong> gedrückt halten und <strong>{Tab}</strong> tippen: Eine Übersicht aller Fenster erscheint.</p>
        <p>Jedes weitere {Tab} springt eins weiter. Erst wenn du {Alt} <em>loslässt</em>, wird gewechselt.</p>
        <p>Nur einmal kurz {Alt+Tab} bringt dich zum zuletzt benutzten Fenster – perfekt zum Hin- und Herspringen.</p>`,
      tip: '{Win+Tab} öffnet die große Taskansicht mit allen Fenstern und virtuellen Desktops.',
      mac: {
        keys: ['Cmd+Tab'],
        explain: `
          <p><strong>{Cmd}</strong> gedrückt halten und <strong>{Tab}</strong> tippen: Eine Leiste mit allen offenen Programmen erscheint.</p>
          <p>Jedes weitere {Tab} springt eins weiter. Erst wenn du {Cmd} <em>loslässt</em>, wird gewechselt.</p>
          <p>Nur einmal kurz {Cmd+Tab} bringt dich zum zuletzt benutzten Programm.</p>`,
        tip: '{Ctrl+ArrowUp} öffnet Mission Control mit allen Fenstern auf einen Blick.',
        cheats: [
          { keys: 'Cmd+Tab', text: 'Zwischen Programmen wechseln' },
          { keys: 'Cmd+Shift+Tab', text: 'Rückwärts wechseln' },
          { keys: 'Ctrl+ArrowUp', text: 'Mission Control' },
        ],
      },
      cheats: [
        { keys: 'Alt+Tab', text: 'Zwischen Fenstern wechseln' },
        { keys: 'Alt+Shift+Tab', text: 'Rückwärts wechseln' },
        { keys: 'Win+Tab', text: 'Taskansicht' },
      ],
      exercise: {
        type: 'switcher',
        windows: [
          { name: 'Word', short: 'W', color: '#2b579a' },
          { name: 'Browser', short: 'B', color: '#0f7b6c' },
          { name: 'Musik', short: '♪', color: '#c2255c' },
          { name: 'Explorer', short: 'E', color: '#e8a317' },
        ],
        targets: ['Musik', 'Word'],
      },
    },

    {
      id: 'desktop',
      title: 'Desktop anzeigen',
      level: 1,
      keys: ['Win+D'],
      summary: 'Alle Fenster weg, Desktop frei – und mit dem gleichen Griff wieder zurück.',
      explain: `
        <p><strong>{Win+D}</strong> blendet alle Fenster aus und zeigt den Desktop. Merkhilfe: <em>D wie Desktop</em>.</p>
        <p>Noch einmal {Win+D} holt alle Fenster genau so zurück, wie sie waren.</p>`,
      tip: '{Win+M} minimiert alle Fenster, {Win+Shift+M} stellt sie wieder her.',
      mac: {
        title: 'Programme ausblenden & minimieren',
        keys: ['Cmd+H', 'Cmd+M', 'Cmd+Alt+H'],
        summary: 'Fenster schnell aus dem Weg räumen – ohne sie zu schließen.',
        explain: `
          <p><strong>{Cmd+H}</strong> blendet das aktive Programm aus (H wie <em>hide</em>). Mit {Cmd+Tab} holst du es zurück.</p>
          <p><strong>{Cmd+M}</strong> minimiert das aktive Fenster ins Dock.</p>
          <p><strong>{Cmd+Alt+H}</strong> blendet alle <em>anderen</em> Programme aus – perfekt zum Konzentrieren.</p>`,
        tip: 'Den Schreibtisch zeigst du mit {Fn+F11} oder per Geste: Daumen und drei Finger auf dem Trackpad auseinanderziehen.',
        cheats: [
          { keys: 'Cmd+H', text: 'Programm ausblenden' },
          { keys: 'Cmd+M', text: 'Fenster ins Dock' },
          { keys: 'Cmd+Alt+H', text: 'Andere Programme ausblenden' },
        ],
        exercise: {
          type: 'combo',
          scene: { icon: '🗂️', title: 'Fünf Fenster offen', text: 'Pages, Numbers, Safari, Mail, Finder …' },
          steps: [
            { say: 'Blende alle anderen Programme aus: {Cmd+Alt+H}.', combo: 'Cmd+Alt+H', effect: { icon: '🧘', title: 'Nur noch Pages', text: 'Alles andere ist ausgeblendet.' } },
            { say: 'Minimiere das Fenster ins Dock: {Cmd+M}.', combo: 'Cmd+M', effect: { icon: '⬇️', title: 'Im Dock', text: 'Ein Klick aufs Dock-Symbol holt es zurück.' } },
            { say: 'Und blende das Programm ganz aus: {Cmd+H}.', combo: 'Cmd+H', effect: { icon: '🖥️', title: 'Freier Schreibtisch', text: 'Mit {Cmd+Tab} kommst du zurück.' } },
          ],
        },
      },
      cheats: [
        { keys: 'Win+D', text: 'Desktop anzeigen / zurück' },
        { keys: 'Win+M', text: 'Alle Fenster minimieren' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '🗂️', title: 'Fünf Fenster offen', text: 'Word, Excel, Browser, Mail, Explorer …' },
        steps: [
          { say: 'Räum auf: Zeig mit {Win+D} den Desktop.', combo: 'Win+D', effect: { icon: '🖥️', title: 'Desktop', text: 'Alles weg – freie Sicht auf deine Desktop-Symbole.' } },
          { say: 'Und alles wieder zurück: nochmal {Win+D}.', combo: 'Win+D', effect: { icon: '🗂️', title: 'Fenster sind zurück', text: 'Genau so, wie sie vorher waren.' } },
        ],
      },
    },

    {
      id: 'fenster-andocken',
      title: 'Fenster andocken',
      level: 2,
      keys: ['Win+ArrowLeft', 'Win+ArrowRight', 'Win+ArrowUp', 'Win+ArrowDown'],
      summary: 'Zwei Fenster nebeneinander in einer Sekunde – ohne Ziehen und Zielen.',
      explain: `
        <p><strong>{Win+ArrowLeft}</strong> / <strong>{Win+ArrowRight}</strong> docken das Fenster an die linke oder rechte Bildschirmhälfte.</p>
        <p><strong>{Win+ArrowUp}</strong> maximiert, <strong>{Win+ArrowDown}</strong> verkleinert wieder (oder minimiert).</p>
        <p>Angedockt + {Win+ArrowUp} oder {Win+ArrowDown} ergibt ein Viertel des Bildschirms.</p>`,
      tip: 'Ist ein Fenster links angedockt, holt {Win+ArrowRight} es zuerst in die Mitte zurück – ein zweites Mal dockt es rechts an.',
      mac: {
        title: 'Fenster anordnen',
        keys: ['Fn+Ctrl+ArrowLeft', 'Fn+Ctrl+ArrowRight', 'Fn+Ctrl+F'],
        summary: 'Seit macOS 15 (Sequoia) dockt auch der Mac Fenster per Tastatur an.',
        explain: `
          <p>Halte <strong>{Fn}</strong> (bzw. die Globus-Taste) und <strong>{Ctrl}</strong> und drück eine Pfeiltaste: ← linke Hälfte, → rechte Hälfte, ↑ obere, ↓ untere Hälfte.</p>
          <p><strong>{Fn+Ctrl+F}</strong> lässt das Fenster den ganzen Bildschirm füllen.</p>
          <p>Ältere macOS-Versionen können das noch nicht – dort hilft der grüne Punkt oben links im Fenster.</p>`,
        tip: 'Alle Varianten findest du in jedem Programm im Menü „Fenster“ → „Bewegen & Größe ändern“.',
        cheats: [
          { keys: 'Fn+Ctrl+ArrowLeft', text: 'Linke Hälfte (→ rechte, ↑ obere, ↓ untere)' },
          { keys: 'Fn+Ctrl+F', text: 'Bildschirm füllen' },
        ],
      },
      cheats: [
        { keys: 'Win+ArrowLeft', text: 'Links andocken (→ rechts)' },
        { keys: 'Win+ArrowUp', text: 'Maximieren' },
        { keys: 'Win+ArrowDown', text: 'Verkleinern / minimieren' },
      ],
      exercise: {
        type: 'windows',
        monitors: 1,
        app: 'Notizen',
        start: { monitor: 0, snap: 'normal' },
        steps: [
          { say: 'Maximiere das Fenster mit {Win+ArrowUp}.', target: 'Win+ArrowUp', expect: { snap: 'max' } },
          { say: 'Wieder normal groß: {Win+ArrowDown}.', target: 'Win+ArrowDown', expect: { snap: 'normal' } },
          { say: 'Dock es links an: {Win+ArrowLeft}.', target: 'Win+ArrowLeft', expect: { snap: 'left' } },
          { say: 'Jetzt nach rechts: {Win+ArrowRight} – einmal holt es in die Mitte, ein zweites Mal dockt es an.', target: 'Win+ArrowRight', expect: { snap: 'right' } },
          { say: 'Und ins obere Viertel: {Win+ArrowUp}.', target: 'Win+ArrowUp', expect: { snap: 'tr' } },
        ],
        mac: {
          mode: 'mac',
          steps: [
            { say: 'Linke Hälfte: {Fn+Ctrl+ArrowLeft}.', target: 'Fn+Ctrl+ArrowLeft', expect: { snap: 'left' } },
            { say: 'Rechte Hälfte: {Fn+Ctrl+ArrowRight}.', target: 'Fn+Ctrl+ArrowRight', expect: { snap: 'right' } },
            { say: 'Obere Hälfte: {Fn+Ctrl+ArrowUp}.', target: 'Fn+Ctrl+ArrowUp', expect: { snap: 'th' } },
            { say: 'Ganzen Bildschirm füllen: {Fn+Ctrl+F}.', target: 'Fn+Ctrl+F', expect: { snap: 'max' } },
          ],
        },
      },
    },

    {
      id: 'monitor-wechsel',
      mac: false,
      title: 'Fenster auf anderen Monitor',
      level: 2,
      keys: ['Win+Shift+ArrowLeft', 'Win+Shift+ArrowRight'],
      summary: 'Zwei Bildschirme? Fenster rüberschieben, ohne es mit der Maus zu ziehen.',
      explain: `
        <p><strong>{Win+Shift+ArrowRight}</strong> schiebt das aktive Fenster auf den rechten Monitor, <strong>{Win+Shift+ArrowLeft}</strong> auf den linken.</p>
        <p>Größe und Andock-Position bleiben dabei erhalten.</p>
        <p>Nur ein Bildschirm? Merk es dir trotzdem – am Arbeitsplatz mit zwei Monitoren ist es Gold wert.</p>`,
      tip: 'Ein angedocktes Fenster wandert auch mit {Win+ArrowRight} weiter auf den nächsten Monitor.',
      cheats: [{ keys: 'Win+Shift+ArrowRight', text: 'Fenster auf anderen Monitor (auch ←)' }],
      exercise: {
        type: 'windows',
        monitors: 2,
        app: 'Präsentation',
        start: { monitor: 0, snap: 'normal' },
        steps: [
          { say: 'Schieb das Fenster mit {Win+Shift+ArrowRight} auf Monitor 2.', target: 'Win+Shift+ArrowRight', expect: { monitor: 1 } },
          { say: 'Maximiere es dort mit {Win+ArrowUp}.', target: 'Win+ArrowUp', expect: { monitor: 1, snap: 'max' } },
          { say: 'Und zurück auf Monitor 1: {Win+Shift+ArrowLeft}.', target: 'Win+Shift+ArrowLeft', expect: { monitor: 0, snap: 'max' } },
        ],
      },
    },

    {
      id: 'schliessen',
      title: 'Fenster & Tabs schließen',
      level: 2,
      keys: ['Ctrl+W', 'Alt+F4'],
      summary: 'Tab zu, Programm zu – ohne das kleine X zu suchen.',
      explain: `
        <p><strong>{Ctrl+W}</strong> schließt den aktuellen Tab oder das aktuelle Dokument (Browser, Word, Explorer).</p>
        <p><strong>{Alt+F4}</strong> beendet das ganze Programm. Auf dem leeren Desktop öffnet es das Herunterfahren-Menü.</p>
        <p><strong>Achtung:</strong> Echt gedrückt würden beide <em>diese Seite</em> schließen. Übe sie hier nur über die Bildschirmtastatur.</p>`,
      tip: 'Zu viel geschlossen? Im Browser holt {Ctrl+Shift+T} den Tab zurück.',
      mac: {
        keys: ['Cmd+W', 'Cmd+Q'],
        summary: 'Fenster zu, Programm beenden – ohne den roten Punkt zu suchen.',
        explain: `
          <p><strong>{Cmd+W}</strong> schließt das aktuelle Fenster bzw. den aktuellen Tab.</p>
          <p><strong>{Cmd+Q}</strong> beendet das ganze Programm. Wichtig am Mac: Das rote X schließt oft nur das Fenster, das Programm läuft weiter.</p>
          <p><strong>Achtung:</strong> Echt gedrückt würden beide <em>diese Seite</em> schließen. Übe sie hier nur über die Bildschirmtastatur.</p>`,
        cheats: [
          { keys: 'Cmd+W', text: 'Fenster / Tab schließen' },
          { keys: 'Cmd+Q', text: 'Programm beenden' },
        ],
      },
      cheats: [
        { keys: 'Ctrl+W', text: 'Tab / Dokument schließen' },
        { keys: 'Alt+F4', text: 'Programm beenden' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '🌐', title: 'Browser mit 3 Tabs', text: 'Nachrichten · Wetter · Rezepte' },
        steps: [
          { say: 'Schließ den aktuellen Tab: {Ctrl} anklicken, dann W.', combo: 'Ctrl+W', effect: { icon: '🌐', title: 'Noch 2 Tabs', text: 'Der Rezepte-Tab ist zu.' }, mac: { say: 'Schließ den aktuellen Tab: {Cmd} anklicken, dann W.' } },
          {
            say: 'Beende den ganzen Browser: {Alt} anklicken, dann F4.',
            combo: 'Alt+F4',
            effect: { icon: '🖥️', title: 'Browser beendet', text: 'Auf dem leeren Desktop würde {Alt+F4} jetzt „Herunterfahren“ anbieten.' },
            mac: { say: 'Beende den ganzen Browser: {Cmd} anklicken, dann Q.', effect: { icon: '🖥️', title: 'Browser beendet', text: 'Das Programm ist komplett zu – nicht nur das Fenster.' } },
          },
        ],
      },
    },

    {
      id: 'virtuelle-desktops',
      title: 'Virtuelle Desktops',
      level: 3,
      keys: ['Win+Tab', 'Ctrl+Win+D', 'Ctrl+Win+ArrowRight'],
      summary: 'Mehrere Desktops: einer für die Arbeit, einer für Privates.',
      explain: `
        <p><strong>{Win+Tab}</strong> öffnet die Taskansicht mit allen Fenstern und Desktops.</p>
        <p><strong>{Ctrl+Win+D}</strong> erstellt einen neuen virtuellen Desktop.</p>
        <p><strong>{Ctrl+Win+ArrowLeft}</strong> / <strong>{Ctrl+Win+ArrowRight}</strong> wechseln zwischen den Desktops, {Ctrl+Win+F4} schließt den aktuellen.</p>`,
      tip: 'In der Taskansicht kannst du Fenster per Maus auf einen anderen Desktop ziehen.',
      mac: {
        title: 'Mission Control & Spaces',
        keys: ['Ctrl+ArrowUp', 'Ctrl+ArrowLeft', 'Ctrl+ArrowRight'],
        summary: 'Alle Fenster auf einen Blick und mehrere Schreibtische („Spaces“).',
        explain: `
          <p><strong>{Ctrl+ArrowUp}</strong> öffnet Mission Control: alle Fenster auf einen Blick, oben die Spaces. Über das + legst du einen neuen Space an.</p>
          <p><strong>{Ctrl+ArrowLeft}</strong> / <strong>{Ctrl+ArrowRight}</strong> wechseln zwischen den Spaces.</p>
          <p><strong>{Ctrl+ArrowDown}</strong> zeigt alle Fenster des aktuellen Programms.</p>`,
        tip: 'Programme im Vollbild ({Ctrl+Cmd+F}) bekommen automatisch einen eigenen Space.',
        cheats: [
          { keys: 'Ctrl+ArrowUp', text: 'Mission Control' },
          { keys: 'Ctrl+ArrowRight', text: 'Space wechseln (auch ←)' },
          { keys: 'Ctrl+ArrowDown', text: 'Alle Fenster des Programms' },
        ],
        exercise: {
          type: 'combo',
          scene: { icon: '🖥️', title: 'Space 1', text: 'Arbeit: Mail, Numbers, Teams' },
          steps: [
            { say: 'Öffne Mission Control: {Ctrl+ArrowUp}.', combo: 'Ctrl+ArrowUp', effect: { icon: '🪟', title: 'Mission Control', text: 'Alle Fenster auf einen Blick, oben die Spaces.' } },
            { say: 'Wechsle zum nächsten Space: {Ctrl+ArrowRight}.', combo: 'Ctrl+ArrowRight', effect: { icon: '✨', title: 'Space 2', text: 'Ganz leer – Platz für Privates.' } },
            { say: 'Und zurück: {Ctrl+ArrowLeft}.', combo: 'Ctrl+ArrowLeft', effect: { icon: '🖥️', title: 'Space 1', text: 'Deine Arbeitsfenster sind noch da.' } },
          ],
        },
      },
      cheats: [
        { keys: 'Win+Tab', text: 'Taskansicht' },
        { keys: 'Ctrl+Win+D', text: 'Neuer virtueller Desktop' },
        { keys: 'Ctrl+Win+ArrowRight', text: 'Desktop wechseln (auch ←)' },
        { keys: 'Ctrl+Win+F4', text: 'Virtuellen Desktop schließen' },
      ],
      exercise: {
        type: 'combo',
        scene: { icon: '🖥️', title: 'Desktop 1', text: 'Arbeit: Mail, Excel, Teams' },
        steps: [
          { say: 'Öffne die Taskansicht: {Win+Tab}.', combo: 'Win+Tab', effect: { icon: '🪟', title: 'Taskansicht', text: 'Alle Fenster auf einen Blick, oben die Desktops.' } },
          { say: 'Erstelle einen neuen Desktop: {Ctrl+Win+D}.', combo: 'Ctrl+Win+D', effect: { icon: '✨', title: 'Desktop 2', text: 'Ganz leer – Platz für Privates.' } },
          { say: 'Wechsle zurück zu Desktop 1: {Ctrl+Win+ArrowLeft}.', combo: 'Ctrl+Win+ArrowLeft', effect: { icon: '🖥️', title: 'Desktop 1', text: 'Deine Arbeitsfenster sind noch da.' } },
          { say: 'Und wieder rüber: {Ctrl+Win+ArrowRight}.', combo: 'Ctrl+Win+ArrowRight', effect: { icon: '✨', title: 'Desktop 2', text: 'Hin und her in Sekunden.' } },
        ],
      },
    },
  ],
});
