/* Spickzettel: alle Kombis auf einen Blick, durchsuchbar und druckbar. */
(function (TM) {
  const { esc, combo } = TM.ui;

  function entries(lesson) {
    return lesson.cheats && lesson.cheats.length ? lesson.cheats : lesson.keys.map((k) => ({ keys: k, text: lesson.title }));
  }

  function searchText(entry) {
    const keys = String(entry.keys)
      .split('+')
      .map((t) => `${t} ${TM.keys.label(TM.keys.token(t))}`)
      .join(' ');
    return `${keys} ${entry.text}`.toLowerCase();
  }

  TM.registerView('cheatsheet', {
    title: 'Spickzettel',
    render(main) {
      main.innerHTML = `
        <section class="page cheatsheet">
          <header class="page-head">
            <p class="eyebrow">Zum Nachschlagen</p>
            <h1>Spickzettel</h1>
            <div class="cheat-tools">
              <div class="field">
                <label class="field-label" for="cheat-search">Suchen</label>
                <input id="cheat-search" class="input" type="search" placeholder="z. B. Fenster, Strg, kopieren" autocomplete="off">
              </div>
              <button type="button" class="btn btn-ghost print-btn">Drucken <span class="key key-small" aria-hidden="true">Strg</span><span class="key key-small" aria-hidden="true">P</span></button>
            </div>
          </header>
          <div class="cheat-groups">
            ${TM.chapters
              .map(
                (c) => `<section class="cheat-group card">
                  <h2>${esc(c.title)}</h2>
                  <ul class="cheat-list">
                    ${c.lessons
                      .flatMap((l) =>
                        entries(l).map(
                          (e) => `<li class="cheat-row" data-search="${esc(searchText(e))}">
                            <span class="cheat-keys">${combo(e.keys)}</span>
                            <span class="cheat-text">${esc(e.text)}</span>
                            <a class="cheat-link" href="#/lektion/${l.id}" aria-label="Lektion ${esc(l.title)} öffnen">Üben</a>
                          </li>`
                        )
                      )
                      .join('')}
                  </ul>
                </section>`
              )
              .join('')}
          </div>
          <p class="cheat-empty" hidden>Nichts gefunden. Probier einen anderen Begriff – z. B. „Tab“ oder „markieren“.</p>
        </section>`;

      const input = main.querySelector('#cheat-search');
      const empty = main.querySelector('.cheat-empty');
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        let any = false;
        main.querySelectorAll('.cheat-group').forEach((g) => {
          let groupHit = false;
          g.querySelectorAll('.cheat-row').forEach((r) => {
            const hit = !q || q.split(/\s+/).every((w) => r.dataset.search.includes(w));
            r.hidden = !hit;
            groupHit = groupHit || hit;
          });
          g.hidden = !groupHit;
          any = any || groupHit;
        });
        empty.hidden = any;
      });
      main.querySelector('.print-btn').addEventListener('click', () => window.print());
      return null;
    },
  });
})(window.TM);
