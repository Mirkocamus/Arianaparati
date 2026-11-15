import { ArrowRight, Footprints } from 'lucide-react';
import type { DayRoutine, SetLog, WeekGuide } from '../data/routineData';
import { ExerciseCard } from './ExerciseCard';

interface StrengthPanelProps {
  dayRoutine: DayRoutine;
  weekGuide: WeekGuide;
  getExerciseSets: (exerciseId: string) => SetLog[];
  onUpdateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => void;
  onToggleSetDone: (exerciseId: string, setIndex: number, defaultRestSec: number) => void;
  onAddExtraSet: (exerciseId: string) => void;
  onRemoveExtraSet: (exerciseId: string) => void;
  onStartTimer: (seconds: number, label: string, autoStart?: boolean) => void;
  onSwitchToActivation: () => void;
}

export function StrengthPanel({
  dayRoutine,
  weekGuide,
  getExerciseSets,
  onUpdateSet,
  onToggleSetDone,
  onAddExtraSet,
  onRemoveExtraSet,
  onStartTimer,
  onSwitchToActivation,
}: StrengthPanelProps) {
  if (dayRoutine.isRestDay) {
    return (
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#09090b] border border-[#27272a] text-pink-400 flex items-center justify-center mx-auto">
          <Footprints className="w-5 h-5" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-lg font-bold text-white">Domingo · Descanso Activo</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Sin cargas con mochila hoy. Prioriza una caminata tranquila de 20–30 minutos y completa tus hábitos de postura y activación facial.
          </p>
        </div>
        <div className="pt-1 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onSwitchToActivation}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-opacity whitespace-nowrap shrink-0"
          >
            <span>Ir a Activación y Postura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onStartTimer(1200, 'Caminata 20 min', true)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] text-zinc-200 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            Temporizador 20 min
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <span className="font-bold text-pink-400">{weekGuide.label}</span>
          <span className="mx-2 text-zinc-600" aria-hidden="true">·</span>
          <span className="text-white font-medium">{weekGuide.backpackLoad}</span>
          <span className="mx-2 text-zinc-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="block sm:inline text-zinc-400 mt-0.5 sm:mt-0">{weekGuide.summary}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dayRoutine.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            sets={getExerciseSets(exercise.id)}
            suggestedKg={weekGuide.suggestedKg}
            onUpdateSet={onUpdateSet}
            onToggleSetDone={onToggleSetDone}
            onAddExtraSet={onAddExtraSet}
            onRemoveExtraSet={onRemoveExtraSet}
            onStartTimer={onStartTimer}
          />
        ))}
      </div>
    </div>
  );
}
