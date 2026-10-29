/*
 * Übungstyp "taskbar": Programme mit Win+1 … Win+9 aus der Taskleiste öffnen.
 *
 * Config:
 *   { type: 'taskbar',
 *     apps: [{ name: 'Word', short: 'W', color: '#2b579a' }, ...],   // max. 9
 *     tasks: ['Rechner', 'Word', 'Musik'],     // feste Aufgaben – oder:
 *     rounds: 3,                               // so viele zufällige Aufgaben
 *     showNumbers: 1 }                         // in den ersten n Runden Zahlen einblenden
 */
(function (TM) {
  const { esc } = TM.ui;

  TM.registerExercise('taskbar', {
    mount(stage, cfg, api) {
      const apps = (cfg.apps || []).slice(0, 9);
      const showNumbers = cfg.showNumbers ?? 1;
      let tasks = cfg.tasks ? cfg.tasks.map((n) => apps.findIndex((a) => a.name === n)).filter((x) => x >= 0) : [];
      if (!tasks.length) {
        const pool = TM.ui.shuffle(apps.map((_, x) => x));
        tasks = pool.slice(0, cfg.rounds || 3);
      }
      let i = 0;

      stage.innerHTML = `
        <div class="desk desk-1">
          <div class="monitor">
            <div class="monitor-screen">
              <div class="monitor-work tb-work"><div class="tb-hint"></div></div>
              <div class="monitor-taskbar is-big">
                <span class="tb-start" aria-hidden="true">${TM.ui.WIN_LOGO}</span>
                ${apps
                  .map(
                    (a, x) => `<span class="tb-app" data-i="${x}" style="--app-color:${a.color}" title="${esc(a.name)}">
                      <span class="tb-app-letter">${esc(a.short)}</span><span class="tb-num" aria-hidden="true">${x + 1}</span></span>`
                  )
                  .join('')}
              </div>
            </div>
            <div class="monitor-label">Taskleiste: Start zählt nicht mit – das erste Programm ist die 1.</div>
          </div>
        </div>`;

      const work = stage.querySelector('.tb-work');
      const taskbar = stage.querySelector('.monitor-taskbar');

      function setRound() {
        const showNums = i < showNumbers;
        taskbar.classList.toggle('show-numbers', showNums);
        const t = tasks[i];
        api.step(i);
        api.targets(showNums ? `Win+${t + 1}` : 'Win');
        work.querySelector('.tb-hint').innerHTML = showNums
          ? 'Die kleinen Zahlen zeigen die Position.'
          : 'Jetzt ohne Zahlen – zähl selbst von links.';
      }

      function open(x) {
        const a = apps[x];
        work.querySelectorAll('.tb-window').forEach((w) => w.remove());
        const w = document.createElement('div');
        w.className = 'sim-window tb-window';
        w.style.setProperty('--app-color', a.color);
        w.innerHTML = `<div class="win-titlebar is-colored"><span class="win-title">${esc(a.name)}</span><span class="win-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
          <div class="tb-window-body"><span class="tb-app-letter big">${esc(a.short)}</span><span>${esc(a.name)} ist geöffnet</span></div>`;
        work.appendChild(w);
        stage.querySelectorAll('.monitor-taskbar .tb-app').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.i) === x));
      }

      const off = TM.keys.on((e) => {
        if (e.type !== 'combo' || i >= tasks.length) return;
        const m = TM.keys.canon(e.combo).match(/^Win\+(\d)$/);
        if (!m) {
          if (TM.keys.looksLikeAttempt(e)) api.wrong(e.combo, 'Win+1…9');
          return;
        }
        if (e.event) e.event.preventDefault();
        const x = Number(m[1]) - 1;
        if (x < 0 || x >= apps.length) {
          api.say(`Auf Platz ${m[1]} liegt kein Programm.`, 'warn');
          return;
        }
        open(x);
        if (x === tasks[i]) {
          api.say(`Richtig: ${TM.ui.rich(`{Win+${x + 1}}`)} öffnet ${esc(apps[x].name)}.`, 'ok');
          i++;
          if (i >= tasks.length) {
            api.targets([]);
            api.complete();
          } else setRound();
        } else {
          api.say(`Das war Platz ${x + 1}: ${esc(apps[x].name)}. Gesucht ist ${esc(apps[tasks[i]].name)} – zähl nochmal von links.`, 'warn');
          TM.ui.shake(taskbar);
        }
      });

      api.steps(tasks.map((t) => `Öffne <strong>${esc(apps[t].name)}</strong> mit {Win} + Zahl`));
      setRound();

      return { destroy: off };
    },
  });
})(window.TM);
