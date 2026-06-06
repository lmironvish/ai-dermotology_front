export type CaseStatus =
  | "draft"
  | "submitted"
  | "queued"
  | "uploading"
  | "analyzing"
  | "completed"
  | "failed"
  | "error"
  | (string & {});

export interface CaseCreatePayload {
  metadata?: Record<string, unknown>;
  consents?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface CasePatchPayload {
  metadata?: Record<string, unknown>;
  consents?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface CaseAnalysisData {
  status?: string | null;
  result?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface CasePdfData {
  status?: string | null;
  url?: string | null;
  file_name?: string | null;
  [key: string]: unknown;
}

export interface CaseErrorData {
  code?: string | null;
  message?: string | null;
  details?: unknown;
  [key: string]: unknown;
}

export interface CaseDto {
  id?: string;
  caseId?: string;
  case_id?: string;
  status?: CaseStatus;
  metadata?: Record<string, unknown>;
  analysis?: CaseAnalysisData | null;
  pdf?: CasePdfData | null;
  error?: CaseErrorData | string | null;
  [key: string]: unknown;
}

export interface HealthResponse {
  status?: string;
  database?: string;
  [key: string]: unknown;
}

export interface EmailDeliveryDto {
  id?: string;
  status?: string;
  to_email?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface QueueReportEmailPayload {
  to_email: string;
}
