interface HeroSectionProps {
  onStartAnalysis: () => void;
  onHowItWorks: () => void;
}

export function HeroSection({ onStartAnalysis, onHowItWorks }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f8fafc 0%, #eef4ff 50%, #f8fafc 100%)" }}
    >
      <div
        className="absolute top-[-120px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #dbeafe 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #bfdbfe 0%, transparent 70%)" }}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-[560px]">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-[13px]"
              style={{
                background: "#eef4ff",
                color: "#1447a0",
                border: "1px solid #bfdbfe",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#2563eb" }}
              />
              Медицинская ИИ-технология
            </div>

            <h1
              className="mb-5 leading-[1.15] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                color: "#0f172a",
              }}
            >
              Анализ дерматологических изображений с использованием{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                искусственного интеллекта
              </span>
            </h1>

            <p
              className="mb-8 leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.125rem",
                color: "#475569",
              }}
            >
              Загрузите фотографию кожного образования и получите результат анализа
              в формате PDF за несколько минут
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onStartAnalysis}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-[15px] transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  boxShadow: "0 4px 20px rgba(20,71,160,0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 11.5V13.5H4L11.5 6L9.5 4L2 11.5Z" fill="white" fillOpacity="0.8"/>
                  <path d="M13.2 3.3L12.7 2.8C12.3 2.4 11.7 2.4 11.3 2.8L10.2 3.9L12.2 5.9L13.2 4.8C13.6 4.4 13.6 3.7 13.2 3.3Z" fill="white"/>
                </svg>
                Загрузить изображение
              </button>

              <button
                onClick={onHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] transition-all duration-150 hover:bg-slate-100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: "#334155",
                  background: "white",
                  border: "1px solid rgba(15,23,42,0.12)",
                  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
                }}
              >
                Как это работает
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              {[
                { icon: "🔒", text: "HTTPS шифрование" },
                { icon: "⚡", text: "Анализ за 2 минуты" },
                { icon: "📄", text: "PDF отчет" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <span className="text-base">{badge.icon}</span>
                  <span
                    className="text-[13px]"
                    style={{ color: "#64748b", fontFamily: "var(--font-body)" }}
                  >
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px]">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 24px 80px rgba(20,71,160,0.15), 0 4px 16px rgba(15,23,42,0.06)",
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div
            className="flex-1 text-center text-[12px]"
            style={{ color: "#94a3b8", fontFamily: "var(--font-body)" }}
          >
            Анализ кожи AI - рабочий стол
          </div>
        </div>

        <div className="p-6">
          <div
            className="rounded-xl flex flex-col items-center justify-center gap-3 py-8"
            style={{
              background: "#f8fafc",
              border: "2px dashed #bfdbfe",
            }}
          >
            <div
              className="w-32 h-32 rounded-xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #fde8d8 0%, #f4c2a8 40%, #e8a882 100%)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `
                    radial-gradient(ellipse 30px 20px at 30% 40%, rgba(180,100,80,0.5) 0%, transparent 100%),
                    radial-gradient(ellipse 20px 15px at 65% 60%, rgba(160,80,60,0.4) 0%, transparent 100%),
                    radial-gradient(ellipse 15px 12px at 50% 30%, rgba(200,120,90,0.3) 0%, transparent 100%)
                  `,
                }}
              />
              <div
                className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="#1447a0" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <span className="text-[12px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
              Изображение загружено
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {[
              { label: "Изображение загружено", done: true },
              { label: "Выполняется анализ", active: true },
              { label: "Формирование отчета", done: false },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: step.done ? "#dcfce7" : step.active ? "#eef4ff" : "#f1f5f9",
                    border: step.active ? "2px solid #2563eb" : "none",
                  }}
                >
                  {step.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {step.active && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#2563eb", animation: "pulse 1.5s infinite" }}
                    />
                  )}
                </div>
                <span
                  className="text-[13px]"
                  style={{
                    color: step.done ? "#16a34a" : step.active ? "#1447a0" : "#94a3b8",
                    fontFamily: "var(--font-body)",
                    fontWeight: step.active ? 500 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "65%",
                background: "linear-gradient(90deg, #1447a0 0%, #2563eb 100%)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "#f0fdf4", borderTop: "1px solid #bbf7d0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#dcfce7" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="2" width="12" height="14" rx="2" stroke="#16a34a" strokeWidth="1.4"/>
                <path d="M6 7h6M6 10h4" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M6 13h2" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-medium" style={{ color: "#15803d", fontFamily: "var(--font-display)" }}>
                Отчет готов
              </div>
              <div className="text-[11px]" style={{ color: "#4ade80", fontFamily: "var(--font-body)" }}>
                analysis_report.pdf • 1.2 МБ
              </div>
            </div>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg text-[12px] text-white"
            style={{ background: "#16a34a", fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Скачать
          </button>
        </div>
      </div>

      <div
        className="absolute -left-8 top-1/3 rounded-xl px-3 py-2.5 flex items-center gap-2"
        style={{
          background: "white",
          boxShadow: "0 8px 32px rgba(15,23,42,0.1)",
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#eef4ff" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="#2563eb" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: "#1447a0", fontFamily: "var(--font-display)" }}>
            ИИ анализ
          </div>
          <div className="text-[10px]" style={{ color: "#64748b" }}>нейросетевая модель</div>
        </div>
      </div>

      <div
        className="absolute -right-4 bottom-1/4 rounded-xl px-3 py-2.5 flex items-center gap-2"
        style={{
          background: "white",
          boxShadow: "0 8px 32px rgba(15,23,42,0.1)",
          border: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <span className="text-xl">⚡</span>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: "#0f172a", fontFamily: "var(--font-display)" }}>
            &lt; 2 минуты
          </div>
          <div className="text-[10px]" style={{ color: "#64748b" }}>время обработки</div>
        </div>
      </div>
    </div>
  );
}
