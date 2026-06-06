export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="6" width="20" height="16" rx="3" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M10 14l2.5 2.5L18 11" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v4" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
      title: "Загрузка изображения",
      desc: "Загрузите фотографию исследуемого участка кожи в формате JPG, JPEG или PNG",
    },
    {
      num: "02",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="9" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M10 14l2.5 2.5L18 11" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="22" cy="6" r="3" fill="#dbeafe" stroke="#1447a0" strokeWidth="1.2"/>
        </svg>
      ),
      title: "Проверка данных",
      desc: "Система выполняет автоматическую проверку изображения: формат, размер и качество",
    },
    {
      num: "03",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="3" y="10" width="6" height="8" rx="1.5" stroke="#1447a0" strokeWidth="1.6"/>
          <rect x="11" y="6" width="6" height="16" rx="1.5" stroke="#1447a0" strokeWidth="1.6"/>
          <rect x="19" y="8" width="6" height="12" rx="1.5" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M5 7V4" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M14 3V4" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      title: "Анализ",
      desc: "Нейросетевая модель выполняет детальный анализ изображения кожного образования",
    },
    {
      num: "04",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="6" y="3" width="16" height="22" rx="2.5" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M10 10h8M10 14h8M10 18h5" stroke="#1447a0" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M6 8h16" stroke="#dbeafe" strokeWidth="4" strokeOpacity="0.5"/>
          <rect x="6" y="3" width="16" height="5" rx="2.5" fill="#dbeafe"/>
          <path d="M10 6h5" stroke="#1447a0" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Получение отчета",
      desc: "Получите подробный результат анализа в формате PDF с детальным описанием",
    },
  ];

  return (
    <section id="how-it-works" className="py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-[13px]"
            style={{
              background: "#eef4ff",
              color: "#1447a0",
              border: "1px solid #bfdbfe",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            Простой процесс
          </div>
          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 2.5vw, 2.25rem)",
              color: "#0f172a",
            }}
          >
            Как это работает
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "#64748b",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Всего четыре шага от загрузки изображения до готового отчета
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-9 left-[calc(100%-0px)] w-6 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <svg width="24" height="2" viewBox="0 0 24 2" fill="none">
                    <path d="M0 1h24" stroke="#bfdbfe" strokeWidth="2" strokeDasharray="4 3"/>
                  </svg>
                </div>
              )}

              <div
                className="p-6 rounded-2xl h-full group hover:shadow-lg transition-all duration-200"
                style={{
                  background: "#f8fafc",
                  border: "1px solid rgba(15,23,42,0.06)",
                  boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "#eef4ff" }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-[28px] leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: "#dbeafe",
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#0f172a",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
