export interface ExerciseDefinition {
  id: string;
  name: string;
  target: string;
  defaultRestSec: number;
  usesBackpack: boolean;
  tip: string;
}

export interface DayRoutine {
  dayIndex: number; // 0 = Lunes ... 6 = Domingo
  name: string;
  short: string;
  focus: string;
  note: string;
  isRestDay?: boolean;
  exercises: ExerciseDefinition[];
}

export interface HabitItem {
  id: string;
  name: string;
  meta: string;
  timerSec: number | null;
}

export interface WeekGuide {
  week: 1 | 2 | 3 | 4;
  label: string;
  backpackLoad: string;
  suggestedKg: string;
  summary: string;
}

export interface SetLog {
  reps: string;
  weight: string;
  done: boolean;
}

export interface DayLog {
  checks: Record<string, boolean>;
  sets: Record<string, SetLog[]>;
}

export type LogsStore = Record<string, DayLog>;

export const WEEK_GUIDES: WeekGuide[] = [
  {
    week: 1,
    label: "Semana 1 · Adaptación",
    backpackLoad: "Sin mochila o 3–4 kg ligeros",
    suggestedKg: "0–4 kg",
    summary: "Prioriza técnica limpia, rango completo y control excéntrico en tus 2 series principales.",
  },
  {
    week: 2,
    label: "Semana 2 · Carga Base",
    backpackLoad: "Mochila con libros (6 kg)",
    suggestedKg: "6 kg",
    summary: "Introduce la mochila con 6 kg en ejercicios de pierna y remo manteniendo 1–2 reps en reserva.",
  },
  {
    week: 3,
    label: "Semana 3 · Progresión",
    backpackLoad: "Mochila con libros (7 kg)",
    suggestedKg: "7 kg",
    summary: "Sube a 7 kg en sentadillas, puentes y peso muerto. Añade mochila en búlgaras si dominas el equilibrio.",
  },
  {
    week: 4,
    label: "Semana 4 · Consolidación",
    backpackLoad: "Mochila completa (8 kg)",
    suggestedKg: "8 kg",
    summary: "Alcanza los 8 kg con pausas de 2–3 s en glúteos y considera añadir 1 serie extra si recuperas bien.",
  },
];

