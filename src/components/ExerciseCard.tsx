import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Plus, Timer, Trash2 } from 'lucide-react';
import type { ExerciseDefinition, SetLog } from '../data/routineData';

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  sets: SetLog[];
  suggestedKg: string;
  onUpdateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => void;
  onToggleSetDone: (exerciseId: string, setIndex: number, defaultRestSec: number) => void;
  onAddExtraSet: (exerciseId: string) => void;
  onRemoveExtraSet: (exerciseId: string) => void;
  onStartTimer: (seconds: number, label: string, autoStart?: boolean) => void;
}

export function ExerciseCard({
  exercise,
  sets,
  suggestedKg,
  onUpdateSet,
  onToggleSetDone,
  onAddExtraSet,
  onRemoveExtraSet,
  onStartTimer,
}: ExerciseCardProps) {
  const [showTip, setShowTip] = useState(false);

  const completedCount = sets.filter((s) => s.done).length;
  const allDone = sets.length > 0 && completedCount === sets.length;
  const weightPlaceholder = exercise.usesBackpack ? `Mochila ${suggestedKg}` : 'Peso / Kg';

  return (
    <article
      className={`bg-[#141417] border rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-colors duration-200 ${
        allDone ? 'border-red-500/50' : 'border-[#27272a]'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4
              className={`text-base font-bold leading-snug tracking-tight ${
                allDone ? 'text-red-400' : 'text-white'
              }`}
            >
              {exercise.name}
            </h4>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-400">
              <span className="text-pink-400 font-medium">{exercise.target}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums text-zinc-400">
                {completedCount}/{sets.length} series
              </span>
              {exercise.usesBackpack && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-300">Sugerido: {suggestedKg}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onStartTimer(exercise.defaultRestSec, `Descanso ${exercise.defaultRestSec}s`, true)}
              className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] hover:border-pink-500/50 text-pink-400 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              title={`Iniciar descanso de ${exercise.defaultRestSec} segundos`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="font-mono-nums">{exercise.defaultRestSec}s</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTip((prev) => !prev)}
              aria-expanded={showTip}
              className="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <span>Técnica</span>
              {showTip ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showTip && (
          <p className="pt-2.5 border-t border-[#27272a] text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {exercise.tip}
          </p>
        )}

        <div className="pt-2 border-t border-[#27272a] space-y-2.5">
          {sets.map((setObj, sIdx) => (
            <div key={`${exercise.id}-set-${sIdx}`} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 w-14 shrink-0 font-mono-nums">
                Serie {sIdx + 1}
              </span>

              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  aria-label={`Repeticiones serie ${sIdx + 1} de ${exercise.name}`}
                  placeholder="Reps"
                  value={setObj.reps}
                  onChange={(e) => onUpdateSet(exercise.id, sIdx, 'reps', e.target.value)}
                  className="w-full min-h-[42px] bg-[#09090b] border border-[#27272a] focus:border-pink-500 rounded-xl px-3 py-1.5 text-sm font-medium font-mono-nums text-white placeholder-zinc-600 outline-none text-center transition-colors"
                />
                <input
                  type="text"
                  aria-label={`Peso o mochila serie ${sIdx + 1} de ${exercise.name}`}
                  placeholder={weightPlaceholder}
                  value={setObj.weight}
                  onChange={(e) => onUpdateSet(exercise.id, sIdx, 'weight', e.target.value)}
                  className="w-full min-h-[42px] bg-[#09090b] border border-[#27272a] focus:border-pink-500 rounded-xl px-3 py-1.5 text-sm font-medium text-zinc-200 placeholder-zinc-600 outline-none text-center transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => onToggleSetDone(exercise.id, sIdx, exercise.defaultRestSec)}
                aria-pressed={setObj.done}
                aria-label={`Marcar serie ${sIdx + 1} completada`}
                className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  setObj.done
                    ? 'bg-gradient-to-br from-red-600 to-pink-600 border-red-500 text-white'
                    : 'bg-[#09090b] border-[#27272a] hover:border-pink-500/60 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/70">
        <button
          type="button"
          onClick={() => onAddExtraSet(exercise.id)}
          className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-pink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg px-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir serie extra</span>
        </button>

        {sets.length > 2 && (
          <button
            type="button"
            onClick={() => onRemoveExtraSet(exercise.id)}
            className="min-h-[36px] inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg px-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Quitar extra</span>
          </button>
        )}
      </div>
    </article>
  );
}
