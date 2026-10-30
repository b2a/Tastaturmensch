# Tastaturmensch ⌨️

Eine kleine Lernseite für Tastenkombinationen – für **Windows und Mac**, inklusive **Word und Excel**.
Erst ein kurzes Quiz zum Wissensstand, dann eine persönliche Lernreise:
Jede Kombination wird erklärt und direkt im Browser ausprobiert – mit sofortiger Bestätigung.

**Inhalt (31 Lektionen unter Windows, 30 am Mac, in 8 Stationen):**

| Station | Beispiele (Windows) |
| --- | --- |
| Die Basis | Strg+C/V, Strg+X, Strg+Z/Y, Strg+A, Strg+S/F/P |
| Text markieren | Shift+Pfeile, Strg+Shift+Pfeile, Pos1/Ende, Strg+Rücktaste |
| Datei-Explorer | Strg+Klick, Shift+Klick, Strg+A, F2, Win+E, Strg+Shift+N |
| Fenster im Griff | Alt+Tab, Win+D, Win+Pfeile, Win+Shift+Pfeile, Alt+F4, virtuelle Desktops |
| Taskleiste & Tricks | Win+1…9, Win+L, Win+V, Win+., Win+Shift+S, Strg+Shift+Esc |
| Browser-Turbo | Strg+T/W, Strg+Shift+T, Strg+Tab, Strg+L, Zoom, F5 |
| Word | Strg+B/I/U, Strg+E/R/L, Shift+F3, Strg+Enter |
| Excel | Strg+Pfeile, Strg+Pos1/Ende, Strg+Shift+Pfeil, Strg/Shift+Leertaste, F2, Strg+D, AutoSumme |

## Windows oder Mac

Die Seite erkennt am Browser, ob ein Mac oder ein Windows-PC benutzt wird, und zeigt alle Kombis passend an
(⌘ Cmd statt Strg, ⌥ Option statt Strg+Pfeil, Cmd+Tab statt Alt+Tab, Spotlight statt Win+Zahl, Finder statt Explorer …).
Oben rechts lässt sich jederzeit umschalten; die Wahl wird gespeichert. Lektionen ohne Gegenstück
(z. B. „Fenster auf anderen Monitor“) werden auf dem anderen System ausgeblendet.

## Starten

Kein Build-Schritt, keine Abhängigkeiten.

- **Lokal:** `index.html` per Doppelklick öffnen – fertig.
- **GitHub Pages:** Im Repo unter *Settings → Pages* bei „Source“ *Deploy from a branch* wählen,
  Branch `main` und Ordner `/ (root)`. Nach ca. einer Minute ist die Seite unter
  `https://<benutzer>.github.io/Tastaturmensch/` erreichbar.

Der Fortschritt wird im Browser gespeichert (localStorage). „Fortschritt zurücksetzen“ steht unten auf der Lernreise-Seite.

## Wie Win- und Browser-Kombis geübt werden

Windows fängt `Win`-Kombinationen ab, macOS z. B. `Cmd+Tab` oder `Cmd+Space`, der Browser `Strg+T`, `Strg+W` usw.
Deshalb gibt es **eingerastete Tasten**: Ein Klick auf `Win`, `Cmd`, `fn` oder `Strg` (auf der Bildschirmtastatur
oder bei „Gesucht“) hält die Taste fest, die zweite Taste kommt von der echten Tastatur.
Der echte Browser bekommt dabei nur die zweite Taste mit – es passiert also nichts Ungewolltes.

## Aufbau

```
index.html                 lädt alle Skripte in fester Reihenfolge
css/styles.css             alle Styles; Farben, Abstände, Bewegung als Tokens in :root
js/core/
  tm.js                    globaler Namensraum TM + Registrierung
  store.js                 Fortschritt speichern
  keys.js                  Tastenkombis erkennen, vergleichen, anzeigen, einrasten
  platform.js              Windows/Mac erkennen und Lektionen für den Mac umrechnen
  ui.js                    Tastenkappen, {Ctrl+C}-Platzhalter, Konfetti, Animationshelfer
  journey.js               Niveau aus dem Quiz, Status jeder Lektion, „nächste Lektion“
js/components/keyboard.js  Bildschirmtastatur (QWERTZ)
js/exercises/              Übungstypen (siehe unten)
js/data/quiz.js            Quizfragen
js/data/lessons/*.js       ein Kapitel pro Datei
js/views/*.js              Startseite, Quiz, Ergebnis, Lernreise, Lektion, Spickzettel
js/app.js                  Hash-Router
```

## Erweitern

### Neue Lektion

In einer Kapitel-Datei unter `js/data/lessons/` einen Eintrag ergänzen:

```js
{
  id: 'neue-lektion',              // eindeutig, steht in der URL
  title: 'Mein Titel',
  level: 1,                        // 1 Einsteiger, 2 Fortgeschritten, 3 Profi
  keys: ['Ctrl+K'],                // groß angezeigt
  summary: 'Ein Satz zum Einstieg.',
  explain: '<p>Erklärung mit {Ctrl+K} als Tastenkappe.</p>',
  tip: 'Optionaler Profi-Tipp.',
  cheats: [{ keys: 'Ctrl+K', text: 'Link einfügen' }],   // für den Spickzettel
  exercise: {
    type: 'combo',
    scene: { icon: '📝', title: 'Word', text: 'Text ist markiert' },
    steps: [
      { say: 'Füg einen Link ein: {Ctrl+K}', combo: 'Ctrl+K',
        effect: { icon: '🔗', title: 'Link einfügen', text: 'Adresse eintippen, Enter.' } },
    ],
  },
}
```

