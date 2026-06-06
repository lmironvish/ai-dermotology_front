import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/shared/api";
import { analysisQueryKeys } from "./queryKeys";

export function useUploadAnalysisMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.simpleUpload(),
    mutationFn: uploadImage,
  });
}
