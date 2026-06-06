import { ANALYSIS_STAGE_LABELS } from "@/entities/analysis";

interface AnalyzingStepProps {
  progress: number;
  stage: number;
}

export function AnalyzingStep({ progress, stage }: AnalyzingStepProps) {
  return (
    <div>
      <div className="mb-8">
        <h3
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#0f172a" }}
        >
          3. Выполнение анализа
        </h3>
        <p className="mt-1 text-[14px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
          Пожалуйста, подождите - нейросетевая модель обрабатывает изображение
        </p>
      </div>

      <div
        className="rounded-2xl p-8 text-center mb-6"
        style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" }}
      >
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="6"/>
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1447a0"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.375rem",
                  color: "#1447a0",
                }}
              >
                {progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 max-w-[320px] mx-auto text-left">
          {ANALYSIS_STAGE_LABELS.map((label, i) => {
            const done = i < stage;
            const active = i === stage && stage < 3;

            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: done ? "#dcfce7" : active ? "#eef4ff" : "#f1f5f9",
                  }}
                >
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active ? (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#2563eb", animation: "spin 1.2s linear infinite" }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span
                  className="text-[14px] transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 500 : 400,
                    color: done ? "#15803d" : active ? "#1447a0" : "#94a3b8",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex items-center gap-2 justify-center rounded-xl py-3 px-4"
        style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#d97706" strokeWidth="1.4"/>
          <path d="M8 5v3.5M8 10.5v.5" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span
          className="text-[13px]"
          style={{ color: "#92400e", fontFamily: "var(--font-body)" }}
        >
          Ожидаемое время обработки: до 2 минут
        </span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