export const STRENGTH_ROUTINE: DayRoutine[] = [
  {
    dayIndex: 0,
    name: "Lunes",
    short: "Lun",
    focus: "Piernas y Glúteos",
    note: "Mochila con libros (6–8 kg) · 2 series de trabajo principales por ejercicio.",
    exercises: [
      {
        id: "lun-sent",
        name: "Sentadillas con mochila",
        target: "2 series principales × 10–15 reps",
        defaultRestSec: 90,
        usesBackpack: true,
        tip: "Espalda neutra, pecho abierto y bajada controlada en 2–3 segundos hasta romper el paralelo.",
      },
      {
        id: "lun-puen",
        name: "Puente de glúteo con mochila",
        target: "2 series principales × 12–15 reps",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Coloca la mochila sobre la cadera y mantén 2 segundos arriba contrayendo fuerte los glúteos.",
      },
      {
        id: "lun-zanc",
        name: "Zancadas hacia atrás",
        target: "2 series principales × 8–10 reps / pierna",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Paso largo hacia atrás bajando la rodilla suavemente; empuja con el talón delantero.",
      },
      {
        id: "lun-pant",
        name: "Elevación de talones (pantorrillas)",
        target: "2 series principales × 15–20 reps",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Estiramiento completo abajo y pausa de 1 segundo arriba en cada repetición.",
      },
    ],
  },
  {
    dayIndex: 1,
    name: "Martes",
    short: "Mar",
    focus: "Pecho, Hombros y Core",
    note: "Trabajo estético de tren superior y estabilidad central en casa.",
    exercises: [
      {
        id: "mar-flexi",
        name: "Flexiones inclinadas (cama o mesa)",
        target: "2 series principales × 8–12 reps",
        defaultRestSec: 60,
        usesBackpack: false,
        tip: "Codos en ángulo de 45° respecto al torso, abdomen firme y bajada controlada.",
      },
      {
        id: "mar-rod",
        name: "Flexiones con rodillas",
        target: "2 series principales × 6–10 reps",
        defaultRestSec: 60,
        usesBackpack: false,
        tip: "Cuerpo alineado de rodillas a hombros, descenso lento de 3 segundos sin colapsar la lumbar.",
      },
      {
        id: "mar-plan",
        name: "Plancha abdominal",
        target: "2 series principales × 30–45 s",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Aprieta glúteos y abdomen manteniendo pelvis neutra y empuje constante contra el suelo.",
      },
      {
        id: "mar-shld",
        name: "Shoulder taps en plancha",
        target: "2 series principales × 10 toques / lado",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Separa ligeramente los pies para evitar que la cadera rote al tocar el hombro contrario.",
      },
    ],
  },
  {
    dayIndex: 2,
    name: "Miércoles",
    short: "Mié",
    focus: "Piernas y Glúteos Unilateral",
    note: "Trabajo unilateral para simetría, estabilidad de cadera y glúteo profundo.",
    exercises: [
      {
        id: "mie-bulg",
        name: "Sentadilla Búlgara",
        target: "2 series principales × 8–10 reps / pierna",
        defaultRestSec: 90,
        usesBackpack: true,
        tip: "Apoya el empeine atrás sobre una silla o cama; inclina ligeramente el torso para mayor foco en glúteo.",
      },
      {
        id: "mie-puen1",
        name: "Puente de glúteo a 1 pierna",
        target: "2 series principales × 8–12 reps / pierna",
        defaultRestSec: 60,
        usesBackpack: false,
        tip: "Mantén la cadera nivelada sin rotar y empuja exclusivamente desde el talón de apoyo.",
      },
      {
        id: "mie-pmr",
        name: "Peso muerto rumano a 1 pierna",
        target: "2 series principales × 10–12 reps / pierna",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Sujeta la mochila al frente, lleva la cadera atrás como bisagra y mantén la espalda recta.",
      },
      {
        id: "mie-abd",
        name: "Abducción de cadera acostada",
        target: "2 series principales × 15 reps / lado",
        defaultRestSec: 30,
        usesBackpack: false,
        tip: "Pierna estirada con punta ligeramente hacia abajo para aislar el glúteo medio.",
      },
    ],
  },
  {
    dayIndex: 3,
    name: "Jueves",
    short: "Jue",
    focus: "Espalda Postural y Abdomen",
    note: "Corrección postural, apertura torácica y fortalecimiento lumbar-abdominal.",
    exercises: [
      {
        id: "jue-sup",
        name: "Supermans en el suelo",
        target: "2 series principales × 12–15 reps",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Eleva pecho y piernas a la vez con mirada neutra al suelo y pausa de 1–2 s arriba.",
      },
      {
        id: "jue-ytw",
        name: "Ángeles boca abajo (Y-T-W)",
        target: "2 series principales × 10 reps",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Recorre las posiciones Y, T y W juntando escápulas sin encoger los hombros hacia las orejas.",
      },
      {
        id: "jue-dbug",
        name: "Dead Bug (bicho muerto)",
        target: "2 series principales × 10 reps / lado",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Exhala al extender brazo y pierna contrarios manteniendo la zona lumbar pegada al suelo.",
      },
      {
        id: "jue-plat",
        name: "Plancha lateral",
        target: "2 series principales × 20–30 s / lado",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Alinea hombro, cadera y tobillo en una sola línea recta sin dejar caer la pelvis.",
      },
    ],
  },
  {
    dayIndex: 4,
    name: "Viernes",
    short: "Vie",
    focus: "Piernas y Glúteos Volumen",
    note: "Sesión de congestión e isometrías para redondez de glúteo y resistencia.",
    exercises: [
      {
        id: "vie-sumo",
        name: "Sentadilla Sumo con mochila",
        target: "2 series principales × 12–15 reps",
        defaultRestSec: 90,
        usesBackpack: true,
        tip: "Pies abiertos con puntas a 45°, rodillas siguiendo la línea de los dedos y mochila abrazada al pecho.",
      },
      {
        id: "vie-puen3",
        name: "Puente con mochila y pausa de 3s",
        target: "2 series principales × 12–15 reps",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Sostén 3 segundos completos en el punto más alto de cada repetición.",
      },
      {
        id: "vie-step",
        name: "Step-ups en silla firme",
        target: "2 series principales × 10 reps / pierna",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Sube impulsando con la pierna de arriba sin rebotar con el pie que queda en el suelo.",
      },
      {
        id: "vie-wall",
        name: "Sentadilla en pared (Wall Sit)",
        target: "2 series principales × 30–45 s",
        defaultRestSec: 60,
        usesBackpack: false,
        tip: "Espalda y cabeza apoyadas en la pared, muslos paralelos al suelo y respiración constante.",
      },
    ],
  },
  {
    dayIndex: 5,
    name: "Sábado",
    short: "Sáb",
    focus: "Tren Superior y Glúteo Aislado",
    note: "Remate semanal combinando pecho, tracción dorsal con mochila y glúteo aislado.",
    exercises: [
      {
        id: "sab-flex",
        name: "Flexiones inclinadas controladas",
        target: "2 series principales × 10–12 reps",
        defaultRestSec: 60,
        usesBackpack: false,
        tip: "Control estricto de 3 segundos en la bajada y extensión completa al subir.",
      },
      {
        id: "sab-remo",
        name: "Remo con mochila a 1 brazo",
        target: "2 series principales × 10–12 reps / brazo",
        defaultRestSec: 60,
        usesBackpack: true,
        tip: "Apoya una mano en la cama o silla, espalda plana y lleva el codo hacia la cadera.",
      },
      {
        id: "sab-donk",
        name: "Patadas de glúteo (Donkey Kicks)",
        target: "2 series principales × 15 reps / pierna",
        defaultRestSec: 30,
        usesBackpack: false,
        tip: "En cuadrupedia con abdomen activo, empuja el talón hacia el techo sin arquear la espalda baja.",
      },
      {
        id: "sab-plan",
        name: "Plancha abdominal final",
        target: "2 series principales × 30–45 s",
        defaultRestSec: 45,
        usesBackpack: false,
        tip: "Respiración profunda y activación total de core para cerrar la semana de fuerza.",
      },
    ],
  },
  {
    dayIndex: 6,
    name: "Domingo",
    short: "Dom",
    focus: "Descanso Activo y Activación",
    note: "Sin carga de fuerza. Prioriza caminata suave, movilidad y tus hábitos de la Opción 1.",
    isRestDay: true,
    exercises: [],
  },
];

