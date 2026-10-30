/*
 * Kapitel 7 – Word. Aufbau einer Lektion: siehe 01-grundlagen.js
 * Die Mac-Fassung entsteht automatisch (Strg → Cmd); abweichende Texte stehen unter `mac`.
 */
TM.addChapter({
  id: 'word',
  order: 7,
  title: 'Word',
  description: 'Formatieren und ausrichten, ohne durch Menüs zu klicken.',
  lessons: [
    {
      id: 'word-formatieren',
      title: 'Fett, kursiv, unterstrichen',
      level: 1,
      keys: ['Ctrl+B', 'Ctrl+I', 'Ctrl+U'],
      summary: 'Text markieren – ein Griff – fertig formatiert.',
      explain: `
        <p>Text markieren, dann: <strong>{Ctrl+B}</strong> macht ihn fett, <strong>{Ctrl+I}</strong> kursiv, <strong>{Ctrl+U}</strong> unterstrichen.</p>
        <p>Nochmal drücken nimmt die Formatierung wieder weg.</p>
        <p>Merkhilfe aus dem Englischen: <em>B</em>old, <em>I</em>talic, <em>U</em>nderline.</p>`,
      tip: 'In deutschem Word gehen je nach Version auch {Ctrl+Shift+F} (Fett), {Ctrl+Shift+K} (Kursiv) und {Ctrl+Shift+U} (Unterstrichen). Die Kombis funktionieren übrigens auch in Outlook und PowerPoint.',
      mac: {
        tip: 'Die gleichen Kombis funktionieren in Pages, Mail, Notizen und TextEdit.',
      },
      cheats: [
        { keys: 'Ctrl+B', text: 'Fett' },
        { keys: 'Ctrl+I', text: 'Kursiv' },
        { keys: 'Ctrl+U', text: 'Unterstrichen' },
      ],
      exercise: {
        type: 'word',
        title: 'Einladung.docx',
        doc: ['Einladung zum Sommerfest', 'Am Freitag feiern wir im Garten. Bitte bringt gute Laune mit!', 'Anmeldung bis Mittwoch.'],
        steps: [
          { say: 'Markiere „Sommerfest“ (Doppelklick) und mach es fett: {Ctrl+B}.', combo: 'Ctrl+B', test: (c) => c.has('Sommerfest', 'bold'), ok: 'Fett!' },
          { say: 'Mach „Freitag“ kursiv: {Ctrl+I}.', combo: 'Ctrl+I', test: (c) => c.has('Freitag', 'italic'), ok: 'Kursiv!' },
          { say: 'Unterstreiche „Mittwoch“: {Ctrl+U}.', combo: 'Ctrl+U', test: (c) => c.has('Mittwoch', 'underline'), ok: 'Unterstrichen!' },
          { say: 'Doch nicht fett: Markiere „Sommerfest“ wieder und drück nochmal {Ctrl+B}.', combo: 'Ctrl+B', test: (c) => !c.has('Sommerfest', 'bold') },
        ],
      },
    },

    {
      id: 'word-ausrichten',
      title: 'Absätze ausrichten',
      level: 2,
      keys: ['Ctrl+E', 'Ctrl+R', 'Ctrl+L'],
      summary: 'Überschrift in die Mitte, Datum nach rechts – ohne Lineal und Menü.',
      explain: `
        <p>Cursor irgendwo in den Absatz setzen (markieren ist nicht nötig), dann:</p>
        <p><strong>{Ctrl+E}</strong> zentriert, <strong>{Ctrl+R}</strong> richtet rechtsbündig aus, <strong>{Ctrl+L}</strong> linksbündig.</p>
        <p>Merkhilfe: <em>R</em>echts, <em>L</em>inks – und E wie „c<em>e</em>nter“.</p>`,
      tip: 'Blocksatz gibt es auch per Tastatur: {Ctrl+J}.',
      cheats: [
        { keys: 'Ctrl+E', text: 'Zentrieren' },
        { keys: 'Ctrl+R', text: 'Rechtsbündig' },
        { keys: 'Ctrl+L', text: 'Linksbündig' },
        { keys: 'Ctrl+J', text: 'Blocksatz' },
      ],
      exercise: {
        type: 'word',
        title: 'Einladung.docx',
        doc: ['Berlin, 12. Juni', 'Einladung zum Sommerfest', 'Liebe Nachbarn, am Freitag feiern wir ab 17 Uhr im Garten. Für Getränke ist gesorgt.', 'Viele Grüße'],
        steps: [
          { say: 'Klick in die Überschrift „Einladung zum Sommerfest“ und zentriere sie: {Ctrl+E}.', combo: 'Ctrl+E', test: (c) => c.alignOf('Einladung') === 'center', ok: 'Schön mittig.' },
          { say: 'Klick in die Zeile mit dem Datum und setz sie nach rechts: {Ctrl+R}.', combo: 'Ctrl+R', test: (c) => c.alignOf('Berlin') === 'right', ok: 'Datum rechts – wie im Brief.' },
          { say: 'Die Überschrift doch lieber links: Klick hinein und drück {Ctrl+L}.', combo: 'Ctrl+L', test: (c) => c.alignOf('Einladung') === 'left' },
        ],
      },
    },

    {
      id: 'word-profi',
      title: 'Groß/klein & neue Seite',
      level: 3,
      keys: ['Shift+F3', 'Ctrl+Enter'],
      summary: 'Versehentlich klein geschrieben? Und nie wieder zwanzigmal Enter für eine neue Seite.',
      explain: `
        <p><strong>{Shift+F3}</strong> wechselt die Schreibweise des markierten Textes: klein → Erster Buchstabe groß → GROSS → klein …</p>
        <p><strong>{Ctrl+Enter}</strong> fügt einen Seitenumbruch ein: Der Text danach beginnt sicher auf einer neuen Seite – auch wenn du oben noch etwas ergänzt.</p>`,
      mac: {
        explain: `
          <p><strong>{Shift+F3}</strong> wechselt die Schreibweise des markierten Textes: klein → Erster Buchstabe groß → GROSS → klein … Am MacBook drückst du dazu {Fn}, damit F3 als F-Taste zählt.</p>
          <p><strong>{Cmd+Enter}</strong> fügt einen Seitenumbruch ein: Der Text danach beginnt sicher auf einer neuen Seite.</p>`,
      },
      tip: '{Ctrl+Shift+C} kopiert eine Formatierung, {Ctrl+Shift+V} überträgt sie auf anderen Text – wie der Pinsel, nur schneller.',
      cheats: [
        { keys: 'Shift+F3', text: 'Groß-/Kleinschreibung wechseln' },
        { keys: 'Ctrl+Enter', text: 'Seitenumbruch' },
        { keys: 'Ctrl+Shift+C', text: 'Format kopieren (Ctrl+Shift+V: übertragen)' },
      ],
      exercise: {
        type: 'word',
        title: 'Rundschreiben.docx',
        doc: ['wichtiger hinweis', 'Bitte lest diesen Text bis zum Ende.', 'Anhang: Teilnehmerliste'],
        steps: [
          { say: 'Markiere „wichtiger hinweis“ und drück {Shift+F3} so oft, bis alles GROSS geschrieben ist.', combo: 'Shift+F3', test: (c) => c.text.includes('WICHTIGER HINWEIS'), ok: 'Jetzt fällt es auf!' },
          { say: 'Klick ans Ende der zweiten Zeile und beginne eine neue Seite: {Ctrl+Enter}.', combo: 'Ctrl+Enter', test: (c) => c.pageBreaks > 0, ok: 'Der Anhang steht jetzt auf einer eigenen Seite.' },
        ],
      },
    },
  ],
});
