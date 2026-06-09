import { env } from "@/app/config/env";
import {
  ANALYSIS_ERROR_CONTENT,
  useAnalysisStore,
  validateAnalysisForm,
  type AnalysisFormData,
  type AnalysisFormErrors,
  type AnalysisStoreStep,
  type ErrorType,
  type WorkspaceState,
} from "@/entities/analysis";
import { formatImageFileSize, validateImageFile } from "@/entities/image";
import { ApiError } from "@/shared/api/http";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { extractCaseId } from "../api/caseApi";
import type { CaseCreatePayload, CaseDto } from "../api/caseApi.types";
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
import { useCreateCaseMutation } from "./useCreateCaseMutation";
import { useDownloadAnalysisPdfMutation } from "./useDownloadAnalysisPdfMutation";
import { useGenerateCasePdfMutation } from "./useGenerateCasePdfMutation";
import { useSendCaseReportEmailMutation } from "./useSendCaseReportEmailMutation";
import { useStartCaseAnalysisMutation } from "./useStartCaseAnalysisMutation";
import { useUploadAnalysisMutation } from "./useUploadAnalysisMutation";
import { useUploadCaseImageMutation } from "./useUploadCaseImageMutation";

const REPORT_FILE_NAME = "dermatology-analysis-report.pdf";

type BackendHealthTone = "mock" | "healthy" | "checking" | "warning" | "unavailable";

interface BackendHealthState {
  canStartAnalysis: boolean;
  description: string;
  tone: BackendHealthTone;
}

function mapStoreStepToWorkspaceState(currentStep: AnalysisStoreStep): WorkspaceState {
  switch (currentStep) {
    case "preview":
      return "preview";
    case "creating_case":
    case "uploading":
    case "analyzing":
    case "generating_pdf":
      return "analyzing";
    case "success":
      return "result";
    case "error":
      return "error";
    case "idle":
    default:
      return "upload";
  }
}

function resolveCaseProgress(caseData: CaseDto | null | undefined): { progress: number; stage: number } {
  const normalizedCaseStatus = normalizeStatus(caseData?.status);
  const normalizedAnalysisStatus = normalizeStatus(caseData?.analysis?.status);
  const status = normalizedAnalysisStatus || normalizedCaseStatus;

  if (status === "completed" || status === "ready" || status === "success" || status === "succeeded") {
    return { progress: 88, stage: 2 };
  }

  if (status === "analyzing" || status === "processing") {
    return { progress: 72, stage: 1 };
  }

  if (status === "queued" || status === "submitted" || status === "uploading" || status === "draft") {
    return { progress: 45, stage: 0 };
  }

  return { progress: 40, stage: 0 };
}

function resolveBackendHealthState(params: {
  apiBaseUrl: string;
  healthError: unknown;
  isChecking: boolean;
  isMockAnalysisFlow: boolean;
  isRealAnalysisFlow: boolean;
  statusText: string | undefined;
}): BackendHealthState {
  const { apiBaseUrl, healthError, isChecking, isMockAnalysisFlow, isRealAnalysisFlow, statusText } = params;

  if (isMockAnalysisFlow) {
    return {
      canStartAnalysis: true,
      tone: "mock",
      description: "Mock-режим включён: анализ работает без backend API.",
    };
  }

  if (isRealAnalysisFlow && !apiBaseUrl) {
    return {
      canStartAnalysis: false,
      tone: "unavailable",
      description: "Не задан адрес backend API. Укажите VITE_API_BASE_URL.",
    };
  }

  if (healthError) {
    return {
      canStartAnalysis: true,
      tone: "warning",
      description: "Не удалось проверить health backend. Анализ всё равно доступен, если основные endpoints отвечают.",
    };
  }

  if (isChecking) {
    return {
      canStartAnalysis: true,
      tone: "checking",
      description: "Проверяем состояние backend. Анализ можно запускать параллельно.",
    };
  }

  if (statusText) {
    return {
      canStartAnalysis: true,
      tone: "healthy",
      description: `Backend доступен${statusText ? ` (${statusText})` : ""}.`,
    };
  }

  return {
    canStartAnalysis: true,
    tone: "healthy",
    description: "Backend подключён.",
  };
}

