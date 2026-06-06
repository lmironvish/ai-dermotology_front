import type { ErrorType } from "@/entities/analysis";

export const IMAGE_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateImageFile(file: File): ErrorType | null {
  if (!IMAGE_FILE_TYPES.includes(file.type)) {
    return "format";
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return "size";
  }

  return null;
}

export function formatImageFileSize(size: number): string {
  return `${(size / 1024 / 1024).toFixed(2)} МБ`;
}
