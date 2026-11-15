import { DAILY_ACTIVATION, NECK_EXERCISE, STRENGTH_ROUTINE, WEEK_GUIDES } from '../data/routineData';

export function buildStandaloneHtml(): string {
  const routineJson = JSON.stringify(STRENGTH_ROUTINE);
  const activationJson = JSON.stringify(DAILY_ACTIVATION);
  const neckJson = JSON.stringify(NECK_EXERCISE);
  const weeksJson = JSON.stringify(WEEK_GUIDES);

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ritmo Hogar — Rutina en Casa & Activación</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/lucide@latest"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'DM Sans', sans-serif; background-color: #09090b; color: #f4f4f5; }
    h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono-nums { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type="number"] { -moz-appearance: textfield; }
  </style>
</head>
<body class="bg-[#09090b] text-zinc-100 antialiased pb-24">
  <header class="border-b border-[#27272a] bg-[#09090b]">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-white">
          <i data-lucide="flame" class="w-5 h-5"></i>
        </div>
        <span class="font-bold text-base tracking-tight text-white">Ritmo Hogar</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="shiftDate(-1)" class="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#141417] border border-[#27272a] text-zinc-300 hover:text-white">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>
        <button onclick="resetToToday()" class="min-h-[40px] px-3 rounded-xl bg-[#141417] border border-[#27272a] text-xs font-semibold text-zinc-100 capitalize" id="date-btn">Hoy</button>
        <button onclick="shiftDate(1)" class="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#141417] border border-[#27272a] text-zinc-300 hover:text-white">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-6 space-y-5">
    <div id="day-strip" class="flex gap-2 overflow-x-auto no-scrollbar"></div>

    <section class="bg-[#141417] border border-[#27272a] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span id="day-focus" class="text-pink-400 font-semibold">Piernas y Glúteos</span>
          <span>·</span>
          <span id="neck-text">Cuello interdiario</span>
        </div>
        <h1 id="day-title" class="text-2xl font-bold text-white">Lunes</h1>
        <p id="day-note" class="text-sm text-zinc-400"></p>
      </div>
      <div class="flex flex-wrap items-center gap-1.5 bg-[#09090b] p-1.5 rounded-xl border border-[#27272a]" id="week-selector"></div>
    </section>

    <section class="grid grid-cols-2 gap-2 bg-[#141417] p-1.5 rounded-2xl border border-[#27272a]">
      <button id="btn-opt-1" onclick="switchMode('activation')" class="min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition">Opción 1: Activación y Postura</button>
      <button id="btn-opt-2" onclick="switchMode('workout')" class="min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition">Opción 2: Rutina de Fuerza (2 Series)</button>
    </section>

    <section id="content-area" class="space-y-4"></section>

    <div class="flex justify-center pt-2">
      <button onclick="clearCurrentDay()" class="text-xs text-zinc-500 hover:text-red-400 py-2 px-4 rounded-xl border border-transparent hover:border-[#27272a] transition">
        Limpiar registros de esta fecha
      </button>
    </div>
  </main>

  <footer class="fixed bottom-0 inset-x-0 z-30 bg-[#141417]/95 backdrop-blur-md border-t border-[#27272a]">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span id="timer-clock" class="mono-nums text-xl font-bold text-white">01:00</span>
        <span id="timer-label" class="text-xs text-zinc-400 hidden sm:inline">Listo</span>
      </div>
      <div class="flex items-center gap-1.5">
        <button onclick="setTimer(30, 'Descanso 30s')" class="min-h-[38px] px-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-zinc-300 hover:text-white">30s</button>
        <button onclick="setTimer(45, 'Descanso 45s')" class="min-h-[38px] px-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-zinc-300 hover:text-white">45s</button>
        <button onclick="setTimer(60, 'Descanso 60s')" class="min-h-[38px] px-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-zinc-300 hover:text-white">60s</button>
        <button onclick="setTimer(90, 'Descanso 90s')" class="min-h-[38px] px-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-zinc-300 hover:text-white">90s</button>
        <button id="timer-toggle" onclick="toggleTimer()" class="min-h-[38px] px-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold">Iniciar</button>
      </div>
    </div>
  </footer>

  <script>
    const STRENGTH_ROUTINE = ${routineJson};
    const DAILY_ACTIVATION = ${activationJson};
    const NECK_EXERCISE = ${neckJson};
    const WEEK_GUIDES = ${weeksJson};
    const EPOCH = Date.UTC(2026, 0, 1);
    const DAY_MS = 86400000;
    const STORE_KEY = 'ritmo_hogar_v1';

    let activeDate = new Date(); activeDate.setHours(0, 0, 0, 0);
    let activeMode = (activeDate.getDay() === 0) ? 'activation' : 'workout';
    let selectedWeek = Number(localStorage.getItem('ritmo_hogar_week') || 1);
    let store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    let timerSec = 60, timerRunning = false, timerId = null;

    function dateKey(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function dayLog() {
      const k = dateKey(activeDate);
      if (!store[k]) store[k] = { checks: {}, sets: {} };
      return store[k];
    }
    function save() { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
    function mondayIdx(d) { const g = d.getDay(); return g === 0 ? 6 : g - 1; }
    function isNeck(d) { return Math.abs(Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH) / DAY_MS)) % 2 === 0; }
    function shiftDate(n) { activeDate = new Date(activeDate.getTime() + n * DAY_MS); render(); }
    function resetToToday() { activeDate = new Date(); activeDate.setHours(0, 0, 0, 0); render(); }
    function selectWeek(w) { selectedWeek = w; localStorage.setItem('ritmo_hogar_week', String(w)); render(); }
    function switchMode(m) { activeMode = m; render(); }

    function toggleCheck(id) {
      const log = dayLog();
      log.checks[id] = !log.checks[id];
      if (!log.checks[id]) delete log.checks[id];
      save(); render();
    }
    function updateSet(exId, idx, field, val) {
      const log = dayLog();
      if (log.sets[exId] && log.sets[exId][idx]) { log.sets[exId][idx][field] = val; save(); }
    }
    function toggleSet(exId, idx, restSec) {
      const log = dayLog();
      if (!log.sets[exId]) return;
      const prev = log.sets[exId][idx].done;
      log.sets[exId][idx].done = !prev;
      save();
      if (!prev && !timerRunning) setTimer(restSec || 60, 'Descanso');
      render();
    }
    function addSet(exId) {
      const log = dayLog();
      log.sets[exId].push({ reps: '', weight: '', done: false });
      save(); render();
    }
    function removeSet(exId) {
      const log = dayLog();
      if (log.sets[exId].length > 2) { log.sets[exId].pop(); save(); render(); }
    }
    function clearCurrentDay() {
      delete store[dateKey(activeDate)]; save(); render();
    }

    function setTimer(sec, label) {
      clearInterval(timerId); timerRunning = false; timerSec = sec;
      document.getElementById('timer-label').textContent = label || 'Descanso';
      startTimer();
    }
    function startTimer() {
      if (timerSec <= 0) timerSec = 60;
      timerRunning = true;
      updateClock();
      timerId = setInterval(() => {
        timerSec--;
        if (timerSec <= 0) {
          timerSec = 0; clearInterval(timerId); timerRunning = false;
          document.getElementById('timer-label').textContent = '¡Listo!';
          beep();
        }
        updateClock();
      }, 1000);
    }
    function toggleTimer() {
      if (timerRunning) { clearInterval(timerId); timerRunning = false; updateClock(); }
      else startTimer();
    }
    function updateClock() {
      const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
      const s = String(timerSec % 60).padStart(2, '0');
      document.getElementById('timer-clock').textContent = m + ':' + s;
      document.getElementById('timer-toggle').textContent = timerRunning ? 'Pausar' : 'Iniciar';
    }
    function beep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = 880; g.gain.value = 0.15;
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.25);
      } catch (e) {}
    }

    function renderExerciseCard(ex) {
      const log = dayLog();
      if (!log.sets[ex.id]) log.sets[ex.id] = [{ reps: '', weight: '', done: false }, { reps: '', weight: '', done: false }];
      const arr = log.sets[ex.id];
      const weekObj = WEEK_GUIDES[selectedWeek - 1];
      const weightPlaceholder = ex.usesBackpack ? ('Mochila ' + weekObj.suggestedKg) : 'Peso / Kg';
      return '<article class="bg-[#141417] border border-[#27272a] rounded-2xl p-4 space-y-3">' +
        '<div class="flex items-start justify-between gap-2">' +
          '<div><h4 class="font-bold text-white text-sm sm:text-base">' + ex.name + '</h4>' +
          '<p class="text-xs text-pink-400 mt-0.5">' + ex.target + '</p></div>' +
          '<button onclick="setTimer(' + ex.defaultRestSec + ', \\'Descanso ' + ex.defaultRestSec + 's\\')" class="px-2.5 py-1 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-pink-400">' + ex.defaultRestSec + 's</button>' +
        '</div>' +
        '<p class="text-xs text-zinc-400">' + ex.tip + '</p>' +
        '<div class="space-y-2">' + arr.map((s, i) =>
          '<div class="flex items-center gap-2">' +
            '<span class="text-xs font-semibold text-zinc-400 w-14">Serie ' + (i + 1) + '</span>' +
            '<input type="number" placeholder="Reps" value="' + s.reps + '" onchange="updateSet(\\'' + ex.id + '\\',' + i + ',\\'reps\\',this.value)" class="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-2.5 py-2 text-xs text-center text-white" />' +
            '<input type="text" placeholder="' + weightPlaceholder + '" value="' + s.weight + '" onchange="updateSet(\\'' + ex.id + '\\',' + i + ',\\'weight\\',this.value)" class="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-2.5 py-2 text-xs text-center text-zinc-200" />' +
            '<button onclick="toggleSet(\\'' + ex.id + '\\',' + i + ',' + ex.defaultRestSec + ')" class="min-w-[40px] min-h-[40px] rounded-xl border text-xs font-bold ' + (s.done ? 'bg-red-600 border-red-500 text-white' : 'bg-[#09090b] border-[#27272a] text-zinc-500') + '">✓</button>' +
          '</div>'
        ).join('') + '</div>' +
        '<div class="flex justify-between text-xs pt-1">' +
          '<button onclick="addSet(\\'' + ex.id + '\\')" class="text-zinc-400 hover:text-pink-400">+ Añadir serie extra</button>' +
          (arr.length > 2 ? '<button onclick="removeSet(\\'' + ex.id + '\\')" class="text-zinc-500 hover:text-red-400">Quitar extra</button>' : '') +
        '</div>' +
      '</article>';
    }

    function render() {
      const dIdx = mondayIdx(activeDate);
      const dayObj = STRENGTH_ROUTINE[dIdx];
      const neckToday = isNeck(activeDate);
      const fmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
      document.getElementById('date-btn').textContent = fmt.format(activeDate);
      document.getElementById('day-title').textContent = dayObj.name + ' ' + activeDate.getDate();
      document.getElementById('day-focus').textContent = dayObj.focus;
      document.getElementById('day-note').textContent = dayObj.note;
      document.getElementById('neck-text').textContent = neckToday ? 'Hoy toca Carga de Cuello (2×15–20)' : 'Descanso de Cuello (interdiario)';

      document.getElementById('day-strip').innerHTML = STRENGTH_ROUTINE.map((d, i) => {
        const dt = new Date(activeDate.getTime() + (i - dIdx) * DAY_MS);
        const sel = i === dIdx;
        return '<button onclick="shiftDate(' + (i - dIdx) + ')" class="flex-1 min-w-[76px] py-2 px-2 rounded-xl border text-center transition ' +
          (sel ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-500 text-white' : 'bg-[#141417] border-[#27272a] text-zinc-400') + '">' +
          '<span class="block text-xs font-bold">' + d.short + '</span>' +
          '<span class="block text-[11px] opacity-80">' + dt.getDate() + (isNeck(dt) ? ' · Cuello' : '') + '</span></button>';
      }).join('');

      document.getElementById('week-selector').innerHTML = WEEK_GUIDES.map(w =>
        '<button onclick="selectWeek(' + w.week + ')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ' +
        (selectedWeek === w.week ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white') + '">Sem ' + w.week + '</button>'
      ).join('');

      const b1 = document.getElementById('btn-opt-1');
      const b2 = document.getElementById('btn-opt-2');
      b1.className = 'min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition ' + (activeMode === 'activation' ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white' : 'text-zinc-400 hover:text-white');
      b2.className = 'min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition ' + (activeMode === 'workout' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' : 'text-zinc-400 hover:text-white');

      const area = document.getElementById('content-area');
      const log = dayLog();
      if (activeMode === 'activation') {
        const vacDay = dIdx === 0 || dIdx === 2 || dIdx === 4;
        let html = '';
        if (vacDay) {
          const vc = !!log.checks['act-vacuum'];
          html += '<div onclick="toggleCheck(\\'act-vacuum\\')" class="cursor-pointer bg-[#141417] border ' + (vc ? 'border-red-500/50' : 'border-[#27272a]') + ' rounded-2xl p-4 flex items-center justify-between gap-3">' +
            '<div><span class="text-xs font-semibold text-red-400">En ayunas · Lun / Mié / Vie</span>' +
            '<h3 class="font-bold text-white text-sm sm:text-base">Stomach Vacuum (3–5 × 10–15 s)</h3></div>' +
            '<div class="flex items-center gap-2">' +
            '<button onclick="event.stopPropagation(); setTimer(15, \\'Vacuum 15s\\')" class="px-2.5 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-pink-400">15s</button>' +
            '<span class="w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ' + (vc ? 'bg-red-600 border-red-500 text-white' : 'border-[#27272a] text-transparent') + '">✓</span></div></div>';
        }
        if (neckToday) html += renderExerciseCard(NECK_EXERCISE);
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
          renderHabitGroup('Protocolo Facial · Mewing, Ojos y Sonrisa', DAILY_ACTIVATION.face, log) +
          renderHabitGroup('Postura, Espalda y Hombros', DAILY_ACTIVATION.posture, log) +
        '</div>';
        area.innerHTML = html;
      } else {
        if (dayObj.isRestDay) {
          area.innerHTML = '<div class="bg-[#141417] border border-[#27272a] rounded-2xl p-6 text-center space-y-3">' +
            '<h3 class="text-lg font-bold text-white">Domingo · Descanso Activo</h3>' +
            '<p class="text-sm text-zinc-400">Caminata suave de 20–30 minutos y hábitos de activación de la Opción 1.</p>' +
            '<button onclick="switchMode(\\'activation\\')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold">Ir a Activación y Postura</button></div>';
        } else {
          const w = WEEK_GUIDES[selectedWeek - 1];
          area.innerHTML = '<div class="bg-[#141417] border border-[#27272a] rounded-2xl p-4 text-xs sm:text-sm text-zinc-300">' +
            '<strong class="text-pink-400">' + w.label + ' (' + w.backpackLoad + '):</strong> ' + w.summary + '</div>' +
            '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' + dayObj.exercises.map(renderExerciseCard).join('') + '</div>';
        }
      }
      lucide.createIcons();
    }

    function renderHabitGroup(title, items, log) {
      return '<div class="bg-[#141417] border border-[#27272a] rounded-2xl p-4 space-y-2">' +
        '<h3 class="text-sm font-bold text-pink-400 pb-2 border-b border-[#27272a]">' + title + '</h3>' +
        items.map(it => {
          const ok = !!log.checks[it.id];
          return '<div onclick="toggleCheck(\\'' + it.id + '\\')" class="cursor-pointer flex items-center justify-between gap-3 py-2.5 border-b border-[#27272a]/60 last:border-b-0">' +
            '<div><p class="text-sm font-medium ' + (ok ? 'line-through text-zinc-500' : 'text-zinc-100') + '">' + it.name + '</p>' +
            '<p class="text-xs text-zinc-400">' + it.meta + '</p></div>' +
            '<div class="flex items-center gap-2 shrink-0">' +
            (it.timerSec ? '<button onclick="event.stopPropagation(); setTimer(' + it.timerSec + ', \\'' + it.name + '\\')" class="px-2 py-1 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-semibold text-pink-400">' + it.timerSec + 's</button>' : '') +
            '<span class="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ' + (ok ? 'bg-pink-600 border-pink-500 text-white' : 'border-[#27272a] text-transparent') + '">✓</span>' +
            '</div></div>';
        }).join('') + '</div>';
    }

    render();
    updateClock();
  <\/script>
</body>
</html>`;
}
