import { Check, Timer } from 'lucide-react';
import {
  DAILY_ACTIVATION,
  NECK_EXERCISE,
  type DayLog,
  type HabitItem,
  type SetLog,
} from '../data/routineData';
import { ExerciseCard } from './ExerciseCard';

interface ActivationPanelProps {
  isVacuumDay: boolean;
  isNeckDay: boolean;
  dayLog: DayLog;
  neckSets: SetLog[];
  suggestedKg: string;
  onToggleCheck: (habitId: string) => void;
  onUpdateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => void;
  onToggleSetDone: (exerciseId: string, setIndex: number, defaultRestSec: number) => void;
  onAddExtraSet: (exerciseId: string) => void;
  onRemoveExtraSet: (exerciseId: string) => void;
  onStartTimer: (seconds: number, label: string, autoStart?: boolean) => void;
}

export function ActivationPanel({
  isVacuumDay,
  isNeckDay,
  dayLog,
  neckSets,
  suggestedKg,
  onToggleCheck,
  onUpdateSet,
  onToggleSetDone,
  onAddExtraSet,
  onRemoveExtraSet,
  onStartTimer,
}: ActivationPanelProps) {
  const vacuumChecked = !!dayLog.checks['act-vacuum'];

  const renderHabitRow = (item: HabitItem) => {
    const isChecked = !!dayLog.checks[item.id];
    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={() => onToggleCheck(item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleCheck(item.id);
          }
        }}
        className="min-h-[60px] flex items-center justify-between gap-3 py-3 border-b border-[#27272a]/70 last:border-b-0 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg"
      >
        <div className="min-w-0">
          <p
            className={`text-sm font-medium leading-snug transition-colors ${
              isChecked ? 'line-through text-zinc-500' : 'text-zinc-100 group-hover:text-white'
            }`}
          >
            {item.name}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{item.meta}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.timerSec !== null && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartTimer(item.timerSec!, item.name, true);
              }}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] hover:border-pink-500/50 text-pink-400 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              title={`Temporizador de ${item.timerSec} segundos`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="font-mono-nums">{item.timerSec}s</span>
            </button>
          )}

          <span
            aria-hidden="true"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              isChecked
                ? 'bg-gradient-to-br from-pink-600 to-red-600 border-pink-500 text-white'
                : 'bg-[#09090b] border-[#27272a] group-hover:border-zinc-600 text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className={`bg-[#141417] border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
            isVacuumDay && vacuumChecked ? 'border-red-500/50' : 'border-[#27272a]'
          }`}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className={isVacuumDay ? 'text-red-400 font-semibold' : 'text-zinc-400'}>
                {isVacuumDay ? 'Toca hoy en ayunas' : 'Descanso de Vacuum hoy'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Lunes, Miércoles y Viernes</span>
            </div>
            <h3
              className={`text-base font-bold leading-snug ${
                isVacuumDay && vacuumChecked ? 'line-through text-zinc-500' : 'text-white'
              }`}
            >
              Stomach Vacuum en ayunas
            </h3>
            <p className="text-xs text-zinc-400">
              3–5 series × 10–15 s de sostén manteniendo columna neutra y exhalación completa.
            </p>
          </div>

          {isVacuumDay ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onStartTimer(15, 'Stomach Vacuum 15s', true)}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] hover:border-red-500/50 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Timer className="w-3.5 h-3.5" />
                <span className="font-mono-nums">15s</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleCheck('act-vacuum')}
                aria-pressed={vacuumChecked}
                aria-label="Completar Stomach Vacuum"
                className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border transition-colors ${
                  vacuumChecked
                    ? 'bg-gradient-to-br from-red-600 to-pink-600 border-red-500 text-white'
                    : 'bg-[#09090b] border-[#27272a] hover:border-red-500/60 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium text-zinc-500 shrink-0">Opcional</span>
          )}
        </div>

        <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className={isNeckDay ? 'text-pink-400 font-semibold' : 'text-zinc-400'}>
                {isNeckDay ? 'Día activo (calendario real)' : 'Día de descanso cervical'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Protocolo interdiario</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {isNeckDay ? 'Hoy toca Carga de Cuello' : 'Hoy descansa el Cuello'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isNeckDay
                ? 'Completa tus 2 series anteriores y posteriores justo debajo.'
                : 'Alternancia automática día sí / día no según la fecha del calendario. Toca mañana.'}
            </p>
          </div>
        </div>
      </div>

      {isNeckDay && (
        <ExerciseCard
          exercise={NECK_EXERCISE}
          sets={neckSets}
          suggestedKg={suggestedKg}
          onUpdateSet={onUpdateSet}
          onToggleSetDone={onToggleSetDone}
          onAddExtraSet={onAddExtraSet}
          onRemoveExtraSet={onRemoveExtraSet}
          onStartTimer={onStartTimer}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div>
              <h3 className="text-base font-bold text-white">Protocolo Facial</h3>
              <p className="text-xs text-zinc-400">Mewing, ojos, sonrisa y tono diario</p>
            </div>
            <span className="text-xs font-mono-nums text-pink-400 font-medium">
              {DAILY_ACTIVATION.face.filter((i) => dayLog.checks[i.id]).length}/{DAILY_ACTIVATION.face.length}
            </span>
          </div>
          <div>{DAILY_ACTIVATION.face.map(renderHabitRow)}</div>
        </section>

        <section className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div>
              <h3 className="text-base font-bold text-white">Postura, Espalda y Hombros</h3>
              <p className="text-xs text-zinc-400">Alineación cervical y movilidad torácica</p>
            </div>
            <span className="text-xs font-mono-nums text-pink-400 font-medium">
              {DAILY_ACTIVATION.posture.filter((i) => dayLog.checks[i.id]).length}/{DAILY_ACTIVATION.posture.length}
            </span>
          </div>
          <div>{DAILY_ACTIVATION.posture.map(renderHabitRow)}</div>
        </section>
      </div>
    </div>
  );
}
