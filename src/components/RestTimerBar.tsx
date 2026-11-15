import { Pause, Play, RotateCcw, Timer } from 'lucide-react';

interface RestTimerBarProps {
  secondsLeft: number;
  isRunning: boolean;
  label: string;
  onSelectPreset: (seconds: number, label: string, autoStart?: boolean) => void;
  onToggleRun: () => void;
  onReset: () => void;
}

const PRESETS = [
  { sec: 30, text: '30s', label: 'Descanso 30s' },
  { sec: 45, text: '45s', label: 'Descanso 45s' },
  { sec: 60, text: '60s', label: 'Descanso 60s' },
  { sec: 90, text: '90s', label: 'Descanso 90s' },
];

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function RestTimerBar({
  secondsLeft,
  isRunning,
  label,
  onSelectPreset,
  onToggleRun,
  onReset,
}: RestTimerBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-[#141417]/95 backdrop-blur-md border-t border-[#27272a]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl bg-[#09090b] border flex items-center justify-center shrink-0 transition-colors ${
              isRunning ? 'border-red-500 text-red-400' : 'border-[#27272a] text-pink-400'
            }`}
          >
            <Timer className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span
                className={`font-mono-nums text-lg sm:text-xl font-bold tracking-tight ${
                  secondsLeft === 0 ? 'text-pink-400' : 'text-white'
                }`}
              >
                {formatClock(secondsLeft)}
              </span>
              <span className="text-xs text-zinc-400 truncate hidden sm:inline max-w-[160px]">
                {label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.sec}
              type="button"
              onClick={() => onSelectPreset(preset.sec, preset.label, true)}
              className={`min-h-[40px] px-2 sm:px-2.5 rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] hover:border-pink-500/50 text-xs font-semibold font-mono-nums transition-colors whitespace-nowrap shrink-0 ${
                preset.sec === 90 ? 'hidden xs:inline-flex sm:inline-flex items-center' : 'inline-flex items-center'
              } text-zinc-300 hover:text-white`}
            >
              {preset.text}
            </button>
          ))}

          <button
            type="button"
            onClick={onReset}
            aria-label="Reiniciar temporizador"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-[#09090b] hover:bg-zinc-900 border border-[#27272a] text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleRun}
            className="min-h-[40px] px-3 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-opacity whitespace-nowrap shrink-0"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
