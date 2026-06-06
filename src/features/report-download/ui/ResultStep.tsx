import { DEMO_REPORT_META, getDemoReportCreatedDate } from "@/entities/report";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface ResultStepProps {
  downloadErrorMessage: string | null;
  isDownloadingReport: boolean;
  onDownload: () => void;
  onReset: () => void;
}

export function ResultStep({
  downloadErrorMessage,
  isDownloadingReport,
  onDownload,
  onReset,
}: ResultStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#0f172a",
          }}
        >
          4. Результат анализа
        </h3>
      </div>

      <div
        className="rounded-2xl p-5 mb-6 flex items-start gap-4"
        style={{ background: "#f0fdf4", border: "1px solid #86efac" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#dcfce7" }}
        >
          <CheckCircle2 size={20} style={{ color: "#16a34a" }} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#15803d",
            }}
          >
            Анализ успешно завершен
          </p>
          <p className="mt-0.5 text-[14px]" style={{ color: "#4ade80", fontFamily: "var(--font-body)" }}>
            Отчёт готов к скачиванию в формате PDF
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden mb-6 flex items-stretch"
        style={{
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
        }}
      >
        <div
          className="w-28 flex-shrink-0 flex flex-col items-center justify-center gap-2 py-6"
          style={{ background: "#fff1f2", borderRight: "1px solid rgba(220,38,38,0.1)" }}
        >
          <div
            className="w-12 h-14 rounded-lg flex items-center justify-center"
            style={{ background: "#dc2626" }}
          >
            <span
              className="text-white text-[11px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              PDF
            </span>
          </div>
          <span className="text-[11px]" style={{ color: "#94a3b8", fontFamily: "var(--font-body)" }}>
            {DEMO_REPORT_META.previewLabel}
          </span>
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#0f172a",
                }}
              >
                {DEMO_REPORT_META.fileName}
              </p>
              <p className="mt-0.5 text-[13px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
                {DEMO_REPORT_META.title}
              </p>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[11px]"
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #86efac",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              {DEMO_REPORT_META.status}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { label: "Размер", value: DEMO_REPORT_META.size },
              { label: "Страниц", value: DEMO_REPORT_META.pages },
              { label: "Создан", value: getDemoReportCreatedDate() },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[12px]" style={{ color: "#94a3b8", fontFamily: "var(--font-body)" }}>
                  {item.label}:{" "}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: "#475569", fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          disabled={isDownloadingReport}
          onClick={onDownload}
          style={{
            background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(20,71,160,0.3)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 13h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {isDownloadingReport ? "Скачивание..." : "Скачать PDF-отчёт"}
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[15px] transition-all hover:bg-slate-100"
          style={{
            border: "1px solid rgba(15,23,42,0.1)",
            color: "#475569",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            background: "white",
          }}
        >
          <RefreshCw size={15} />
          Выполнить новый анализ
        </button>
      </div>

      {downloadErrorMessage && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-[14px]"
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#b91c1c",
            fontFamily: "var(--font-body)",
          }}
        >
          {downloadErrorMessage}
        </div>
      )}
    </div>
  );
}
