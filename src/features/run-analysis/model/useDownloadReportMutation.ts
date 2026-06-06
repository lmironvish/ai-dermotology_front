import { useMutation } from "@tanstack/react-query";
import { downloadReport } from "@/shared/api";
import { analysisQueryKeys } from "./queryKeys";

export function useDownloadReportMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.simpleReport("download"),
    mutationFn: downloadReport,
  });
}