function buildCaseCreatePayload(formData: AnalysisFormData): CaseCreatePayload {
  return {
    age_years: Number(formData.ageYears.trim()),
    sex: formData.sex,
    anatomical_location: formData.anatomicalLocation,
    consent_personal_data: true,
    consent_image_processing: true,
    consent_email_report: formData.consentEmailReport,
    policy_version: formData.policyVersion,
    ...(formData.consentEmailReport
      ? { contact_email: formData.contactEmail.trim() }
      : {}),
  };
}

function resolveApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiError) {
    const details = error.details;

    if (typeof details === "string" && details.trim()) {
      return details;
    }

    if (details && typeof details === "object") {
      const record = details as Record<string, unknown>;
      const detail = record.detail;
      const title = record.title;
      const message = record.message;

      if (typeof detail === "string" && detail.trim()) {
        return detail;
      }

      if (typeof title === "string" && title.trim()) {
        return title;
      }

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (error.status >= 500) {
      return "Сервер временно недоступен. Попробуйте ещё раз немного позже.";
    }

    if (error.status >= 400) {
      return fallbackMessage;
    }
  }

  if (error instanceof TypeError) {
    return "Не удалось выполнить запрос из-за ошибки сети. Проверьте подключение к интернету.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

function resolveDownloadErrorMessage(error: unknown): string {
  return resolveApiErrorMessage(
    error,
    "Не удалось скачать PDF-отчёт. Попробуйте ещё раз через минуту.",
  );
}

export function useAnalysisWorkflow() {
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState<string | null>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
  const runIdRef = useRef(0);
  const generatedPdfCaseIdRef = useRef<string | null>(null);

  const selectedFile = useAnalysisStore((state) => state.selectedFile);
  const previewUrl = useAnalysisStore((state) => state.previewUrl);
  const currentStep = useAnalysisStore((state) => state.currentStep);
  const formData = useAnalysisStore((state) => state.formData);
  const caseId = useAnalysisStore((state) => state.caseId);
  const errorMessage = useAnalysisStore((state) => state.errorMessage);
  const validationErrors = useAnalysisStore((state) => state.validationErrors);
  const reportUrl = useAnalysisStore((state) => state.reportUrl);
  const setCurrentStep = useAnalysisStore((state) => state.setCurrentStep);
  const updateFormData = useAnalysisStore((state) => state.updateFormData);
  const setCaseId = useAnalysisStore((state) => state.setCaseId);
  const setErrorMessage = useAnalysisStore((state) => state.setErrorMessage);
  const setValidationErrors = useAnalysisStore((state) => state.setValidationErrors);
  const clearValidationErrors = useAnalysisStore((state) => state.clearValidationErrors);
  const setReportUrl = useAnalysisStore((state) => state.setReportUrl);
  const setFilePreview = useAnalysisStore((state) => state.setFilePreview);
  const clearFilePreview = useAnalysisStore((state) => state.clearFilePreview);
  const setAnalysisError = useAnalysisStore((state) => state.setAnalysisError);
  const resetWorkflow = useAnalysisStore((state) => state.resetWorkflow);

  const isMockAnalysisFlow = env.analysisApiMode === "mock";
  const isSimpleAnalysisFlow =
    env.analysisApiMode === "real" && env.analysisApiBackend === "simple";
  const isCaseAnalysisFlow =
    env.analysisApiMode === "real" && env.analysisApiBackend === "cases";
  const isRealAnalysisFlow = env.analysisApiMode === "real";

  const analyzeImageMutation = useAnalyzeImageMutation();
  const uploadAnalysisMutation = useUploadAnalysisMutation();
  const createCaseMutation = useCreateCaseMutation();
  const uploadCaseImageMutation = useUploadCaseImageMutation();
  const startCaseAnalysisMutation = useStartCaseAnalysisMutation();
  const generateCasePdfMutation = useGenerateCasePdfMutation();
  const downloadAnalysisPdfMutation = useDownloadAnalysisPdfMutation();
  const sendCaseReportEmailMutation = useSendCaseReportEmailMutation();
  const backendHealthQuery = useBackendHealthQuery();

  const simpleAnalysisStatusQuery = useAnalysisStatusQuery(caseId, {
    enabled: isSimpleAnalysisFlow && currentStep === "analyzing",
    poll: true,
  });
  const caseAnalysisStatusQuery = useCaseAnalysisStatusQuery(caseId, {
    enabled: isCaseAnalysisFlow && currentStep === "analyzing",
    poll: true,
  });

  const formValidation = validateAnalysisForm(formData);
  const fileName = selectedFile?.name ?? "";
  const fileSize = selectedFile ? formatImageFileSize(selectedFile.size) : "";
  const workspaceState = mapStoreStepToWorkspaceState(currentStep);
  const backendHealth = resolveBackendHealthState({
    apiBaseUrl: env.apiBaseUrl,
    healthError: backendHealthQuery.error,
    isChecking: backendHealthQuery.isLoading || backendHealthQuery.isFetching,
    isMockAnalysisFlow,
    isRealAnalysisFlow,
    statusText: backendHealthQuery.data?.status,
  });
  const canStartAnalysis = Boolean(selectedFile) && formValidation.isValid && backendHealth.canStartAnalysis;
  const startHint = formValidation.firstError ?? (!backendHealth.canStartAnalysis ? backendHealth.description : null);

  const revokeObjectUrl = useCallback((url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const resetTransientState = useCallback(() => {
    generatedPdfCaseIdRef.current = null;
    setProgress(0);
    setAnalysisStage(0);
    setErrorType(null);
    setDownloadErrorMessage(null);
    setEmailErrorMessage(null);
    setEmailSuccessMessage(null);
  }, []);

  const resetAll = useCallback(() => {
    runIdRef.current += 1;
    resetTransientState();
    revokeObjectUrl(previewUrl);
    revokeObjectUrl(reportUrl);
    resetWorkflow();
  }, [previewUrl, reportUrl, resetTransientState, resetWorkflow, revokeObjectUrl]);

  const removeSelectedFile = useCallback(() => {
    runIdRef.current += 1;
    resetTransientState();
    revokeObjectUrl(previewUrl);
    revokeObjectUrl(reportUrl);
    clearFilePreview();
    setCaseId(null);
    setReportUrl(null);
    setErrorMessage(null);
    setCurrentStep("idle");
  }, [
    clearFilePreview,
    previewUrl,
    reportUrl,
    resetTransientState,
    revokeObjectUrl,
    setCaseId,
    setCurrentStep,
    setErrorMessage,
    setReportUrl,
  ]);

  useEffect(() => {
    return () => {
      const state = useAnalysisStore.getState();
      revokeObjectUrl(state.previewUrl);
      revokeObjectUrl(state.reportUrl);
      runIdRef.current += 1;
      state.resetWorkflow();
    };
  }, [revokeObjectUrl]);

  const processFile = useCallback((file: File) => {
    const validationError = validateImageFile(file);

    if (validationError) {
      setErrorType(validationError);
      setCaseId(null);
      setReportUrl(null);
      setAnalysisError(ANALYSIS_ERROR_CONTENT[validationError].desc);
      return;
    }

    resetTransientState();
    clearValidationErrors();
    setErrorMessage(null);
    setCaseId(null);
    setReportUrl(null);
    revokeObjectUrl(previewUrl);

    const nextPreviewUrl = URL.createObjectURL(file);
    setFilePreview(file, nextPreviewUrl);
    setCurrentStep("preview");
  }, [
    clearValidationErrors,
    previewUrl,
    resetTransientState,
    revokeObjectUrl,
    setAnalysisError,
    setCaseId,
    setCurrentStep,
    setErrorMessage,
    setFilePreview,
    setReportUrl,
  ]);

  const handleFormFieldChange = useCallback((
    field: keyof AnalysisFormData,
    value: AnalysisFormData[keyof AnalysisFormData],
  ) => {
    if (field === "consentEmailReport" && value === false) {
      updateFormData("contactEmail", "");
    }

    updateFormData(field, value as never);
    clearValidationErrors();
    setErrorMessage(null);
    setEmailErrorMessage(null);
    setEmailSuccessMessage(null);
  }, [clearValidationErrors, setErrorMessage, updateFormData]);

  const startAnalysis = useCallback(async () => {
    if (!selectedFile) {
      setErrorMessage("Сначала загрузите изображение для анализа.");
      return;
    }

    const nextValidation = validateAnalysisForm(formData);
    if (!nextValidation.isValid) {
      setValidationErrors(nextValidation.errors);
      setErrorMessage(nextValidation.firstError);
      return;
    }

    if (!backendHealth.canStartAnalysis) {
      setErrorMessage(backendHealth.description);
      return;
    }

    const currentRunId = runIdRef.current + 1;
    runIdRef.current = currentRunId;
    generatedPdfCaseIdRef.current = null;
    clearValidationErrors();
    setErrorMessage(null);
    setErrorType(null);
    setDownloadErrorMessage(null);
    setEmailErrorMessage(null);
    setEmailSuccessMessage(null);
    revokeObjectUrl(reportUrl);
    setReportUrl(null);
    setCaseId(null);

    try {
      if (isCaseAnalysisFlow) {
        setCurrentStep("creating_case");
        setProgress(12);
        setAnalysisStage(0);

        const caseData = await createCaseMutation.mutateAsync(buildCaseCreatePayload(formData));
        if (runIdRef.current !== currentRunId) {
          return;
        }

        const nextCaseId = extractCaseId(caseData);
        setCaseId(nextCaseId);

        setCurrentStep("uploading");
        setProgress(30);
        await uploadCaseImageMutation.mutateAsync({
          caseId: nextCaseId,
          file: selectedFile,
        });
        if (runIdRef.current !== currentRunId) {
          return;
        }

        setCurrentStep("analyzing");
        setAnalysisStage(0);
        setProgress(45);
        await startCaseAnalysisMutation.mutateAsync(nextCaseId);
        return;
      }

      if (isSimpleAnalysisFlow) {
        setCurrentStep("uploading");
        setProgress(25);
        const uploadResult = await uploadAnalysisMutation.mutateAsync(selectedFile);
        if (runIdRef.current !== currentRunId) {
          return;
        }

        setCaseId(uploadResult.id);
        setCurrentStep("analyzing");
        setAnalysisStage(1);
        setProgress(45);
        return;
      }

      setCurrentStep("analyzing");
      setProgress(35);
      setAnalysisStage(1);
      const result = await analyzeImageMutation.mutateAsync(selectedFile);
      if (runIdRef.current !== currentRunId) {
        revokeObjectUrl(result.reportUrl);
        return;
      }

      setCaseId(result.caseId);
      setReportUrl(result.reportUrl);
      setProgress(100);
      setAnalysisStage(2);
      setCurrentStep("success");
    } catch (error) {
      if (runIdRef.current !== currentRunId) {
        return;
      }

      setErrorType(error instanceof TypeError ? "network" : "server");
      setAnalysisError(resolveApiErrorMessage(error, "Не удалось запустить анализ."));
    }
  }, [
    analyzeImageMutation,
    backendHealth,
    clearValidationErrors,
    createCaseMutation,
    formData,
    isCaseAnalysisFlow,
    isSimpleAnalysisFlow,
    reportUrl,
    revokeObjectUrl,
    selectedFile,
    setAnalysisError,
    setCaseId,
    setCurrentStep,
    setErrorMessage,
    setReportUrl,
    setValidationErrors,
    startCaseAnalysisMutation,
    uploadAnalysisMutation,
    uploadCaseImageMutation,
  ]);

  const handleDownloadReport = useCallback(async () => {
    try {
      setDownloadErrorMessage(null);

      const reportBlob = await downloadAnalysisPdfMutation.mutateAsync({
        analysisId: caseId,
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
  }, [caseId, downloadAnalysisPdfMutation, reportUrl]);

  const handleSendReportToEmail = useCallback(async () => {
    if (!caseId || !formData.consentEmailReport) {
      return;
    }

    try {
      setEmailErrorMessage(null);
      setEmailSuccessMessage(null);

      await sendCaseReportEmailMutation.mutateAsync({
        caseId,
        toEmail: formData.contactEmail.trim(),
      });

      const successMessage = `Отчёт поставлен в очередь на отправку: ${formData.contactEmail.trim()}`;
      setEmailSuccessMessage(successMessage);
      toast.success("Отчёт отправляется на email", {
        description: formData.contactEmail.trim(),
      });
    } catch (error) {
      const message = resolveApiErrorMessage(
        error,
        "Не удалось отправить PDF-отчёт на указанный email.",
      );
      setEmailErrorMessage(message);
      toast.error("Ошибка отправки на email", {
        description: message,
      });
    }
  }, [caseId, formData.contactEmail, formData.consentEmailReport, sendCaseReportEmailMutation]);

  useEffect(() => {
    if (!isSimpleAnalysisFlow || currentStep !== "analyzing" || !caseId) {
      return;
    }

    if (simpleAnalysisStatusQuery.error) {
      setErrorType(simpleAnalysisStatusQuery.error instanceof TypeError ? "network" : "server");
      setAnalysisError(
        resolveApiErrorMessage(
          simpleAnalysisStatusQuery.error,
          "Не удалось получить статус анализа.",
        ),
      );
      return;
    }

    const nextProgress = simpleAnalysisStatusQuery.data?.progress;
    if (typeof nextProgress === "number") {
      const normalizedProgress = Math.max(0, Math.min(100, Math.round(nextProgress)));
      setProgress(normalizedProgress);
      setAnalysisStage(normalizedProgress >= 100 ? 2 : normalizedProgress >= 60 ? 1 : 0);
    }

    if (isSimpleAnalysisFailure(simpleAnalysisStatusQuery.data?.status)) {
      setErrorType("server");
      setAnalysisError(
        simpleAnalysisStatusQuery.data?.errorMessage ?? "Backend вернул ошибку анализа.",
      );
      return;
    }

    if (isSimpleAnalysisSuccess(simpleAnalysisStatusQuery.data?.status)) {
      setProgress(100);
      setAnalysisStage(2);
      setCurrentStep("success");
    }
  }, [
    caseId,
    currentStep,
    isSimpleAnalysisFlow,
    setAnalysisError,
    setCurrentStep,
    simpleAnalysisStatusQuery.data,
    simpleAnalysisStatusQuery.error,
  ]);

  useEffect(() => {
    if (!isCaseAnalysisFlow || currentStep !== "analyzing" || !caseId) {
      return;
    }

    if (caseAnalysisStatusQuery.error) {
      setErrorType(caseAnalysisStatusQuery.error instanceof TypeError ? "network" : "server");
      setAnalysisError(
        resolveApiErrorMessage(
          caseAnalysisStatusQuery.error,
          "Не удалось получить статус кейса.",
        ),
      );
      return;
    }

    const caseData = caseAnalysisStatusQuery.data;
    const nextProgress = resolveCaseProgress(caseData);
    setProgress(nextProgress.progress);
    setAnalysisStage(nextProgress.stage);

    if (isCaseAnalysisFailed(caseData)) {
      setErrorType("server");
      setAnalysisError(getCaseErrorMessage(caseData) ?? "Backend вернул ошибку анализа.");
      return;
    }

    if (isCaseAnalysisCompleted(caseData)) {
      setCurrentStep("generating_pdf");
      setProgress(92);
      setAnalysisStage(2);
    }
  }, [
    caseAnalysisStatusQuery.data,
    caseAnalysisStatusQuery.error,
    caseId,
    currentStep,
    isCaseAnalysisFlow,
    setAnalysisError,
    setCurrentStep,
  ]);

  useEffect(() => {
    if (!isCaseAnalysisFlow || currentStep !== "generating_pdf" || !caseId) {
      return;
    }

    if (generatedPdfCaseIdRef.current === caseId) {
      return;
    }

    generatedPdfCaseIdRef.current = caseId;
    const activeRunId = runIdRef.current;

    void generateCasePdfMutation
      .mutateAsync(caseId)
      .then(() => {
        if (runIdRef.current !== activeRunId) {
          return;
        }

        setProgress(100);
        setAnalysisStage(2);
        setCurrentStep("success");
      })
      .catch((error) => {
        if (runIdRef.current !== activeRunId) {
          return;
        }

        setErrorType(error instanceof TypeError ? "network" : "server");
        setAnalysisError(
          resolveApiErrorMessage(error, "Не удалось сформировать PDF-отчёт."),
        );
      });
  }, [
    caseId,
    currentStep,
    generateCasePdfMutation,
    isCaseAnalysisFlow,
    setAnalysisError,
    setCurrentStep,
  ]);

  return {
    analysisStage,
    backendHealth,
    canSendReportToEmail: Boolean(caseId && formData.consentEmailReport && formData.contactEmail.trim()),
    canStartAnalysis,
    currentStep,
    downloadErrorMessage,
    emailAddress: formData.contactEmail.trim(),
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
    isDownloadingReport: downloadAnalysisPdfMutation.isPending,
    isGeneratingPdf: generateCasePdfMutation.isPending,
    isSendingReportToEmail: sendCaseReportEmailMutation.isPending,
    previewUrl,
    processFile,
    progress,
    removeSelectedFile,
    resetAll,
    startAnalysis,
    startHint,
    validationErrors,
    workspaceState,
  };
}
