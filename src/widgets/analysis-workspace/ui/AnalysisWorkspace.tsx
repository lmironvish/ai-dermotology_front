import { ErrorStep } from "@/features/analysis-error";
import { PreviewStep } from "@/features/image-preview";
import { UploadStep } from "@/features/image-upload";
import { AnalyzingStep, useAnalysisWorkflow } from "@/features/run-analysis";
import { ResultStep } from "@/features/report-download";
import { useCallback, useRef, useState } from "react";
import { WorkspaceStepper } from "./WorkspaceStepper";

interface AnalysisWorkspaceProps {
  workspaceRef: React.RefObject<HTMLElement | null>;
}

function getHealthStyles(tone: "mock" | "healthy" | "checking" | "warning" | "unavailable") {
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
    case "warning":
      return {
        background: "#fff7ed",
        border: "#fdba74",
        color: "#c2410c",
      };
    case "unavailable":
      return {
        background: "#fff1f2",
        border: "#fda4af",
        color: "#be123c",
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
    canSendReportToEmail,
    canStartAnalysis,
    currentStep,
    downloadErrorMessage,
    emailAddress,
    emailErrorMessage,
    emailSuccessMessage,
    errorMessage,
    errorType,
    fileName,
    fileSize,
    formData,
    handleDownloadReport,
    handleFormFieldChange,
    handleSendReportToEmail,
    isDownloadingReport,
    isSendingReportToEmail,
    previewUrl,
    processFile,
    progress,
    removeSelectedFile,
    resetAll,
    startAnalysis,
    startHint,
    validationErrors,
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
            Заполните данные, загрузите изображение и получите PDF-отчёт по результатам анализа.
          </p>
        </div>

        <div
          className="max-w-[980px] mx-auto rounded-2xl px-4 py-3 mb-5 text-[14px]"
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
          className="max-w-[980px] mx-auto rounded-3xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 4px 40px rgba(20,71,160,0.08), 0 1px 8px rgba(15,23,42,0.06)",
            border: "1px solid rgba(15,23,42,0.07)",
          }}
        >
          <WorkspaceStepper currentState={workspaceState} />

          <div className="p-8 lg:p-10">
            {currentStep === "idle" && (
              <UploadStep
                dragOver={dragOver}
                fileInputRef={fileInputRef}
                formData={formData}
                onDrop={handleDrop}
                onFieldChange={handleFormFieldChange}
                onFileInput={handleFileInput}
                setDragOver={setDragOver}
                validationErrors={validationErrors}
              />
            )}

            {currentStep === "preview" && previewUrl && (
              <PreviewStep
                fileInputRef={fileInputRef}
                fileName={fileName}
                fileSize={fileSize}
                formData={formData}
                isStartDisabled={!canStartAnalysis}
                onFieldChange={handleFormFieldChange}
                onFileInput={handleFileInput}
                onRemove={removeSelectedFile}
                onReplace={() => fileInputRef.current?.click()}
                onStartAnalysis={startAnalysis}
                preview={previewUrl}
                startHint={startHint}
                validationErrors={validationErrors}
              />
            )}

            {(currentStep === "creating_case" ||
              currentStep === "uploading" ||
              currentStep === "analyzing" ||
              currentStep === "generating_pdf") && (
              <AnalyzingStep
                progress={progress}
                stage={analysisStage}
                step={currentStep}
              />
            )}

            {currentStep === "success" && (
              <ResultStep
                canSendReportToEmail={canSendReportToEmail}
                downloadErrorMessage={downloadErrorMessage}
                emailAddress={emailAddress}
                emailErrorMessage={emailErrorMessage}
                emailSuccessMessage={emailSuccessMessage}
                isDownloadingReport={isDownloadingReport}
                isSendingReportToEmail={isSendingReportToEmail}
                onDownload={handleDownloadReport}
                onReset={resetAll}
                onSendToEmail={handleSendReportToEmail}
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
        </div>
      </div>
    </section>
  );
}