**Schreibweise für Tasten:** `Ctrl`, `Shift`, `Alt`, `Win` (am Mac: `Cmd`), `Fn`, Buchstaben/Ziffern, `F1`–`F12`,
`ArrowLeft/Right/Up/Down`, `Home`, `End`, `Delete`, `Backspace`, `Enter`, `Tab`, `Escape`, `Space`,
`Plus`, `Minus`, `Period`, `Comma`. Deutsche Namen (`Strg`, `Entf`, `Pos1` …) gehen auch.
In Texten wird `{Ctrl+C}` zur Tastenkappe, `{Ctrl+Y|Ctrl+Shift+Z}` zeigt Alternativen.

### Mac-Fassung einer Lektion

Lektionen werden in Windows-Schreibweise geschrieben. Für den Mac rechnet `js/core/platform.js`
automatisch um: `Strg` → `Cmd`, `Strg+Pfeil` → `Option+Pfeil`, `Pos1/Ende` → `Cmd+Pfeil`, `Strg+Y` → `Cmd+Shift+Z`, `F5` → `Cmd+R` …
Wo das nicht passt, gibt es Überschreibungen. Was unter `mac` steht, wird **nicht** umgerechnet:

```js
{
  id: 'sperren',
  keys: ['Win+L'],
  explain: '<p>{Win+L} sperrt den PC.</p>',
  mac: {                                   // ganze Felder ersetzen
    keys: ['Ctrl+Cmd+Q'],
    explain: '<p>{Ctrl+Cmd+Q} sperrt den Mac.</p>',
  },
  exercise: {
    type: 'combo',
    steps: [
      { say: 'Sperr den PC: {Win+L}', combo: 'Win+L',
        mac: { say: 'Sperr den Mac: {Ctrl+Cmd+Q}', combo: 'Ctrl+Cmd+Q' } },   // einzelner Schritt
    ],
    mac: { /* oder: Felder der ganzen Übung ersetzen, z. B. steps: [...] */ },
  },
}
```

`mac: false` blendet eine Lektion, Quizfrage oder ein Kapitel am Mac aus, `win: false` unter Windows.

### Neues Kapitel

Neue Datei `js/data/lessons/07-office.js` mit `TM.addChapter({ id, order, title, description, lessons: [...] })`
anlegen und in `index.html` bei den anderen Kapiteln eintragen. `order` bestimmt die Reihenfolge.

### Neue Quizfrage

In `js/data/quiz.js` ergänzen. `lessons` verknüpft die Frage mit Lektionen:
richtig beantwortet → „kannst du schon“, falsch → fest in der Reise.

### Vorhandene Übungstypen

| Typ | Wofür | Wichtigste Felder |
| --- | --- | --- |
| `combo` | Kombi drücken, Mini-Bildschirm reagiert | `scene`, `steps[{ say, combo, times, effect }]` |
| `text` | echtes Textfeld (Kopieren, Markieren, Löschen) | `text`, `source`, `steps[{ say, combo, test(ctx, check) }]` |
| `explorer` | Dateiliste mit Strg/Shift-Klick, Pfeilen, Strg+A, F2 | `files`, `steps[{ say, expect, via, renamed }]` |
| `windows` | Fenster andocken, Monitore wechseln (`mode: 'mac'` für macOS 15) | `monitors`, `start`, `steps[{ say, target, expect }]` |
| `taskbar` | Win+1…9 | `apps`, `rounds` oder `tasks`, `showNumbers` |
| `switcher` | Alt+Tab bzw. Cmd+Tab | `windows`, `targets` |
| `browser` | Tabs, Adressleiste, Zoom | `tabs`, `steps[{ say, combo }]` |
| `word` | Mini-Word: Fett/Kursiv/Unterstrichen, Ausrichten, Groß/Klein, Seitenumbruch | `doc`, `steps[{ say, combo, test(ctx) }]` |
| `excel` | Mini-Excel: springen, markieren, bearbeiten, ausfüllen, AutoSumme | `data`, `start`, `steps[{ say, target, via, test(ctx) }]` |

Die genaue Beschreibung steht jeweils oben in der Datei unter `js/exercises/`.

### Neuer Übungstyp

Datei unter `js/exercises/` anlegen, in `index.html` eintragen:

```js
TM.registerExercise('mein-typ', {
  virtualInput: true,                    // darf die Bildschirmtastatur Eingaben auslösen?
  mount(stage, config, api) {
    api.steps(['Schritt 1 mit {Ctrl+K}']);
    api.step(0);
    api.targets('Ctrl+K');
    const off = TM.keys.on((e) => {
      if (e.type === 'combo' && TM.keys.matches(e.combo, 'Ctrl+K')) api.complete();
    });
    return { destroy: off };
  },
});
```

`api` bietet: `steps()`, `step(i)`, `targets(combo)`, `say(html, 'info'|'ok'|'warn')`, `wrong(gedrückt, gesucht)`, `complete()`.

### Hinweis zu Office-Kürzeln

Deutsches Office nutzt teils eigene Kürzel (z. B. Fett auch mit Strg+Umschalt+F, „Nach unten ausfüllen“
je nach Version Strg+D oder Strg+U). Die Lektionen lehren die verbreiteten Kombis, nennen die
deutschen Varianten als Hinweis, und die Excel-Übung akzeptiert beide.

### Aussehen anpassen

Farben, Abstände und Animationsdauern stehen als CSS-Variablen ganz oben in `css/styles.css`
(inkl. Dunkelmodus). Animationen nutzen nur `transform`/`opacity` und werden bei
„Bewegung reduzieren“ im Betriebssystem auf einfache Einblendungen reduziert.
