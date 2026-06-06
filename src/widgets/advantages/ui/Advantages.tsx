export function Advantages() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Быстрый анализ",
      desc: "Результат готов менее чем за 2 минуты после загрузки изображения",
      color: "#eef4ff",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M9 12l2 2 4-4" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Без установки программ",
      desc: "Сервис полностью доступен онлайн - никаких загрузок и установок",
      color: "#f0fdf4",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M8 20h8M12 18v2" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7 9h10M7 12h7" stroke="#1447a0" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
      title: "Работа в браузере",
      desc: "Поддерживается в Chrome, Firefox, Safari и других современных браузерах",
      color: "#fefce8",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M8 11V7a4 4 0 018 0v4" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1.5" fill="#1447a0"/>
        </svg>
      ),
      title: "Безопасная передача данных",
      desc: "Все данные передаются по зашифрованному протоколу HTTPS",
      color: "#fff1f2",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#1447a0" strokeWidth="1.6"/>
          <circle cx="12" cy="9" r="2.5" stroke="#1447a0" strokeWidth="1.4"/>
        </svg>
      ),
      title: "Удобный интерфейс",
      desc: "Интуитивно понятный дизайн без лишних шагов и сложных настроек",
      color: "#faf5ff",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="#1447a0" strokeWidth="1.6"/>
          <path d="M8 8h8M8 12h8M8 16h5" stroke="#1447a0" strokeWidth="1.4" strokeLinecap="round"/>
          <rect x="4" y="2" width="16" height="5" rx="2" fill="#eef4ff"/>
          <path d="M9 5h4" stroke="#1447a0" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: "PDF-отчет",
      desc: "Структурированный отчет в формате PDF, готовый к печати и архивированию",
      color: "#ecfeff",
    },
  ];

  return (
    <section id="about" className="py-24" style={{ background: "#f8fafc" }}>
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
            Преимущества сервиса
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
            Все необходимое для анализа
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
            Современный инструмент для дерматологического анализа без сложных настроек
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl group hover:shadow-md transition-all duration-200 cursor-default"
              style={{
                background: "white",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: feature.color }}
              >
                {feature.icon}
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
                {feature.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "#64748b",
                  lineHeight: 1.65,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
