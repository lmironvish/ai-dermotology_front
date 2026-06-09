import { AnalysisFormPanel } from "@/features/analysis-form";
import type { AnalysisFormData, AnalysisFormErrors } from "@/entities/analysis";
import { CheckCircle2, FileText, RefreshCw, X } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

interface PreviewStepProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  fileName: string;
  fileSize: string;
  formData: AnalysisFormData;
  isStartDisabled?: boolean;
  onFieldChange: <TField extends keyof AnalysisFormData>(
    field: TField,
    value: AnalysisFormData[TField],
  ) => void;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onReplace: () => void;
  onStartAnalysis: () => void;
  preview: string;
  startHint?: string | null;
  validationErrors: AnalysisFormErrors;
}

export function PreviewStep({
  fileInputRef,
  fileName,
  fileSize,
  formData,
  isStartDisabled = false,
  onFieldChange,
  onFileInput,
  onRemove,
  onReplace,
  onStartAnalysis,
  preview,
  startHint = null,
  validationErrors,
}: PreviewStepProps) {
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
          2. Предпросмотр изображения
        </h3>
        <p className="mt-1 text-[14px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
          Проверьте изображение и заполненную анкету перед запуском анализа.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: "#f1f5f9",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
              aspectRatio: "4/3",
            }}
          >
            <img
              alt="Предпросмотр загруженного изображения"
              className="w-full h-full object-cover"
              src={preview}
            />
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#eef4ff" }}
              >
                <FileText size={18} style={{ color: "#1447a0" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="truncate text-[14px]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#0f172a" }}
                >
                  {fileName}
                </p>
                <p className="text-[13px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
                  {fileSize}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
              <span
                className="text-[13px]"
                style={{ color: "#15803d", fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Изображение прошло проверку
              </span>
            </div>
            <p className="text-[13px]" style={{ color: "#16a34a", fontFamily: "var(--font-body)" }}>
              Формат и размер файла соответствуют требованиям сервиса.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AnalysisFormPanel
            formData={formData}
            onFieldChange={onFieldChange}
            validationErrors={validationErrors}
          />

          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] transition-all hover:bg-red-50"
              onClick={onRemove}
              style={{
                border: "1px solid #fecdd3",
                color: "#dc2626",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                background: "#fff1f2",
              }}
            >
              <X size={15} />
              Удалить
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] transition-all hover:bg-slate-100"
              onClick={onReplace}
              style={{
                border: "1px solid rgba(15,23,42,0.1)",
                color: "#475569",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                background: "white",
              }}
            >
              <RefreshCw size={15} />
              Заменить
            </button>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isStartDisabled}
            onClick={onStartAnalysis}
            style={{
              background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(20,71,160,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.4" strokeOpacity="0.6" />
              <path d="M6 5.5l4 2.5-4 2.5V5.5z" fill="white" />
            </svg>
            Начать анализ
          </button>

          <p className="text-center text-[13px]" style={{ color: "#94a3b8", fontFamily: "var(--font-body)" }}>
            Обработка обычно занимает до 2 минут.
          </p>

          {startHint && (
            <p className="text-center text-[13px]" style={{ color: "#b45309", fontFamily: "var(--font-body)" }}>
              {startHint}
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileInput}
        type="file"
      />
    </div>
  );
}
