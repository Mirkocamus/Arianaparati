import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Dumbbell, Sparkles } from 'lucide-react';
import { ActivationPanel } from './components/ActivationPanel';
import { RestTimerBar } from './components/RestTimerBar';
import { StrengthPanel } from './components/StrengthPanel';
import {
  DAILY_ACTIVATION,
  MS_PER_DAY,
  NECK_EXERCISE,
  STRENGTH_ROUTINE,
  WEEK_GUIDES,
  getDateKey,
  getMondayBasedDayIndex,
  getNormalizedDate,
  isNeckDay,
  isSameCalendarDay,
  isVacuumDay,
  type DayLog,
  type LogsStore,
  type SetLog,
} from './data/routineData';
import { buildStandaloneHtml } from './utils/exportStandaloneHtml';

const STORAGE_KEY = 'ritmo_hogar_logs_v1';
const WEEK_STORAGE_KEY = 'ritmo_hogar_week_v1';

type AppMode = 'activation' | 'workout';

function loadInitialLogs(): LogsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LogsStore) : {};
  } catch {
    return {};
  }
}

function loadInitialWeek(): 1 | 2 | 3 | 4 {
  try {
    const raw = Number(localStorage.getItem(WEEK_STORAGE_KEY));
    if (raw === 1 || raw === 2 || raw === 3 || raw === 4) return raw;
  } catch {
    // Fallback to week 1
  }
  return 1;
}

function defaultTwoSets(): SetLog[] {
  return [
    { reps: '', weight: '', done: false },
    { reps: '', weight: '', done: false },
  ];
}

function playFinishChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [0, 0.22].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.18);
    });
  } catch {
    // Ignore audio context restrictions
  }
}

