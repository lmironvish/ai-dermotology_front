import { env } from "@/app/config/env";
import { ANALYSIS_ERROR_CONTENT, ANALYSIS_TIMELINE, useAnalysisStore } from "@/entities/analysis";
import type { AnalysisStoreStep, ErrorType, WorkspaceState } from "@/entities/analysis";
import { formatImageFileSize, validateImageFile } from "@/entities/image";
import { ApiError } from "@/shared/api/http";
import { toast } from "sonner";
import {
  getCaseErrorMessage,
  isCaseAnalysisCompleted,
  isCaseAnalysisFailed,
  isSimpleAnalysisFailure,
  isSimpleAnalysisSuccess,
  normalizeStatus,
} from "./status";
import { useAnalysisStatusQuery } from "./useAnalysisStatusQuery";
import { useAnalyzeImageMutation } from "./useAnalyzeImageMutation";
import { useBackendHealthQuery } from "./useBackendHealthQuery";
import { useCaseAnalysisStatusQuery } from "./useCaseAnalysisStatusQuery";
import { useDownloadAnalysisPdfMutation } from "./useDownloadAnalysisPdfMutation";
import { useStartCaseAnalysisMutation } from "./useStartCaseAnalysisMutation";
import { useUploadAnalysisMutation } from "./useUploadAnalysisMutation";
import { useCallback, useEffect, useRef, useState } from "react";

const REPORT_FILE_NAME = "dermatology-analysis-report.pdf";

type BackendHealthTone = "mock" | "healthy" | "checking" | "unavailable";

interface BackendHealthState {
  description: string;
  isAvailable: boolean;
  tone: BackendHealthTone;
}

function resolveSimpleAnalysisStage(progress: number): number {
  if (progress >= 100) {
    return 3;
  }

  if (progress >= 60) {
    return 2;
  }

  if (progress > 0) {
    return 1;
  }

  return 0;
}

function resolveCaseAnalysisStage(status: string | null | undefined): number {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "completed" || normalizedStatus === "ready" || normalizedStatus === "success") {
    return 3;
  }

  if (normalizedStatus === "analyzing" || normalizedStatus === "processing") {
    return 2;
  }

  if (normalizedStatus) {
    return 1;
  }

  return 0;
}

function resolveCaseProgress(status: string | null | undefined): number {
  const stage = resolveCaseAnalysisStage(status);

  if (stage === 3) {
    return 100;
  }

  if (stage === 2) {
    return 65;
  }

  if (stage === 1) {
    return 30;
  }

  return 0;
}

function mapStoreStepToWorkspaceState(currentStep: AnalysisStoreStep): WorkspaceState {
  switch (currentStep) {
    case "preview":
      return "preview";
    case "analyzing":
      return "analyzing";
    case "success":
      return "result";
    case "error":
      return "error";
    case "idle":
    case "uploading":
    default:
      return "upload";
  }
}

function resolveDownloadErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return "Сервер временно недоступен. Попробуйте скачать отчёт позже.";
    }

    if (error.status >= 400) {
      return "PDF-отчёт пока недоступен для скачивания. Повторите попытку через минуту.";
    }
  }

  if (error instanceof TypeError) {
    return "Не удалось скачать отчёт из-за ошибки сети. Проверьте подключение и попробуйте снова.";
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("fetch") || message.includes("network")) {
      return "Не удалось скачать отчёт из-за ошибки сети. Проверьте подключение и попробуйте снова.";
    }

    if (message.includes("timed out")) {
      return "Скачивание PDF заняло слишком много времени. Попробуйте ещё раз.";
    }

    return error.message;
  }

  return "Не удалось скачать PDF-отчёт.";
}

function resolveBackendHealthState(params: {
  apiBaseUrl: string;
  healthError: unknown;
  isMockAnalysisFlow: boolean;
  isRealAnalysisFlow: boolean;
  isChecking: boolean;
  statusText: string | undefined;
}): BackendHealthState {
  const { apiBaseUrl, healthError, isChecking, isMockAnalysisFlow, isRealAnalysisFlow, statusText } = params;

  if (isMockAnalysisFlow) {
    return {
      tone: "mock",
      isAvailable: true,
      description: "Mock mode: анализ работает без backend.",
    };
  }

  if (isRealAnalysisFlow && !apiBaseUrl) {
    return {
      tone: "unavailable",
      isAvailable: false,
      description: "Backend не настроен: укажите VITE_API_BASE_URL.",
    };
  }

  if (isChecking) {
    return {
      tone: "checking",
      isAvailable: false,
      description: "Проверяем доступность backend...",
    };
  }

  if (healthError) {
    return {
      tone: "unavailable",
      isAvailable: false,
      description: "Backend недоступен. Проверьте API и подключение к сети.",
    };
  }

  if (statusText) {
    return {
      tone: "healthy",
      isAvailable: true,
      description: `Backend доступен${statusText ? ` (${statusText})` : ""}.`,
    };
  }

  return {
    tone: "healthy",
    isAvailable: true,
    description: "Backend доступен.",
  };
}

