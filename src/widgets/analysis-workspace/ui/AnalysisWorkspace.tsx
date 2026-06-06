import { ErrorStateDemo, ErrorStep } from "@/features/analysis-error";
import { PreviewStep } from "@/features/image-preview";
import { UploadStep } from "@/features/image-upload";
import { AnalyzingStep, useAnalysisWorkflow } from "@/features/run-analysis";
import { ResultStep } from "@/features/report-download";
import { useCallback, useRef, useState } from "react";
import { WorkspaceStepper } from "./WorkspaceStepper";

interface AnalysisWorkspaceProps {
  workspaceRef: React.RefObject<HTMLElement | null>;
}

function getHealthStyles(tone: "mock" | "healthy" | "checking" | "unavailable") {
  switch (tone) {
    case "healthy":
      return {
        background: "#f0fdf4",
        border: "#86efac",
        color: "#166534",
      };
    case "checking":
      return {
        background: "#eff6ff",
        border: "#93c5fd",
        color: "#1d4ed8",
      };
    case "unavailable":
      return {
        background: "#fff7ed",
        border: "#fdba74",
        color: "#c2410c",
      };
    case "mock":
    default:
      return {
        background: "#f8fafc",
        border: "#cbd5e1",
        color: "#475569",
      };
  }
}

export function AnalysisWorkspace({ workspaceRef }: AnalysisWorkspaceProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    analysisStage,
    backendHealth,
    currentStep,
    downloadErrorMessage,
    errorMessage,
    errorType,
    fileName,
    fileSize,
    handleDownloadReport,
    isConsentAccepted,
    isDownloadingReport,
    previewUrl,
    processFile,
    progress,
    resetAll,
    setIsConsentAccepted,
    simulateError,
    startAnalysis,
    workspaceState,
  } = useAnalysisWorkflow();

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }

    event.target.value = "";
  }, [processFile]);

  const healthStyles = getHealthStyles(backendHealth.tone);
  const startHint = !isConsentAccepted
    ? "Подтвердите согласие на обработку персональных данных, чтобы начать анализ."
    : !backendHealth.isAvailable
      ? backendHealth.description
      : null;

  return (
    <section
      id="workspace"
      ref={workspaceRef as React.RefObject<HTMLElement>}
      className="py-24"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
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
            Рабочее пространство
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
            Анализ изображения
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "#64748b",
            }}
          >
            Загрузите изображение и получите результат анализа
          </p>
        </div>

        <div
          className="max-w-[860px] mx-auto rounded-2xl px-4 py-3 mb-5 text-[14px]"
          style={{
            background: healthStyles.background,
            border: `1px solid ${healthStyles.border}`,
            color: healthStyles.color,
            fontFamily: "var(--font-body)",
          }}
        >
          {backendHealth.description}
        </div>

        <div
          className="max-w-[860px] mx-auto rounded-3xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 4px 40px rgba(20,71,160,0.08), 0 1px 8px rgba(15,23,42,0.06)",
            border: "1px solid rgba(15,23,42,0.07)",
          }}
        >
          <WorkspaceStepper currentState={workspaceState} />

          <div className="p-8 lg:p-10">
            {(currentStep === "idle" || currentStep === "uploading") && (
              <UploadStep
                dragOver={dragOver}
                fileInputRef={fileInputRef}
                onDrop={handleDrop}
                onFileInput={handleFileInput}
                setDragOver={setDragOver}
              />
            )}

            {currentStep === "preview" && previewUrl && (
              <PreviewStep
                consentChecked={isConsentAccepted}
                fileInputRef={fileInputRef}
                fileName={fileName}
                fileSize={fileSize}
                isStartDisabled={!isConsentAccepted || !backendHealth.isAvailable}
                onConsentChange={setIsConsentAccepted}
                onFileInput={handleFileInput}
                onRemove={resetAll}
                onReplace={() => fileInputRef.current?.click()}
                onStartAnalysis={startAnalysis}
                preview={previewUrl}
                startHint={startHint}
              />
            )}

            {currentStep === "analyzing" && (
              <AnalyzingStep progress={progress} stage={analysisStage} />
            )}

            {currentStep === "success" && (
              <ResultStep
                downloadErrorMessage={downloadErrorMessage}
                isDownloadingReport={isDownloadingReport}
                onDownload={handleDownloadReport}
                onReset={resetAll}
              />
            )}

            {currentStep === "error" && (
              <ErrorStep
                errorMessage={errorMessage}
                errorType={errorType}
                onReset={resetAll}
              />
            )}
          </div>

          {(currentStep === "idle" || currentStep === "preview" || currentStep === "uploading") && (
            <ErrorStateDemo onSelect={simulateError} />
          )}
        </div>
      </div>
    </section>
  );
}