export const NECK_EXERCISE: ExerciseDefinition = {
  id: "act-neck-load",
  name: "Carga de Cuello interdiaria (Anterior y Posterior)",
  target: "2 series principales × 15–20 reps · 1–2 RIR",
  defaultRestSec: 45,
  usesBackpack: false,
  tip: "Realiza flexiones anteriores y extensiones posteriores con movimiento lento y sin tirones cervicales.",
};

export const DAILY_ACTIVATION: {
  face: HabitItem[];
  posture: HabitItem[];
} = {
  face: [
    {
      id: "act-cold",
      name: "Lavado con agua muy fría al despertar",
      meta: "Al despertar · Tono facial y desinflamación",
      timerSec: null,
    },
    {
      id: "act-mew",
      name: "Mewing constante (postura lingual)",
      meta: "Todo el día · Lengua completa en el paladar y sellado labial",
      timerSec: null,
    },
    {
      id: "act-brow",
      name: "Enfoque de cejas y control frontal",
      meta: "2 × 20 reps · Control muscular suave",
      timerSec: null,
    },
    {
      id: "act-blink",
      name: "Parpadeo con resistencia",
      meta: "2 × 10–20 reps · 3 s de sostén",
      timerSec: 3,
    },
    {
      id: "act-smile",
      name: "Sonrisa forzada y elevación de mejillas",
      meta: "10 × 3 s de sostén",
      timerSec: 3,
    },
    {
      id: "act-kiss",
      name: "Beso con resistencia",
      meta: "2 × 15 reps · Tono orbicular",
      timerSec: null,
    },
    {
      id: "act-spoon",
      name: "Levantamiento de cuchara",
      meta: "Activación de mejillas y contorno facial",
      timerSec: null,
    },
  ],
  posture: [
    {
      id: "act-chin",
      name: "Chin tucks contra pared o puerta",
      meta: "Retracción cervical · 15 s de sostén",
      timerSec: 15,
    },
    {
      id: "act-door",
      name: "Estiramiento de pecho y hombros en marco",
      meta: "Apertura pectoral · 30–45 s",
      timerSec: 30,
    },
    {
      id: "act-thor",
      name: "Rotaciones torácicas",
      meta: "30 s por lado · Movilidad dorsal",
      timerSec: 30,
    },
    {
      id: "act-cobra",
      name: "Postura de la cobra",
      meta: "60 s · Extensión torácica suave",
      timerSec: 60,
    },
    {
      id: "act-shld",
      name: "Hombros por encima y por detrás",
      meta: "60 s · Movilidad escapular",
      timerSec: 60,
    },
    {
      id: "act-angel",
      name: "Ángel invertido en el suelo o pared",
      meta: "60 s · Alineación de espalda alta",
      timerSec: 60,
    },
  ],
};

const EPOCH_BASE_MS = Date.UTC(2026, 0, 1);
export const MS_PER_DAY = 86400000;

export function getNormalizedDate(date = new Date()): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function getDateKey(dateObj: Date): string {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameCalendarDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getMondayBasedDayIndex(dateObj: Date): number {
  const jsDay = dateObj.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function isNeckDay(dateObj: Date): boolean {
  const utcSelected = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffDays = Math.floor((utcSelected - EPOCH_BASE_MS) / MS_PER_DAY);
  return Math.abs(diffDays) % 2 === 0;
}

export function isVacuumDay(dateObj: Date): boolean {
  const dayIdx = getMondayBasedDayIndex(dateObj);
  return dayIdx === 0 || dayIdx === 2 || dayIdx === 4; // Lunes, Miércoles, Viernes
}
