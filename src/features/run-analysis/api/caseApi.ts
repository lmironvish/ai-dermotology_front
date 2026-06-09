import { env } from "@/app/config/env";
import { requestBlob, requestJson, requestVoid } from "@/shared/api/http";
import type {
  CaseCreatePayload,
  CaseDto,
  CasePatchPayload,
  EmailDeliveryDto,
  HealthResponse,
  QueueReportEmailPayload,
} from "./caseApi.types";

const CASES_PATH = "/cases";

function getApiBaseUrl(): string {
  if (!env.apiBaseUrl) {
    throw new Error("Не задан адрес backend API. Проверьте VITE_API_BASE_URL.");
  }

  return env.apiBaseUrl;
}

export function extractCaseId(caseData: CaseDto): string {
  const caseId = caseData.id ?? caseData.caseId ?? caseData.case_id;

  if (!caseId) {
    throw new Error("Backend не вернул идентификатор кейса.");
  }

  return caseId;
}

export async function getHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>(getApiBaseUrl(), "/health", {
    method: "GET",
    errorMessage: "Не удалось получить статус backend.",
  });
}

export async function createCase(payload: CaseCreatePayload): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), CASES_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось создать кейс.",
  });
}

export async function getCase(caseId: string): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), `${CASES_PATH}/${caseId}`, {
    method: "GET",
    errorMessage: "Не удалось получить статус кейса.",
  });
}

export async function updateCase(caseId: string, payload: CasePatchPayload): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), `${CASES_PATH}/${caseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось обновить кейс.",
  });
}

export async function uploadCaseImage(caseId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/image`, {
    method: "POST",
    body: formData,
    errorMessage: "Не удалось загрузить изображение.",
  });
}

export async function startCaseAnalysis(caseId: string): Promise<void> {
  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/analyze`, {
    method: "POST",
    errorMessage: "Не удалось запустить анализ.",
  });
}

export async function generateCasePdf(caseId: string): Promise<void> {
  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/pdf`, {
    method: "POST",
    errorMessage: "Не удалось сформировать PDF-отчёт.",
  });
}

export async function downloadCasePdf(caseId: string): Promise<Blob> {
  return requestBlob(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/pdf`, {
    method: "GET",
    errorMessage: "Не удалось скачать PDF-отчёт.",
  });
}

export async function sendCaseReportToEmail(caseId: string, toEmail: string): Promise<void> {
  const payload: QueueReportEmailPayload = {
    to_email: toEmail,
  };

  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось отправить отчёт на email.",
  });
}

export async function getEmailDeliveries(caseId: string): Promise<EmailDeliveryDto[]> {
  return requestJson<EmailDeliveryDto[]>(getApiBaseUrl(), `${CASES_PATH}/${caseId}/email-deliveries`, {
    method: "GET",
    errorMessage: "Не удалось получить историю отправок отчёта.",
  });
}
