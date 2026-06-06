import { env } from "@/app/config/env";
import { requestJson, requestResponse } from "./http";
import type {
  AnalysisStatusResponse,
  ReportResponse,
  UploadAnalysisResponse,
} from "./analysis.types";

const ANALYSIS_API_PATH = "/api/analysis";

function getAnalysisApiBaseUrl(): string {
  return env.apiBaseUrl;
}

function buildStatusPath(id: string): string {
  return `${ANALYSIS_API_PATH}/${id}/status`;
}

function buildReportPath(id: string): string {
  return `${ANALYSIS_API_PATH}/${id}/report`;
}

function parseFileName(contentDisposition: string | null): string | null {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return basicMatch?.[1] ?? null;
}

export async function uploadImage(file: File): Promise<UploadAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<UploadAnalysisResponse>(getAnalysisApiBaseUrl(), ANALYSIS_API_PATH, {
    method: "POST",
    body: formData,
    errorMessage: "Unable to upload image for analysis.",
  });
}

export async function getAnalysisStatus(id: string): Promise<AnalysisStatusResponse> {
  return requestJson<AnalysisStatusResponse>(getAnalysisApiBaseUrl(), buildStatusPath(id), {
    method: "GET",
    errorMessage: "Unable to fetch analysis status.",
  });
}

export async function downloadReport(id: string): Promise<ReportResponse> {
  const response = await requestResponse(getAnalysisApiBaseUrl(), buildReportPath(id), {
    method: "GET",
    errorMessage: "Unable to download analysis report.",
  });

  return {
    id,
    blob: await response.blob(),
    fileName: parseFileName(response.headers.get("content-disposition")),
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
  };
}
