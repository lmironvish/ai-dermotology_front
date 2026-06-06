import { create } from "zustand";

export type AnalysisStoreStep =
  | "idle"
  | "preview"
  | "uploading"
  | "analyzing"
  | "success"
  | "error";

interface AnalysisStoreState {
  selectedFile: File | null;
  previewUrl: string | null;
  currentStep: AnalysisStoreStep;
  errorMessage: string | null;
  reportUrl: string | null;
}

interface AnalysisStoreActions {
  setSelectedFile: (selectedFile: File | null) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setCurrentStep: (currentStep: AnalysisStoreStep) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setReportUrl: (reportUrl: string | null) => void;
  setFilePreview: (selectedFile: File | null, previewUrl: string | null) => void;
  clearFilePreview: () => void;
  setAnalysisError: (errorMessage: string) => void;
  resetAnalysis: () => void;
}

export type AnalysisStore = AnalysisStoreState & AnalysisStoreActions;

const initialState: AnalysisStoreState = {
  selectedFile: null,
  previewUrl: null,
  currentStep: "idle",
  errorMessage: null,
  reportUrl: null,
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ...initialState,
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setReportUrl: (reportUrl) => set({ reportUrl }),
  setFilePreview: (selectedFile, previewUrl) => set({ selectedFile, previewUrl }),
  clearFilePreview: () => set({ selectedFile: null, previewUrl: null }),
  setAnalysisError: (errorMessage) =>
    set({
      currentStep: "error",
      errorMessage,
    }),
  resetAnalysis: () => set(initialState),
}));
