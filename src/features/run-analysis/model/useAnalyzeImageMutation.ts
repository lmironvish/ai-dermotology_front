import { useMutation } from "@tanstack/react-query";
import { analyzeImage } from "../api/analyzeImage";

export function useAnalyzeImageMutation() {
  return useMutation({
    mutationFn: analyzeImage,
  });
}
