import type { AnalyzeImageResult } from "./types";

const MOCK_ANALYZE_DELAY_MS = 3200;

function createMockPdfBlob(fileName: string): Blob {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 132 >>
stream
BT
/F1 18 Tf
72 760 Td
(AI Dermatology Analysis Report) Tj
0 -32 Td
/F1 12 Tf
(Source file: ${fileName.replace(/[()]/g, "")}) Tj
0 -24 Td
(Status: Completed successfully) Tj
0 -24 Td
(Generated in mock mode without backend connection) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000063 00000 n 
0000000122 00000 n 
0000000248 00000 n 
0000000431 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
501
%%EOF`;

  return new Blob([content], { type: "application/pdf" });
}

export async function mockAnalyzeImage(file: File): Promise<AnalyzeImageResult> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_ANALYZE_DELAY_MS));

  if (!file) {
    throw new Error("Файл для анализа не найден.");
  }

  const reportBlob = createMockPdfBlob(file.name);
  const reportUrl = URL.createObjectURL(reportBlob);

  return {
    caseId: `mock-${Date.now()}`,
    reportUrl,
  };
}
