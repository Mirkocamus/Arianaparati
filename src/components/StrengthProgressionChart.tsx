import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  calculateCurrentWeekDailyData,
  calculateWeeklyProgressionData,
  type LogsStore,
} from '../data/routineData';

interface StrengthProgressionChartProps {
  logsStore: LogsStore;
  activeDate: Date;
  selectedWeek: 1 | 2 | 3 | 4;
  onJumpToWorkout?: () => void;
  isWorkoutTab?: boolean;
}

type ChartView = 'weeks' | 'days';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name?: string;
      fullDay?: string;
      totalKg: number;
      completedSets: number;
      totalReps: number;
      targetLoad?: string;
    };
  }>;
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  const title = item.fullDay ?? item.name ?? '';

  return (
    <div className="bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2.5 shadow-xl text-xs space-y-1">
      <p className="font-bold text-white">{title}</p>
      <div className="flex items-center justify-between gap-4 text-zinc-300">
        <span>Peso levantado</span>
        <span className="font-mono-nums font-bold text-pink-400">
          {item.totalKg.toLocaleString('es-ES')} kg
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 text-zinc-400">
        <span>Series completadas</span>
        <span className="font-mono-nums text-zinc-200">{item.completedSets}</span>
      </div>
      <div className="flex items-center justify-between gap-4 text-zinc-400">
        <span>Repeticiones</span>
        <span className="font-mono-nums text-zinc-200">{item.totalReps}</span>
      </div>
      {item.targetLoad && (
        <div className="flex items-center justify-between gap-4 text-zinc-500 pt-1 border-t border-[#27272a]">
          <span>Mochila objetivo</span>
          <span className="font-mono-nums text-zinc-300">{item.targetLoad}</span>
        </div>
      )}
    </div>
  );
}

export function StrengthProgressionChart({
  logsStore,
  activeDate,
  selectedWeek,
  onJumpToWorkout,
  isWorkoutTab = true,
}: StrengthProgressionChartProps) {
  const [view, setView] = useState<ChartView>('weeks');

  const weeklyData = useMemo(
    () => calculateWeeklyProgressionData(logsStore, selectedWeek),
    [logsStore, selectedWeek]
  );

  const dailyData = useMemo(
    () => calculateCurrentWeekDailyData(logsStore, activeDate),
    [logsStore, activeDate]
  );

  const totalCycleKg = useMemo(
    () => Math.round(weeklyData.reduce((acc, w) => acc + w.totalKg, 0) * 10) / 10,
    [weeklyData]
  );

  const totalCycleSets = useMemo(
    () => weeklyData.reduce((acc, w) => acc + w.completedSets, 0),
    [weeklyData]
  );

  const peakWeek = useMemo(() => {
    return weeklyData.reduce((best, curr) => (curr.totalKg > best.totalKg ? curr : best), weeklyData[0]);
  }, [weeklyData]);

  const activeWeekKg = useMemo(
    () => Math.round(dailyData.reduce((acc, d) => acc + d.totalKg, 0) * 10) / 10,
    [dailyData]
  );

  const hasAnyData = view === 'weeks' ? totalCycleKg > 0 || totalCycleSets > 0 : activeWeekKg > 0;

  return (
    <section
      aria-label="Progresión de fuerza semanal"
      className="bg-[#141417] border border-[#27272a] rounded-2xl p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272a]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400 shrink-0" />
            <h3 className="text-base font-bold text-white">
              Evolución de Peso Total Levantado
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Volumen acumulado (repeticiones × kilos) en tus series completadas
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-[#27272a] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setView('weeks')}
            className={`min-h-[36px] px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              view === 'weeks'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Semanas 1–4
          </button>
          <button
            type="button"
            onClick={() => setView('days')}
            className={`min-h-[36px] px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              view === 'days'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Días de esta semana
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-left">
        <div>
          <span className="block text-xs text-zinc-400">
            {view === 'weeks' ? 'Total 4 semanas' : 'Total esta semana'}
          </span>
          <span className="font-mono-nums text-lg sm:text-xl font-bold text-white">
            {(view === 'weeks' ? totalCycleKg : activeWeekKg).toLocaleString('es-ES')} kg
          </span>
        </div>

        <div>
          <span className="block text-xs text-zinc-400">Series completadas</span>
          <span className="font-mono-nums text-lg sm:text-xl font-bold text-pink-400">
            {view === 'weeks'
              ? totalCycleSets
              : dailyData.reduce((acc, d) => acc + d.completedSets, 0)}
          </span>
        </div>

        <div>
          <span className="block text-xs text-zinc-400">Mejor semana</span>
          <span className="font-mono-nums text-lg sm:text-xl font-bold text-white">
            {peakWeek && peakWeek.totalKg > 0 ? peakWeek.name : '—'}
          </span>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="h-52 rounded-xl bg-[#09090b] border border-[#27272a] flex flex-col items-center justify-center text-center px-4 gap-3">
          <p className="text-sm font-medium text-zinc-300 max-w-md">
            Aún no hay peso registrado {view === 'weeks' ? 'en tus semanas' : 'en esta semana'}.
          </p>
          <p className="text-xs text-zinc-500 max-w-md">
            Escribe repeticiones y kilos (por ejemplo <span className="text-zinc-300 font-mono-nums">6 kg</span>) en tus series y pulsa el botón ✓ para graficar tu fuerza.
          </p>
          {!isWorkoutTab && onJumpToWorkout && (
            <button
              type="button"
              onClick={onJumpToWorkout}
              className="min-h-[38px] px-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold transition-opacity hover:opacity-95"
            >
              Registrar en Rutina de Fuerza
            </button>
          )}
        </div>
      ) : (
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'weeks' ? (
              <AreaChart data={weeklyData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="strengthVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  axisLine={{ stroke: '#27272a' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val: number) => `${val} kg`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#ec4899', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="totalKg"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  fill="url(#strengthVolumeGradient)"
                  activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="dailyBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  axisLine={{ stroke: '#27272a' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val: number) => `${val} kg`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar
                  dataKey="totalKg"
                  fill="url(#dailyBarGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
