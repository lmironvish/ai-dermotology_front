import { env } from "@/app/config/env";
import { mockAnalyzeImage } from "./mockAnalyzeImage";
import type { AnalyzeImageResult } from "./types";

export async function analyzeImage(file: File): Promise<AnalyzeImageResult> {
  if (env.analysisApiMode === "real") {
    throw new Error("Прямой mock-анализ недоступен в real-режиме. Используйте сценарий cases.");
  }

  return mockAnalyzeImage(file);
}
