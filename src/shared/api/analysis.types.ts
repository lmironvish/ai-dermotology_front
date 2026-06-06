export type AnalysisStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "error"
  | (string & {});

export interface UploadAnalysisResponse {
  id: string;
  status: AnalysisStatus;
  createdAt?: string | null;
  message?: string | null;
  [key: string]: unknown;
}

export interface AnalysisStatusResponse {
  id: string;
  status: AnalysisStatus;
  progress?: number | null;
  errorMessage?: string | null;
  reportUrl?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface ReportResponse {
  id: string;
  blob: Blob;
  fileName: string | null;
  contentType: string;
}
