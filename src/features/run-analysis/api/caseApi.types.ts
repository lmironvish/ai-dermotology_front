import type {
  AnalysisAnatomicalLocation,
  AnalysisSex,
} from "@/entities/analysis";

export type CaseStatus =
  | "draft"
  | "submitted"
  | "queued"
  | "uploading"
  | "analyzing"
  | "processing"
  | "completed"
  | "failed"
  | "error"
  | (string & {});

export interface CaseCreatePayload {
  age_years: number;
  sex: AnalysisSex;
  anatomical_location: AnalysisAnatomicalLocation;
  consent_personal_data: true;
  consent_image_processing: true;
  consent_email_report: boolean;
  policy_version: "2025-01";
  contact_email?: string;
}

export type CasePatchPayload = Partial<{
  age_years: number;
  sex: AnalysisSex;
  anatomical_location: AnalysisAnatomicalLocation;
  consent_personal_data: boolean;
  consent_image_processing: boolean;
  consent_email_report: boolean;
  policy_version: string;
  contact_email: string;
}>;

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
  age_years?: number;
  sex?: AnalysisSex;
  anatomical_location?: AnalysisAnatomicalLocation;
  contact_email?: string | null;
  consent_personal_data?: boolean;
  consent_image_processing?: boolean;
  consent_email_report?: boolean;
  policy_version?: string;
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
