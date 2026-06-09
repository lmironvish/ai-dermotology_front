import {
  ANATOMICAL_LOCATION_OPTIONS,
  SEX_OPTIONS,
  type AnalysisFormData,
  type AnalysisFormErrors,
} from "@/entities/analysis";

interface AnalysisFormPanelProps {
  formData: AnalysisFormData;
  validationErrors: AnalysisFormErrors;
  onFieldChange: <TField extends keyof AnalysisFormData>(
    field: TField,
    value: AnalysisFormData[TField],
  ) => void;
}

function inputStyle(hasError: boolean) {
  return {
    background: "white",
    border: `1px solid ${hasError ? "#fda4af" : "rgba(15,23,42,0.12)"}`,
    boxShadow: hasError ? "0 0 0 3px rgba(244,63,94,0.08)" : "none",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1 text-[12px]" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
      {message}
    </p>
  );
}

export function AnalysisFormPanel({
  formData,
  validationErrors,
  onFieldChange,
}: AnalysisFormPanelProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" }}
    >
      <div className="mb-4">
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#0f172a",
          }}
        >
          Данные для анализа
        </h4>
        <p className="mt-1 text-[13px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
          Заполните анкету перед отправкой изображения на анализ.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span
            className="mb-2 block text-[13px]"
            style={{ color: "#334155", fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Возраст
          </span>
          <input
            className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
            inputMode="numeric"
            min={0}
            max={120}
            onChange={(event) => onFieldChange("ageYears", event.target.value)}
            placeholder="Например, 42"
            style={inputStyle(Boolean(validationErrors.ageYears))}
            type="number"
            value={formData.ageYears}
          />
          <FieldError message={validationErrors.ageYears} />
        </label>

        <label className="block">
          <span
            className="mb-2 block text-[13px]"
            style={{ color: "#334155", fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Пол
          </span>
          <select
            className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
            onChange={(event) => onFieldChange("sex", event.target.value as AnalysisFormData["sex"])}
            style={inputStyle(Boolean(validationErrors.sex))}
            value={formData.sex}
          >
            <option value="">Выберите пол</option>
            {SEX_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={validationErrors.sex} />
        </label>

        <label className="block sm:col-span-2">
          <span
            className="mb-2 block text-[13px]"
            style={{ color: "#334155", fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Локализация
          </span>
          <select
            className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
            onChange={(event) =>
              onFieldChange(
                "anatomicalLocation",
                event.target.value as AnalysisFormData["anatomicalLocation"],
              )
            }
            style={inputStyle(Boolean(validationErrors.anatomicalLocation))}
            value={formData.anatomicalLocation}
          >
            <option value="">Выберите локализацию</option>
            {ANATOMICAL_LOCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={validationErrors.anatomicalLocation} />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <label
          className="rounded-2xl p-4 flex items-start gap-3 cursor-pointer"
          style={{
            background: validationErrors.consentPersonalData ? "#fff1f2" : "white",
            border: `1px solid ${validationErrors.consentPersonalData ? "#fecdd3" : "rgba(15,23,42,0.08)"}`,
          }}
        >
          <input
            checked={formData.consentPersonalData}
            className="mt-1 h-4 w-4 accent-[#2563eb]"
            onChange={(event) => onFieldChange("consentPersonalData", event.target.checked)}
            type="checkbox"
          />
          <span className="text-[13px] leading-5" style={{ color: "#334155", fontFamily: "var(--font-body)" }}>
            Я согласен(на) на обработку персональных данных
          </span>
        </label>
        <FieldError message={validationErrors.consentPersonalData} />

        <label
          className="rounded-2xl p-4 flex items-start gap-3 cursor-pointer"
          style={{
            background: validationErrors.consentImageProcessing ? "#fff1f2" : "white",
            border: `1px solid ${validationErrors.consentImageProcessing ? "#fecdd3" : "rgba(15,23,42,0.08)"}`,
          }}
        >
          <input
            checked={formData.consentImageProcessing}
            className="mt-1 h-4 w-4 accent-[#2563eb]"
            onChange={(event) => onFieldChange("consentImageProcessing", event.target.checked)}
            type="checkbox"
          />
          <span className="text-[13px] leading-5" style={{ color: "#334155", fontFamily: "var(--font-body)" }}>
            Я согласен(на) на обработку загруженного изображения
          </span>
        </label>
        <FieldError message={validationErrors.consentImageProcessing} />

        <label
          className="rounded-2xl p-4 flex items-start gap-3 cursor-pointer"
          style={{ background: "white", border: "1px solid rgba(15,23,42,0.08)" }}
        >
          <input
            checked={formData.consentEmailReport}
            className="mt-1 h-4 w-4 accent-[#2563eb]"
            onChange={(event) => onFieldChange("consentEmailReport", event.target.checked)}
            type="checkbox"
          />
          <span className="text-[13px] leading-5" style={{ color: "#334155", fontFamily: "var(--font-body)" }}>
            Отправить PDF-отчёт на email
          </span>
        </label>

        {formData.consentEmailReport && (
          <label className="block">
            <span
              className="mb-2 block text-[13px]"
              style={{ color: "#334155", fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Email для отчёта
            </span>
            <input
              className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
              onChange={(event) => onFieldChange("contactEmail", event.target.value)}
              placeholder="patient@example.com"
              style={inputStyle(Boolean(validationErrors.contactEmail))}
              type="email"
              value={formData.contactEmail}
            />
            <FieldError message={validationErrors.contactEmail} />
          </label>
        )}
      </div>
    </div>
  );
}
