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
  { delay: 400, stage: 1, progress: 30 },
  { delay: 1200, stage: 2, progress: 65 },
  { delay: 2400, stage: 3, progress: 90 },
  { delay: 3200, stage: 3, progress: 100 },
];

export const ANALYSIS_STAGE_LABELS = [
  "Изображение загружено",
  "Выполняется анализ",
  "Формирование отчета",
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
    desc: "Пожалуйста, загрузите изображение в формате JPG, JPEG или PNG.",
    hint: "Конвертируйте файл в поддерживаемый формат и повторите попытку.",
    color: "#fff1f2",
    border: "#fecdd3",
    iconBg: "#fee2e2",
  },
  size: {
    title: "Файл слишком большой",
    desc: "Размер загружаемого файла превышает максимально допустимый - 10 МБ.",
    hint: "Уменьшите размер изображения с помощью любого графического редактора.",
    color: "#fffbeb",
    border: "#fde68a",
    iconBg: "#fef3c7",
  },
  network: {
    title: "Ошибка сети",
    desc: "Не удалось установить соединение с сервером. Проверьте подключение к интернету.",
    hint: "Убедитесь, что вы подключены к интернету, и повторите попытку.",
    color: "#f5f3ff",
    border: "#ddd6fe",
    iconBg: "#ede9fe",
  },
  server: {
    title: "Сервер временно недоступен",
    desc: "Сервис временно недоступен в связи с техническим обслуживанием.",
    hint: "Попробуйте повторить запрос через несколько минут.",
    color: "#ecfeff",
    border: "#a5f3fc",
    iconBg: "#cffafe",
  },
};
