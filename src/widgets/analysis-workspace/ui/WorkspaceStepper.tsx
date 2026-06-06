import { WORKSPACE_STATE_ORDER, WORKSPACE_STEPS } from "@/entities/analysis";
import type { WorkspaceState } from "@/entities/analysis";

interface WorkspaceStepperProps {
  currentState: WorkspaceState;
}

export function WorkspaceStepper({ currentState }: WorkspaceStepperProps) {
  const currentIdx = WORKSPACE_STATE_ORDER.indexOf(currentState === "error" ? "upload" : currentState);

  return (
    <div
      className="px-8 lg:px-10 py-5"
      style={{ borderBottom: "1px solid rgba(15,23,42,0.07)", background: "#fafbfc" }}
    >
      <div className="flex items-center gap-0">
        {WORKSPACE_STEPS.map((step, i) => {
          const stepIdx = WORKSPACE_STATE_ORDER.indexOf(step.id);
          const done = stepIdx < currentIdx;
          const active = step.id === (
            currentState === "result"
              ? "result"
              : currentState === "analyzing"
                ? "analyzing"
                : currentState === "preview"
                  ? "preview"
                  : "upload"
          );

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] transition-all duration-300"
                  style={{
                    background: done ? "#16a34a" : active ? "#1447a0" : "#e2e8f0",
                    color: done || active ? "white" : "#94a3b8",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l2.5 2.5L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className="text-[13px] hidden sm:block"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#0f172a" : done ? "#16a34a" : "#94a3b8",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < WORKSPACE_STEPS.length - 1 && (
                <div
                  className="flex-1 h-px mx-3"
                  style={{ background: done ? "#86efac" : "#e2e8f0" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
