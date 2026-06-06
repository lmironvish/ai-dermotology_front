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
    throw new Error("VITE_API_BASE_URL is required when real API mode is enabled.");
  }

  return env.apiBaseUrl;
}

export function extractCaseId(caseData: CaseDto): string {
  const caseId = caseData.id ?? caseData.caseId ?? caseData.case_id;

  if (!caseId) {
    throw new Error("API response did not include a case identifier.");
  }

  return caseId;
}

export async function getHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>(getApiBaseUrl(), "/health", {
    method: "GET",
    errorMessage: "Unable to reach the API health endpoint.",
  });
}

export async function createCase(payload: CaseCreatePayload): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), CASES_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Unable to create a case.",
  });
}

export async function getCase(caseId: string): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), `${CASES_PATH}/${caseId}`, {
    method: "GET",
    errorMessage: "Unable to fetch case details.",
  });
}

export async function updateCase(caseId: string, payload: CasePatchPayload): Promise<CaseDto> {
  return requestJson<CaseDto>(getApiBaseUrl(), `${CASES_PATH}/${caseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Unable to update the case.",
  });
}

export async function uploadCaseImage(caseId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/image`, {
    method: "POST",
    body: formData,
    errorMessage: "Unable to upload the image for this case.",
  });
}

export async function startCaseAnalysis(caseId: string): Promise<void> {
  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/analyze`, {
    method: "POST",
    errorMessage: "Unable to start analysis for this case.",
  });
}

export async function generateCasePdf(caseId: string): Promise<void> {
  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/pdf`, {
    method: "POST",
    errorMessage: "Unable to generate the PDF report.",
  });
}

export async function downloadCasePdf(caseId: string): Promise<Blob> {
  return requestBlob(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/pdf`, {
    method: "GET",
    errorMessage: "Unable to download the PDF report.",
  });
}

export async function queueCaseReportEmail(
  caseId: string,
  payload: QueueReportEmailPayload,
): Promise<void> {
  await requestVoid(getApiBaseUrl(), `${CASES_PATH}/${caseId}/reports/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Unable to queue the report email.",
  });
}

export async function getCaseEmailDeliveries(caseId: string): Promise<EmailDeliveryDto[]> {
  return requestJson<EmailDeliveryDto[]>(getApiBaseUrl(), `${CASES_PATH}/${caseId}/email-deliveries`, {
    method: "GET",
    errorMessage: "Unable to fetch email deliveries for this case.",
  });
}
