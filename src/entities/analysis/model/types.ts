export type WorkspaceState = "upload" | "preview" | "analyzing" | "result" | "error";

export type ErrorType = "format" | "size" | "network" | "server";

export interface AnalysisTimelineStep {
  delay: number;
  stage: number;
  progress: number;
}

export interface AnalysisErrorContent {
  title: string;
  desc: string;
  hint: string;
  color: string;
  border: string;
  iconBg: string;
}
