export type AnalysisSex = "male" | "female";

export type AnalysisAnatomicalLocation =
  | "anterior_torso"
  | "head_neck"
  | "lateral_torso"
  | "lower_extremity"
  | "oral_genital"
  | "palms_soles"
  | "posterior_torso"
  | "upper_extremity";

export interface AnalysisFormData {
  ageYears: string;
  sex: AnalysisSex | "";
  anatomicalLocation: AnalysisAnatomicalLocation | "";
  consentPersonalData: boolean;
  consentImageProcessing: boolean;
  consentEmailReport: boolean;
  contactEmail: string;
  policyVersion: "2025-01";
}

export interface AnalysisFormErrors {
  ageYears?: string;
  sex?: string;
  anatomicalLocation?: string;
  consentPersonalData?: string;
  consentImageProcessing?: string;
  contactEmail?: string;
}

export interface AnalysisFormValidationResult {
  errors: AnalysisFormErrors;
  firstError: string | null;
  isValid: boolean;
}

export const INITIAL_ANALYSIS_FORM_DATA: AnalysisFormData = {
  ageYears: "",
  sex: "",
  anatomicalLocation: "",
  consentPersonalData: false,
  consentImageProcessing: false,
  consentEmailReport: false,
  contactEmail: "",
  policyVersion: "2025-01",
};

export const SEX_OPTIONS: Array<{ label: string; value: AnalysisSex }> = [
  { label: "Мужской", value: "male" },
  { label: "Женский", value: "female" },
];

export const ANATOMICAL_LOCATION_OPTIONS: Array<{
  label: string;
  value: AnalysisAnatomicalLocation;
}> = [
  { label: "Передняя поверхность туловища", value: "anterior_torso" },
  { label: "Голова и шея", value: "head_neck" },
  { label: "Боковая поверхность туловища", value: "lateral_torso" },
  { label: "Нижняя конечность", value: "lower_extremity" },
  { label: "Область слизистых / генитальная область", value: "oral_genital" },
  { label: "Ладони и стопы", value: "palms_soles" },
  { label: "Задняя поверхность туловища", value: "posterior_torso" },
  { label: "Верхняя конечность", value: "upper_extremity" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAnalysisForm(formData: AnalysisFormData): AnalysisFormValidationResult {
  const errors: AnalysisFormErrors = {};
  const trimmedAge = formData.ageYears.trim();
  const parsedAge = Number(trimmedAge);

  if (!trimmedAge) {
    errors.ageYears = "Укажите возраст.";
  } else if (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 120) {
    errors.ageYears = "Возраст должен быть целым числом от 0 до 120.";
  }

  if (!formData.sex) {
    errors.sex = "Выберите пол.";
  }

  if (!formData.anatomicalLocation) {
    errors.anatomicalLocation = "Выберите локализацию.";
  }

  if (!formData.consentPersonalData) {
    errors.consentPersonalData = "Нужно согласие на обработку персональных данных.";
  }

  if (!formData.consentImageProcessing) {
    errors.consentImageProcessing = "Нужно согласие на обработку загруженного изображения.";
  }

  if (formData.consentEmailReport) {
    const trimmedEmail = formData.contactEmail.trim();

    if (!trimmedEmail) {
      errors.contactEmail = "Укажите email для отправки отчёта.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      errors.contactEmail = "Введите корректный email.";
    }
  }

  const firstError = Object.values(errors)[0] ?? null;

  return {
    errors,
    firstError,
    isValid: Object.keys(errors).length === 0,
  };
}
