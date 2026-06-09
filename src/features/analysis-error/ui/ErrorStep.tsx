import { ANALYSIS_ERROR_CONTENT } from "@/entities/analysis";
import type { ErrorType } from "@/entities/analysis";
import { AlertCircle, AlertTriangle, RefreshCw, ServerCrash, WifiOff } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorStepProps {
  errorMessage?: string | null;
  errorType?: ErrorType | null;
  onReset: () => void;
}

const ERROR_ICONS: Record<ErrorType, ReactNode> = {
  format: <AlertCircle size={22} style={{ color: "#dc2626" }} />,
  size: <AlertTriangle size={22} style={{ color: "#d97706" }} />,
  network: <WifiOff size={22} style={{ color: "#7c3aed" }} />,
  server: <ServerCrash size={22} style={{ color: "#0891b2" }} />,
};

export function ErrorStep({ errorMessage, errorType, onReset }: ErrorStepProps) {
  const error = errorType
    ? ANALYSIS_ERROR_CONTENT[errorType]
    : {
        title: "Ошибка обработки",
        desc: errorMessage ?? "Не удалось завершить обработку изображения.",
        hint: "Проверьте данные и попробуйте снова.",
        color: "#fff1f2",
        border: "#fecdd3",
        iconBg: "#fee2e2",
      };
  const description = errorMessage ?? error.desc;

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
          Ошибка обработки
        </h3>
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: error.color, border: `1px solid ${error.border}` }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: error.iconBg }}
          >
            {errorType ? ERROR_ICONS[errorType] : <AlertCircle size={22} style={{ color: "#dc2626" }} />}
          </div>
          <div>
            <p
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "#0f172a" }}
            >
              {error.title}
            </p>
            <p className="mt-1 text-[14px]" style={{ color: "#475569", fontFamily: "var(--font-body)" }}>
              {description}
            </p>
            <div
              className="mt-3 rounded-lg px-3 py-2 text-[13px]"
              style={{ background: "rgba(255,255,255,0.7)", color: "#64748b", fontFamily: "var(--font-body)" }}
            >
              Подсказка: {error.hint}
            </div>
          </div>
        </div>
      </div>

      <button
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] text-white transition-all hover:opacity-90"
        onClick={onReset}
        style={{
          background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          boxShadow: "0 4px 16px rgba(20,71,160,0.25)",
        }}
      >
        <RefreshCw size={15} />
        Попробовать снова
      </button>
    </div>
  );
}
