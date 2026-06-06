export const analysisQueryKeys = {
  all: ["analysis"] as const,
  simpleUpload: () => [...analysisQueryKeys.all, "simple", "upload"] as const,
  simpleStatus: (id: string) => [...analysisQueryKeys.all, "simple", "status", id] as const,
  simpleReport: (id: string) => [...analysisQueryKeys.all, "simple", "report", id] as const,
  caseStart: () => [...analysisQueryKeys.all, "case", "start"] as const,
  caseStatus: (id: string) => [...analysisQueryKeys.all, "case", "status", id] as const,
  casePdf: (id: string) => [...analysisQueryKeys.all, "case", "pdf", id] as const,
};