export default function App() {
  const [activeDate, setActiveDate] = useState<Date>(() => getNormalizedDate());
  const [activeMode, setActiveMode] = useState<AppMode>(() =>
    getMondayBasedDayIndex(getNormalizedDate()) === 6 ? 'activation' : 'workout'
  );
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(loadInitialWeek);
  const [logsStore, setLogsStore] = useState<LogsStore>(loadInitialLogs);
  const [confirmClear, setConfirmClear] = useState(false);

  // Rest timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [lastPresetSeconds, setLastPresetSeconds] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('Listo');
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logsStore));
    } catch {
      // Ignore storage quota errors
    }
  }, [logsStore]);

  useEffect(() => {
    try {
      localStorage.setItem(WEEK_STORAGE_KEY, String(selectedWeek));
    } catch {
      // Ignore storage errors
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (!timerRunning) {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setTimerLabel('¡Listo!');
          playFinishChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerRunning]);

  const handleStartTimer = useCallback((seconds: number, label: string, autoStart = true) => {
    setTimerRunning(false);
    setTimerSeconds(seconds);
    setLastPresetSeconds(seconds);
    setTimerLabel(label);
    if (autoStart) {
      window.setTimeout(() => setTimerRunning(true), 0);
    }
  }, []);

  const handleToggleTimerRun = useCallback(() => {
    if (timerRunning) {
      setTimerRunning(false);
      setTimerLabel('Pausado');
    } else {
      setTimerSeconds((prev) => (prev <= 0 ? lastPresetSeconds : prev));
      setTimerLabel('En curso');
      setTimerRunning(true);
    }
  }, [timerRunning, lastPresetSeconds]);

  const handleResetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(lastPresetSeconds);
    setTimerLabel('Listo');
  }, [lastPresetSeconds]);

  const today = useMemo(() => getNormalizedDate(), []);
  const isToday = isSameCalendarDay(activeDate, today);
  const dateKey = getDateKey(activeDate);
  const dayIdx = getMondayBasedDayIndex(activeDate);
  const currentDayRoutine = STRENGTH_ROUTINE[dayIdx];
  const neckToday = isNeckDay(activeDate);
  const vacuumToday = isVacuumDay(activeDate);
  const currentWeekGuide = WEEK_GUIDES[selectedWeek - 1];

  const currentDayLog: DayLog = logsStore[dateKey] ?? { checks: {}, sets: {} };

  const getExerciseSets = useCallback(
    (exerciseId: string): SetLog[] => {
      return currentDayLog.sets[exerciseId] ?? defaultTwoSets();
    },
    [currentDayLog.sets]
  );

  const shiftDate = (offsetDays: number) => {
    setConfirmClear(false);
    setActiveDate((prev) => new Date(prev.getTime() + offsetDays * MS_PER_DAY));
  };

  const resetToToday = () => {
    setConfirmClear(false);
    setActiveDate(getNormalizedDate());
  };

  const handleToggleCheck = (habitId: string) => {
    setLogsStore((prev) => {
      const existing = prev[dateKey] ?? { checks: {}, sets: {} };
      const nextChecks = { ...existing.checks };
      if (nextChecks[habitId]) {
        delete nextChecks[habitId];
      } else {
        nextChecks[habitId] = true;
      }
      return {
        ...prev,
        [dateKey]: { ...existing, checks: nextChecks },
      };
    });
  };

  const handleUpdateSet = (
    exerciseId: string,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    setLogsStore((prev) => {
      const existing = prev[dateKey] ?? { checks: {}, sets: {} };
      const currentSets = [...(existing.sets[exerciseId] ?? defaultTwoSets())];
      if (!currentSets[setIndex]) return prev;
      currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };
      return {
        ...prev,
        [dateKey]: {
          ...existing,
          sets: { ...existing.sets, [exerciseId]: currentSets },
        },
      };
    });
  };

  const handleToggleSetDone = (
    exerciseId: string,
    setIndex: number,
    defaultRestSec: number
  ) => {
    let becameDone = false;
    setLogsStore((prev) => {
      const existing = prev[dateKey] ?? { checks: {}, sets: {} };
      const currentSets = [...(existing.sets[exerciseId] ?? defaultTwoSets())];
      if (!currentSets[setIndex]) return prev;
      const nextDone = !currentSets[setIndex].done;
      becameDone = nextDone;
      currentSets[setIndex] = { ...currentSets[setIndex], done: nextDone };
      return {
        ...prev,
        [dateKey]: {
          ...existing,
          sets: { ...existing.sets, [exerciseId]: currentSets },
        },
      };
    });

    if (becameDone && !timerRunning) {
      handleStartTimer(defaultRestSec, `Descanso ${defaultRestSec}s`, false);
    }
  };

  const handleAddExtraSet = (exerciseId: string) => {
    setLogsStore((prev) => {
      const existing = prev[dateKey] ?? { checks: {}, sets: {} };
      const currentSets = [...(existing.sets[exerciseId] ?? defaultTwoSets())];
      currentSets.push({ reps: '', weight: '', done: false });
      return {
        ...prev,
        [dateKey]: {
          ...existing,
          sets: { ...existing.sets, [exerciseId]: currentSets },
        },
      };
    });
  };

  const handleRemoveExtraSet = (exerciseId: string) => {
    setLogsStore((prev) => {
      const existing = prev[dateKey] ?? { checks: {}, sets: {} };
      const currentSets = [...(existing.sets[exerciseId] ?? defaultTwoSets())];
      if (currentSets.length <= 2) return prev;
      currentSets.pop();
      return {
        ...prev,
        [dateKey]: {
          ...existing,
          sets: { ...existing.sets, [exerciseId]: currentSets },
        },
      };
    });
  };

  const handleClearDay = () => {
    setLogsStore((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
    setConfirmClear(false);
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = buildStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rutina-en-casa-roja-fucsia.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formattedHeaderDate = useMemo(() => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(activeDate);
  }, [activeDate]);

  // Daily completion metrics
  const totalHabitsCount =
    DAILY_ACTIVATION.face.length + DAILY_ACTIVATION.posture.length + (vacuumToday ? 1 : 0);
  const completedHabitsCount =
    DAILY_ACTIVATION.face.filter((h) => currentDayLog.checks[h.id]).length +
    DAILY_ACTIVATION.posture.filter((h) => currentDayLog.checks[h.id]).length +
    (vacuumToday && currentDayLog.checks['act-vacuum'] ? 1 : 0);

  const strengthSetsTotal = currentDayRoutine.exercises.reduce(
    (sum, ex) => sum + getExerciseSets(ex.id).length,
    0
  );
  const strengthSetsDone = currentDayRoutine.exercises.reduce(
    (sum, ex) => sum + getExerciseSets(ex.id).filter((s) => s.done).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-24">
      <header className="border-b border-[#27272a] bg-[#09090b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              resetToToday();
            }}
            className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Ritmo Hogar
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => setActiveMode('activation')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeMode === 'activation' ? 'text-pink-400' : ''
              }`}
            >
              Activación y Postura
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('workout')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeMode === 'workout' ? 'text-red-400' : ''
              }`}
            >
              Rutina de Fuerza
            </button>
            <button
              type="button"
              onClick={resetToToday}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Fecha de hoy
            </button>
          </nav>

          <button
            type="button"
            onClick={handleDownloadStandaloneHtml}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#141417] hover:bg-zinc-900 border border-[#27272a] hover:border-pink-500/50 text-xs font-semibold text-zinc-200 inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            title="Descargar versión en un solo archivo HTML"
          >
            <Download className="w-3.5 h-3.5 text-pink-400" />
            <span>Exportar HTML</span>
          </button>
        </div>
      </header>

      <main id="top" className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              aria-label="Día anterior"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-[#141417] hover:bg-zinc-900 border border-[#27272a] text-zinc-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={resetToToday}
              className="min-h-[44px] px-4 rounded-xl bg-[#141417] hover:bg-zinc-900 border border-[#27272a] inline-flex items-center gap-2.5 text-left transition-colors"
            >
              <Calendar className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="text-sm font-semibold capitalize text-white whitespace-nowrap">
                {formattedHeaderDate}
              </span>
              <span className="text-xs text-zinc-400 whitespace-nowrap">
                {isToday ? '· Hoy' : '· Volver a hoy'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => shiftDate(1)}
              aria-label="Día siguiente"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-[#141417] hover:bg-zinc-900 border border-[#27272a] text-zinc-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141417] p-1.5 rounded-xl border border-[#27272a] self-start sm:self-auto">
            <span className="text-xs text-zinc-400 px-2 hidden sm:inline whitespace-nowrap">
              Progresión:
            </span>
            {WEEK_GUIDES.map((wg) => {
              const active = selectedWeek === wg.week;
              return (
                <button
                  key={wg.week}
                  type="button"
                  onClick={() => setSelectedWeek(wg.week)}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sem {wg.week}
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Días de la semana"
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {STRENGTH_ROUTINE.map((dayObj, idx) => {
            const btnDate = new Date(activeDate.getTime() + (idx - dayIdx) * MS_PER_DAY);
            const neckOnDate = isNeckDay(btnDate);
            const selected = idx === dayIdx;

            return (
              <button
                key={dayObj.dayIndex}
                type="button"
                onClick={() => shiftDate(idx - dayIdx)}
                className={`flex-1 min-w-[78px] min-h-[58px] py-2 px-2.5 rounded-xl border text-center transition-colors shrink-0 ${
                  selected
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-500 text-white'
                    : 'bg-[#141417] border-[#27272a] text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="block text-xs font-bold">{dayObj.short}</span>
                <span
                  className={`block text-[11px] font-mono-nums mt-0.5 whitespace-nowrap ${
                    selected ? 'text-pink-100' : 'text-zinc-500'
                  }`}
                >
                  {btnDate.getDate()}
                  {neckOnDate ? ' · Cuello' : ''}
                </span>
              </button>
            );
          })}
        </section>

        <section className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
              <span className="text-pink-400 font-semibold">{currentDayRoutine.focus}</span>
              <span aria-hidden="true">·</span>
              <span className={neckToday ? 'text-red-400 font-medium' : 'text-zinc-400'}>
                {neckToday ? 'Hoy toca Carga de Cuello (2×15–20)' : 'Descanso de Cuello (interdiario)'}
              </span>
              {vacuumToday && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-300">Stomach Vacuum</span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {currentDayRoutine.name} {activeDate.getDate()}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400">{currentDayRoutine.note}</p>
          </div>

          <div className="flex items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#27272a] shrink-0">
            <div>
              <span className="block text-xs text-zinc-400">Activación</span>
              <span className="font-mono-nums text-lg font-bold text-white">
                {completedHabitsCount}/{totalHabitsCount}
              </span>
            </div>
            <div className="h-8 w-px bg-[#27272a]" aria-hidden="true" />
            <div>
              <span className="block text-xs text-zinc-400">Fuerza (series)</span>
              <span className="font-mono-nums text-lg font-bold text-white">
                {currentDayRoutine.isRestDay ? 'Descanso' : `${strengthSetsDone}/${strengthSetsTotal}`}
              </span>
            </div>
          </div>
        </section>

        <section
          aria-label="Selector de modo diario"
          className="grid grid-cols-2 gap-2 bg-[#141417] p-1.5 rounded-2xl border border-[#27272a]"
        >
          <button
            type="button"
            onClick={() => setActiveMode('activation')}
            className={`min-h-[46px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeMode === 'activation'
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">Opción 1: Activación y Postura</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('workout')}
            className={`min-h-[46px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeMode === 'workout'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 shrink-0" />
            <span className="truncate">Opción 2: Rutina de Fuerza</span>
          </button>
        </section>

        {activeMode === 'activation' ? (
          <ActivationPanel
            isVacuumDay={vacuumToday}
            isNeckDay={neckToday}
            dayLog={currentDayLog}
            neckSets={getExerciseSets(NECK_EXERCISE.id)}
            suggestedKg={currentWeekGuide.suggestedKg}
            onToggleCheck={handleToggleCheck}
            onUpdateSet={handleUpdateSet}
            onToggleSetDone={handleToggleSetDone}
            onAddExtraSet={handleAddExtraSet}
            onRemoveExtraSet={handleRemoveExtraSet}
            onStartTimer={handleStartTimer}
          />
        ) : (
          <StrengthPanel
            dayRoutine={currentDayRoutine}
            weekGuide={currentWeekGuide}
            getExerciseSets={getExerciseSets}
            onUpdateSet={handleUpdateSet}
            onToggleSetDone={handleToggleSetDone}
            onAddExtraSet={handleAddExtraSet}
            onRemoveExtraSet={handleRemoveExtraSet}
            onStartTimer={handleStartTimer}
            onSwitchToActivation={() => setActiveMode('activation')}
          />
        )}

        <div className="flex items-center justify-center pt-2 pb-4">
          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-red-400 border border-transparent hover:border-[#27272a] transition-colors"
            >
              Limpiar registros de esta fecha
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">¿Borrar progreso de este día?</span>
              <button
                type="button"
                onClick={handleClearDay}
                className="min-h-[36px] px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-[36px] px-3 rounded-lg bg-[#141417] border border-[#27272a] text-zinc-300 text-xs font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </main>

      <RestTimerBar
        secondsLeft={timerSeconds}
        isRunning={timerRunning}
        label={timerLabel}
        onSelectPreset={handleStartTimer}
        onToggleRun={handleToggleTimerRun}
        onReset={handleResetTimer}
      />
    </div>
  );
}
