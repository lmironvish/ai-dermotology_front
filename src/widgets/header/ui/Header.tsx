import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onStartAnalysis: () => void;
}

export function Header({ onStartAnalysis }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(248,250,252,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(15,23,42,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 24px rgba(15,23,42,0.06)" : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
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
            className="text-[15px] tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#0f172a" }}
          >
            Анализ кожи AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "О сервисе", id: "about" },
            { label: "Как это работает", id: "how-it-works" },
            { label: "Анализ изображения", id: "workspace" },
            { label: "Контакты", id: "footer" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 rounded-lg text-[14px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onStartAnalysis}
            className="px-5 py-2 rounded-xl text-[14px] text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              boxShadow: "0 2px 12px rgba(20,71,160,0.3)",
            }}
          >
            Начать анализ
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-1">
          {[
            { label: "О сервисе", id: "about" },
            { label: "Как это работает", id: "how-it-works" },
            { label: "Анализ изображения", id: "workspace" },
            { label: "Контакты", id: "footer" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="py-2.5 px-3 rounded-lg text-left text-[15px] text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onStartAnalysis();
              setMobileOpen(false);
            }}
            className="mt-2 py-2.5 px-4 rounded-xl text-[15px] text-white text-center"
            style={{ background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)" }}
          >
            Начать анализ
          </button>
        </div>
      )}
    </header>
  );
}
