import { DEMO_ERROR_OPTIONS } from "@/entities/analysis";
import type { ErrorType } from "@/entities/analysis";

interface ErrorStateDemoProps {
  onSelect: (type: ErrorType) => void;
}

export function ErrorStateDemo({ onSelect }: ErrorStateDemoProps) {
  return (
    <div className="px-8 lg:px-10 pb-8 pt-0">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" }}
      >
        <p
          className="text-[12px] mb-3"
          style={{ color: "#94a3b8", fontFamily: "var(--font-body)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          Демо: примеры состояний ошибок
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ERROR_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className="px-3 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-80"
              style={{
                background: "#fff1f2",
                color: "#dc2626",
                border: "1px solid #fecdd3",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
