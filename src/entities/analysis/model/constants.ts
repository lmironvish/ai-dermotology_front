import type { AnalysisErrorContent, AnalysisTimelineStep, ErrorType, WorkspaceState } from "./types";

export const WORKSPACE_STEPS: Array<{ id: Exclude<WorkspaceState, "error">; label: string }> = [
  { id: "upload", label: "Загрузка" },
  { id: "preview", label: "Предпросмотр" },
  { id: "analyzing", label: "Анализ" },
  { id: "result", label: "Результат" },
];

export const WORKSPACE_STATE_ORDER: WorkspaceState[] = [
  "upload",
  "preview",
  "analyzing",
  "result",
  "error",
];

export const ANALYSIS_TIMELINE: AnalysisTimelineStep[] = [
  { delay: 400, stage: 0, progress: 10 },
  { delay: 1000, stage: 1, progress: 30 },
  { delay: 1800, stage: 2, progress: 65 },
  { delay: 2600, stage: 2, progress: 85 },
];

export const ANALYSIS_STAGE_LABELS = [
  "Кейс создан и изображение загружено",
  "Выполняется анализ",
  "Формируется PDF-отчёт",
];

export const DEMO_ERROR_OPTIONS: Array<{ label: string; type: ErrorType }> = [
  { label: "Неверный формат", type: "format" },
  { label: "Файл слишком большой", type: "size" },
  { label: "Ошибка сети", type: "network" },
  { label: "Сервер недоступен", type: "server" },
];

export const ANALYSIS_ERROR_CONTENT: Record<ErrorType, AnalysisErrorContent> = {
  format: {
    title: "Неподдерживаемый формат файла",
    desc: "Загрузите изображение в формате JPG, JPEG или PNG.",
    hint: "Проверьте формат файла и повторите попытку.",
    color: "#fff1f2",
    border: "#fecdd3",
    iconBg: "#fee2e2",
  },
  size: {
    title: "Файл слишком большой",
    desc: "Размер загружаемого файла превышает максимально допустимые 10 МБ.",
    hint: "Уменьшите размер файла и повторите попытку.",
    color: "#fffbeb",
    border: "#fde68a",
    iconBg: "#fef3c7",
  },
  network: {
    title: "Ошибка сети",
    desc: "Не удалось установить соединение с сервером.",
    hint: "Проверьте подключение к интернету и повторите попытку.",
    color: "#f5f3ff",
    border: "#ddd6fe",
    iconBg: "#ede9fe",
  },
  server: {
    title: "Ошибка сервера",
    desc: "Сервис временно недоступен или вернул ошибку.",
    hint: "Попробуйте повторить запрос немного позже.",
    color: "#ecfeff",
    border: "#a5f3fc",
    iconBg: "#cffafe",
  },
};
