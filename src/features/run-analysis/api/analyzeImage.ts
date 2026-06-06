import { env } from "@/app/config/env";
import { fetchAnalyzeImage } from "./fetchAnalyzeImage";
import { mockAnalyzeImage } from "./mockAnalyzeImage";
import type { AnalyzeImageResult } from "./types";

export async function analyzeImage(file: File): Promise<AnalyzeImageResult> {
  if (env.analysisApiMode === "real") {
    return fetchAnalyzeImage(file);
  }

  return mockAnalyzeImage(file);
}
