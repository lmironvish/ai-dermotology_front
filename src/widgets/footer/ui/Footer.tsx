export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="footer" style={{ background: "#0f172a" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="9" cy="9" r="1.5" fill="white"/>
                </svg>
              </div>
              <span
                className="text-[15px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "white" }}
              >
                Анализ кожи AI
              </span>
            </div>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "#64748b", fontFamily: "var(--font-body)" }}
            >
              Современный сервис дерматологического анализа с использованием нейросетевых технологий
            </p>
          </div>

          <div>
            <h4
              className="mb-4 text-[13px] uppercase tracking-wider"
              style={{ color: "#475569", fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Навигация
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "О сервисе", id: "about" },
                { label: "Как это работает", id: "how-it-works" },
                { label: "Анализ изображения", id: "workspace" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-[14px] transition-colors hover:text-white"
                  style={{ color: "#64748b", fontFamily: "var(--font-body)" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="mb-4 text-[13px] uppercase tracking-wider"
              style={{ color: "#475569", fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Документы
            </h4>
            <div className="flex flex-col gap-2.5">
              {["Политика конфиденциальности", "Пользовательское соглашение", "Контакты"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[14px] transition-colors hover:text-white"
                  style={{ color: "#64748b", fontFamily: "var(--font-body)" }}
                  onClick={(e) => e.preventDefault()}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[13px]"
            style={{ color: "#475569", fontFamily: "var(--font-body)" }}
          >
            © 2025 Анализ кожи AI. Все права защищены.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span
              className="text-[13px]"
              style={{ color: "#475569", fontFamily: "var(--font-body)" }}
            >
              Все системы работают
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