export function useAnalysisWorkflow() {
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState<string | null>(null);
  const timerRefs = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const analysisRunIdRef = useRef(0);

  const selectedFile = useAnalysisStore((state) => state.selectedFile);
  const previewUrl = useAnalysisStore((state) => state.previewUrl);
  const currentStep = useAnalysisStore((state) => state.currentStep);
  const errorMessage = useAnalysisStore((state) => state.errorMessage);
  const reportUrl = useAnalysisStore((state) => state.reportUrl);
  const setCurrentStep = useAnalysisStore((state) => state.setCurrentStep);
  const setErrorMessage = useAnalysisStore((state) => state.setErrorMessage);
  const setReportUrl = useAnalysisStore((state) => state.setReportUrl);
  const setFilePreview = useAnalysisStore((state) => state.setFilePreview);
  const clearFilePreview = useAnalysisStore((state) => state.clearFilePreview);
  const setAnalysisError = useAnalysisStore((state) => state.setAnalysisError);
  const resetAnalysis = useAnalysisStore((state) => state.resetAnalysis);

  const isMockAnalysisFlow = env.analysisApiMode === "mock";
  const isRealAnalysisFlow = env.analysisApiMode === "real";
  const isSimpleAnalysisFlow =
    env.analysisApiMode === "real" && env.analysisApiBackend === "simple";
  const isCaseAnalysisFlow =
    env.analysisApiMode === "real" && env.analysisApiBackend === "cases";

  const analyzeImageMutation = useAnalyzeImageMutation();
  const uploadAnalysisMutation = useUploadAnalysisMutation();
  const startCaseAnalysisMutation = useStartCaseAnalysisMutation();
  const downloadAnalysisPdfMutation = useDownloadAnalysisPdfMutation();
  const backendHealthQuery = useBackendHealthQuery();

  const simpleAnalysisStatusQuery = useAnalysisStatusQuery(analysisId, {
    enabled: isSimpleAnalysisFlow && currentStep === "analyzing",
    poll: true,
  });
  const caseAnalysisStatusQuery = useCaseAnalysisStatusQuery(analysisId, {
    enabled: isCaseAnalysisFlow && currentStep === "analyzing",
    poll: true,
  });

  const workspaceState = mapStoreStepToWorkspaceState(currentStep);
  const fileName = selectedFile?.name ?? "";
  const fileSize = selectedFile ? formatImageFileSize(selectedFile.size) : "";
  const backendHealth = resolveBackendHealthState({
    apiBaseUrl: env.apiBaseUrl,
    healthError: backendHealthQuery.error,
    isMockAnalysisFlow,
    isRealAnalysisFlow,
    isChecking: backendHealthQuery.isLoading || backendHealthQuery.isFetching,
    statusText: backendHealthQuery.data?.status,
  });

  const revokeObjectUrl = useCallback((url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach((timer) => clearTimeout(timer));
    timerRefs.current = [];
  }, []);

  const startTimelineProgress = useCallback(() => {
    clearTimers();

    ANALYSIS_TIMELINE
      .filter(({ progress: nextProgress }) => nextProgress < 100)
      .forEach(({ delay, stage, progress: timelineProgress }) => {
        const timer = setTimeout(() => {
          setAnalysisStage(stage);
          setProgress(timelineProgress);
        }, delay);

        timerRefs.current.push(timer);
      });
  }, [clearTimers]);

  const resetAll = useCallback(() => {
    analysisRunIdRef.current += 1;
    revokeObjectUrl(previewUrl);
    revokeObjectUrl(reportUrl);
    setAnalysisId(null);
    setIsConsentAccepted(false);
    setDownloadErrorMessage(null);
    clearFilePreview();
    resetAnalysis();
    setProgress(0);
    setAnalysisStage(0);
    setErrorType(null);
    clearTimers();
  }, [
    clearFilePreview,
    clearTimers,
    previewUrl,
    reportUrl,
    resetAnalysis,
    revokeObjectUrl,
  ]);

  useEffect(() => {
    return () => {
      const {
        previewUrl: currentPreviewUrl,
        reportUrl: currentReportUrl,
        resetAnalysis: resetStore,
      } = useAnalysisStore.getState();

      revokeObjectUrl(currentPreviewUrl);
      revokeObjectUrl(currentReportUrl);
      clearTimers();
      analysisRunIdRef.current += 1;
      resetStore();
    };
  }, [clearTimers, revokeObjectUrl]);

  const processFile = useCallback((file: File) => {
    const validationError = validateImageFile(file);

    if (validationError) {
      setErrorType(validationError);
      revokeObjectUrl(reportUrl);
      setAnalysisId(null);
      setReportUrl(null);
      setAnalysisError(ANALYSIS_ERROR_CONTENT[validationError].desc);
      return;
    }

    setErrorType(null);
    setCurrentStep("uploading");
    setErrorMessage(null);
    setIsConsentAccepted(false);
    setDownloadErrorMessage(null);
    revokeObjectUrl(reportUrl);
    setAnalysisId(null);
    setReportUrl(null);
    revokeObjectUrl(previewUrl);
    clearFilePreview();

    const nextPreviewUrl = URL.createObjectURL(file);
    setFilePreview(file, nextPreviewUrl);
    setCurrentStep("preview");
  }, [
    clearFilePreview,
    previewUrl,
    reportUrl,
    revokeObjectUrl,
    setAnalysisError,
    setCurrentStep,
    setErrorMessage,
    setFilePreview,
    setReportUrl,
  ]);

  const startAnalysis = useCallback(async () => {
    if (!selectedFile) {
      setErrorType(null);
      setAnalysisError("Сначала выберите изображение для анализа.");
      return;
    }

    if (!isConsentAccepted) {
      setErrorType(null);
      setAnalysisError("Подтвердите согласие на обработку персональных данных.");
      return;
    }

    if (!backendHealth.isAvailable) {
      setErrorType("server");
      setAnalysisError(backendHealth.description);
      return;
    }

    clearTimers();
    analysisRunIdRef.current += 1;
    const currentRunId = analysisRunIdRef.current;
    setErrorType(null);
    setCurrentStep("analyzing");
    setErrorMessage(null);
    setDownloadErrorMessage(null);
    revokeObjectUrl(reportUrl);
    setAnalysisId(null);
    setReportUrl(null);
    setProgress(0);
    setAnalysisStage(0);
    startTimelineProgress();

    try {
      if (isSimpleAnalysisFlow) {
        const uploadResult = await uploadAnalysisMutation.mutateAsync(selectedFile);

        if (analysisRunIdRef.current !== currentRunId) {
          return;
        }

        setAnalysisId(uploadResult.id);
        setProgress((currentProgress) => Math.max(currentProgress, 30));
        setAnalysisStage(1);
        return;
      }

      if (isCaseAnalysisFlow) {
        const caseResult = await startCaseAnalysisMutation.mutateAsync(selectedFile);

        if (analysisRunIdRef.current !== currentRunId) {
          return;
        }

        setAnalysisId(caseResult.caseId);
        setProgress((currentProgress) => Math.max(currentProgress, 30));
        setAnalysisStage(1);
        return;
      }

      if (isMockAnalysisFlow) {
        const result = await analyzeImageMutation.mutateAsync(selectedFile);

        if (analysisRunIdRef.current !== currentRunId) {
          revokeObjectUrl(result.reportUrl);
          return;
        }

        clearTimers();
        setAnalysisId(result.caseId);
        setAnalysisStage(3);
        setProgress(100);
        setReportUrl(result.reportUrl);
        setCurrentStep("success");
      }
    } catch (error) {
      if (analysisRunIdRef.current !== currentRunId) {
        return;
      }

      clearTimers();
      setErrorType("server");
      setAnalysisError(
        error instanceof Error ? error.message : ANALYSIS_ERROR_CONTENT.server.desc,
      );
    }
  }, [
    analyzeImageMutation,
    backendHealth,
    clearTimers,
    isConsentAccepted,
    isCaseAnalysisFlow,
    isMockAnalysisFlow,
    isSimpleAnalysisFlow,
    reportUrl,
    revokeObjectUrl,
    selectedFile,
    setAnalysisError,
    setCurrentStep,
    setErrorMessage,
    setReportUrl,
    startCaseAnalysisMutation,
    startTimelineProgress,
    uploadAnalysisMutation,
  ]);

  const handleDownloadReport = useCallback(async () => {
    try {
      setDownloadErrorMessage(null);

      const reportBlob = await downloadAnalysisPdfMutation.mutateAsync({
        analysisId,
        reportUrl,
      });

      const downloadUrl = URL.createObjectURL(reportBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = REPORT_FILE_NAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);

      toast.success("PDF-отчёт скачан", {
        description: REPORT_FILE_NAME,
      });
    } catch (error) {
      const message = resolveDownloadErrorMessage(error);
      setDownloadErrorMessage(message);
      toast.error("Не удалось скачать отчёт", {
        description: message,
      });
    }
  }, [analysisId, downloadAnalysisPdfMutation, reportUrl]);

  useEffect(() => {
    if (!isSimpleAnalysisFlow || currentStep !== "analyzing" || !analysisId) {
      return;
    }

    if (simpleAnalysisStatusQuery.error) {
      clearTimers();
      setErrorType("server");
      setAnalysisError(
        simpleAnalysisStatusQuery.error instanceof Error
          ? simpleAnalysisStatusQuery.error.message
          : ANALYSIS_ERROR_CONTENT.server.desc,
      );
      return;
    }

    const nextProgress = simpleAnalysisStatusQuery.data?.progress;
    if (typeof nextProgress === "number") {
      const normalizedProgress = Math.max(0, Math.min(100, Math.round(nextProgress)));
      setProgress(normalizedProgress);
      setAnalysisStage(resolveSimpleAnalysisStage(normalizedProgress));
    }

    if (isSimpleAnalysisFailure(simpleAnalysisStatusQuery.data?.status)) {
      clearTimers();
      setErrorType("server");
      setAnalysisError(
        simpleAnalysisStatusQuery.data?.errorMessage ?? ANALYSIS_ERROR_CONTENT.server.desc,
      );
      return;
    }

    if (isSimpleAnalysisSuccess(simpleAnalysisStatusQuery.data?.status)) {
      clearTimers();
      setAnalysisStage(3);
      setProgress(100);
      setCurrentStep("success");
    }
  }, [
    analysisId,
    clearTimers,
    currentStep,
    isSimpleAnalysisFlow,
    setAnalysisError,
    setCurrentStep,
    simpleAnalysisStatusQuery.data,
    simpleAnalysisStatusQuery.error,
  ]);

  useEffect(() => {
    if (!isCaseAnalysisFlow || currentStep !== "analyzing" || !analysisId) {
      return;
    }

    if (caseAnalysisStatusQuery.error) {
      clearTimers();
      setErrorType("server");
      setAnalysisError(
        caseAnalysisStatusQuery.error instanceof Error
          ? caseAnalysisStatusQuery.error.message
          : ANALYSIS_ERROR_CONTENT.server.desc,
      );
      return;
    }

    const caseData = caseAnalysisStatusQuery.data;
    const caseStatus = caseData?.analysis?.status ?? caseData?.status;

    if (caseStatus) {
      setProgress(resolveCaseProgress(caseStatus));
      setAnalysisStage(resolveCaseAnalysisStage(caseStatus));
    }

    if (isCaseAnalysisFailed(caseData)) {
      clearTimers();
      setErrorType("server");
      setAnalysisError(getCaseErrorMessage(caseData) ?? ANALYSIS_ERROR_CONTENT.server.desc);
      return;
    }

    if (isCaseAnalysisCompleted(caseData)) {
      clearTimers();
      setAnalysisStage(3);
      setProgress(100);
      setCurrentStep("success");
    }
  }, [
    analysisId,
    caseAnalysisStatusQuery.data,
    caseAnalysisStatusQuery.error,
    clearTimers,
    currentStep,
    isCaseAnalysisFlow,
    setAnalysisError,
    setCurrentStep,
  ]);

  const simulateError = useCallback((type: ErrorType) => {
    setErrorType(type);
    setAnalysisError(ANALYSIS_ERROR_CONTENT[type].desc);
  }, [setAnalysisError]);

  return {
    backendHealth,
    currentStep,
    downloadErrorMessage,
    errorMessage,
    errorType,
    fileName,
    fileSize,
    isConsentAccepted,
    isDownloadingReport: downloadAnalysisPdfMutation.isPending,
    previewUrl,
    progress,
    workspaceState,
    analysisStage,
    handleDownloadReport,
    setIsConsentAccepted,
    processFile,
    resetAll,
    simulateError,
    startAnalysis,
  };
}
