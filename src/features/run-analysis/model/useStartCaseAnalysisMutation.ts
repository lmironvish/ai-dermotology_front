import { useMutation } from "@tanstack/react-query";
import {
  createCase,
  extractCaseId,
  startCaseAnalysis,
  uploadCaseImage,
} from "../api/caseApi";
import type { CaseCreatePayload } from "../api/caseApi.types";
import { analysisQueryKeys } from "./queryKeys";

function buildCreateCasePayload(file: File): CaseCreatePayload {
  return {
    metadata: {
      file_name: file.name,
      mime_type: file.type,
      source: "web-app",
      uploaded_at: new Date().toISOString(),
    },
    consents: {
      personal_data_processing: true,
      ai_analysis: true,
    },
  };
}

export function useStartCaseAnalysisMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.caseStart(),
    mutationFn: async (file: File) => {
      const caseData = await createCase(buildCreateCasePayload(file));
      const caseId = extractCaseId(caseData);

      await uploadCaseImage(caseId, file);
      await startCaseAnalysis(caseId);

      return {
        caseId,
      };
    },
  });
}
