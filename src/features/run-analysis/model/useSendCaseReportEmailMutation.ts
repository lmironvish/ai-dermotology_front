import { useMutation } from "@tanstack/react-query";
import { sendCaseReportToEmail } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

interface SendCaseReportEmailParams {
  caseId: string;
  toEmail: string;
}

export function useSendCaseReportEmailMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.caseEmail("send"),
    mutationFn: ({ caseId, toEmail }: SendCaseReportEmailParams) =>
      sendCaseReportToEmail(caseId, toEmail),
  });
}
