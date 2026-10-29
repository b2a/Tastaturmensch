/* Lernreise: alle Kapitel als Stationen mit ihren Lektionen. */
(function (TM) {
  const { esc, combo } = TM.ui;

  const STATUS = {
    done: { tag: 'Geschafft', icon: '✓' },
    known: { tag: 'Kannst du schon', icon: '★' },
    todo: { tag: '', icon: '' },
  };

  TM.registerView('journey', {
    title: 'Lernreise',
    render(main) {
      const st = TM.store.get();
      const stats = TM.journey.stats();
      const next = TM.journey.next();
      const lvl = TM.journey.LEVELS[TM.journey.level()];

      main.innerHTML = `
        <section class="page journey${st.hideKnown ? ' hide-known' : ''}">
          <header class="page-head">
            <p class="eyebrow">${st.quiz ? `Deine Lernreise · Niveau: ${esc(lvl.name)}` : 'Lernreise'}</p>
            <h1>${stats.todo === 0 ? 'Reise geschafft!' : 'Station für Station zum Tastaturmenschen'}</h1>
            ${
              st.quiz
                ? ''
                : `<div class="notice"><p>Tipp: Mit dem <a href="#/quiz">kurzen Quiz</a> überspringen wir, was du schon kannst.</p></div>`
            }
            <div class="journey-progress">
              <div class="progress-track" aria-hidden="true"><span style="transform:scaleX(${stats.progress})"></span></div>
              <p>${stats.done} von ${stats.done + stats.todo} Lektionen geschafft${stats.known ? ` · ${stats.known} kannst du schon` : ''}</p>
            </div>
            <div class="journey-actions">
              ${
                next
                  ? `<a class="btn btn-primary" href="#/lektion/${next.id}">${stats.done ? 'Weiter' : 'Los geht’s'}: ${esc(next.title)}</a>`
                  : `<a class="btn btn-primary" href="#/spickzettel">Zum Spickzettel</a>`
              }
              <label class="toggle"><input type="checkbox" class="toggle-known" ${st.hideKnown ? 'checked' : ''}> <span>Bekanntes ausblenden</span></label>
            </div>
          </header>

          <ol class="chapters">
            ${TM.chapters
              .map((c, ci) => {
                const ls = c.lessons;
                const doneCount = ls.filter((l) => TM.journey.status(l) !== 'todo').length;
                const allKnown = ls.every((l) => TM.journey.status(l) === 'known');
                return `<li class="chapter${allKnown ? ' is-all-known' : ''}" style="--i:${ci}">
                  <div class="chapter-head">
                    <span class="chapter-num${doneCount === ls.length ? ' is-complete' : ''}">${doneCount === ls.length ? '✓' : ci + 1}</span>
                    <div><h2>${esc(c.title)}</h2><p>${esc(c.description || '')}</p></div>
                    <span class="chapter-count">${doneCount}/${ls.length}</span>
                  </div>
                  <ol class="nodes">
                    ${ls
                      .map((l) => {
                        const s = TM.journey.status(l);
                        const isNext = next && next.id === l.id;
                        const extra = s === 'todo' && TM.journey.isExtra(l);
                        const tag = isNext ? 'Als Nächstes' : extra ? 'Profi-Extra' : STATUS[s].tag;
                        return `<li class="node is-${s}${isNext ? ' is-next' : ''}">
                          <a href="#/lektion/${l.id}">
                            <span class="node-dot" aria-hidden="true">${STATUS[s].icon}</span>
                            <span class="node-body">
                              <span class="node-title">${esc(l.title)}</span>
                              <span class="node-keys">${l.keys.slice(0, 2).map((k) => combo(k)).join('')}</span>
                            </span>
                            ${tag ? `<span class="node-tag">${tag}</span>` : ''}
                          </a>
                        </li>`;
                      })
                      .join('')}
                  </ol>
                </li>`;
              })
              .join('')}
          </ol>

          <footer class="journey-foot">
            <button type="button" class="btn btn-ghost btn-small reset-progress">Fortschritt zurücksetzen</button>
          </footer>
        </section>`;

      main.querySelector('.toggle-known').addEventListener('change', (e) => {
        TM.store.set({ hideKnown: e.target.checked });
        main.querySelector('.journey').classList.toggle('hide-known', e.target.checked);
      });

      main.querySelector('.reset-progress').addEventListener('click', () => {
        if (window.confirm('Quiz-Ergebnis und alle geschafften Lektionen löschen?')) {
          TM.store.reset();
          location.hash = '#/';
        }
      });
      return null;
    },
  });
})(window.TM);
