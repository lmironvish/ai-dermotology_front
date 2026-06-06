export function PrivacySection() {
  const items = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3.5" y="9" width="13" height="9" rx="1.5" stroke="#1447a0" strokeWidth="1.4"/>
          <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="#1447a0" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="10" cy="13.5" r="1.5" fill="#1447a0"/>
        </svg>
      ),
      title: "HTTPS шифрование",
      desc: "Все данные передаются по защищенному протоколу",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2l1.5 4h4.5l-3.5 2.5 1 4L10 10l-3.5 2.5 1-4L4 6h4.5L10 2z" stroke="#1447a0" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Только для анализа",
      desc: "Изображения используются исключительно для обработки",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="#1447a0" strokeWidth="1.4"/>
          <path d="M7 10l2 2 4-4" stroke="#1447a0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Конфиденциальность",
      desc: "Данные не передаются третьим лицам",
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(135deg, #eef4ff 0%, #f0f9ff 100%)",
        borderTop: "1px solid rgba(15,23,42,0.06)",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 text-center md:text-left">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto md:mx-0"
                style={{ background: "#dbeafe", border: "1px solid #bfdbfe" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4z" stroke="#1447a0" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#1447a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "#0f172a",
                }}
              >
                Безопасность данных
              </h3>
            </div>

            <div
              className="hidden md:block w-px h-16 flex-shrink-0"
              style={{ background: "#bfdbfe" }}
            />

            <div className="flex-1">
              <p
                className="mb-5 text-[15px]"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#475569",
                  lineHeight: 1.65,
                }}
              >
                Передача данных осуществляется по защищенному соединению HTTPS.
                Загружаемые изображения используются исключительно для выполнения анализа.
              </p>
              <div className="flex flex-wrap gap-4">
                {items.map((item) => (
                  <div key={item.title} className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "white" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#1e293b" }}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
