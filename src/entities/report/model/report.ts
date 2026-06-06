export interface DemoReportMeta {
  fileName: string;
  title: string;
  size: string;
  pages: string;
  status: string;
  previewLabel: string;
}

export const DEMO_REPORT_META: DemoReportMeta = {
  fileName: "dermatology-analysis-report.pdf",
  title: "Дерматологический анализ",
  size: "1.2 МБ",
  pages: "4",
  status: "Готов",
  previewLabel: "Предпросмотр",
};

export function getDemoReportCreatedDate(locale = "ru-RU"): string {
  return new Date().toLocaleDateString(locale);
}
