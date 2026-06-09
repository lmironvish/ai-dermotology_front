import { useMutation } from "@tanstack/react-query";
import { uploadCaseImage } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

interface UploadCaseImageParams {
  caseId: string;
  file: File;
}

export function useUploadCaseImageMutation() {
  return useMutation({
    mutationKey: [...analysisQueryKeys.all, "case", "image", "upload"],
    mutationFn: ({ caseId, file }: UploadCaseImageParams) => uploadCaseImage(caseId, file),
  });
}
