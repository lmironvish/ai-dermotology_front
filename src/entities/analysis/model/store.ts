import { create } from "zustand";
import {
  INITIAL_ANALYSIS_FORM_DATA,
  type AnalysisFormData,
  type AnalysisFormErrors,
} from "./form";

export type AnalysisStoreStep =
  | "idle"
  | "preview"
  | "creating_case"
  | "uploading"
  | "analyzing"
  | "generating_pdf"
  | "success"
  | "error";

interface AnalysisStoreState {
  selectedFile: File | null;
  previewUrl: string | null;
  currentStep: AnalysisStoreStep;
  formData: AnalysisFormData;
  caseId: string | null;
  errorMessage: string | null;
  validationErrors: AnalysisFormErrors;
  reportUrl: string | null;
}

interface AnalysisStoreActions {
  setSelectedFile: (selectedFile: File | null) => void;
  setPreviewUrl: (previewUrl: string | null) => void;
  setCurrentStep: (currentStep: AnalysisStoreStep) => void;
  setFormData: (formData: AnalysisFormData) => void;
  updateFormData: <TField extends keyof AnalysisFormData>(
    field: TField,
    value: AnalysisFormData[TField],
  ) => void;
  setCaseId: (caseId: string | null) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setValidationErrors: (validationErrors: AnalysisFormErrors) => void;
  clearValidationErrors: () => void;
  setReportUrl: (reportUrl: string | null) => void;
  setFilePreview: (selectedFile: File | null, previewUrl: string | null) => void;
  clearFilePreview: () => void;
  setAnalysisError: (errorMessage: string) => void;
  resetWorkflow: () => void;
}

export type AnalysisStore = AnalysisStoreState & AnalysisStoreActions;

const initialState: AnalysisStoreState = {
  selectedFile: null,
  previewUrl: null,
  currentStep: "idle",
  formData: INITIAL_ANALYSIS_FORM_DATA,
  caseId: null,
  errorMessage: null,
  validationErrors: {},
  reportUrl: null,
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ...initialState,
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setFormData: (formData) => set({ formData }),
  updateFormData: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  setCaseId: (caseId) => set({ caseId }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setValidationErrors: (validationErrors) => set({ validationErrors }),
  clearValidationErrors: () => set({ validationErrors: {} }),
  setReportUrl: (reportUrl) => set({ reportUrl }),
  setFilePreview: (selectedFile, previewUrl) => set({ selectedFile, previewUrl }),
  clearFilePreview: () => set({ selectedFile: null, previewUrl: null }),
  setAnalysisError: (errorMessage) =>
    set({
      currentStep: "error",
      errorMessage,
    }),
  resetWorkflow: () => set(initialState),
}));
