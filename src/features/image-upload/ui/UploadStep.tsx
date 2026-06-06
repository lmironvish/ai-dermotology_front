import { Upload } from "lucide-react";
import type { ChangeEvent, DragEvent, RefObject } from "react";

interface UploadStepProps {
  dragOver: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrop: (e: DragEvent) => void;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  setDragOver: (value: boolean) => void;
}

export function UploadStep({
  dragOver,
  fileInputRef,
  onDrop,
  onFileInput,
  setDragOver,
}: UploadStepProps) {
  return (
    <div>
      <div className="mb-2">
        <h3
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "#0f172a" }}
        >
          1. Загрузка изображения
        </h3>
        <p className="mt-1 text-[14px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
          Выберите или перетащите фотографию кожного образования
        </p>
      </div>

      <div
        className="mt-6 rounded-2xl flex flex-col items-center justify-center gap-4 py-16 cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${dragOver ? "#2563eb" : "#cbd5e1"}`,
          background: dragOver ? "#eef4ff" : "#fafbfc",
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDrop={onDrop}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: dragOver ? "#dbeafe" : "#eef4ff" }}
        >
          <Upload size={28} style={{ color: "#1447a0" }} />
        </div>
        <div className="text-center">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.0625rem",
              color: "#0f172a",
            }}
          >
            Перетащите изображение сюда
          </p>
          <p className="mt-1 text-[14px]" style={{ color: "#64748b", fontFamily: "var(--font-body)" }}>
            или выберите файл на устройстве
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px]"
            style={{ background: "#f1f5f9", color: "#64748b", fontFamily: "var(--font-body)" }}
          >
            <span className="font-medium" style={{ color: "#475569" }}>JPG, JPEG, PNG</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px]"
            style={{ background: "#f1f5f9", color: "#64748b", fontFamily: "var(--font-body)" }}
          >
            до <span className="font-medium" style={{ color: "#475569" }}>10 МБ</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #1447a0 0%, #2563eb 100%)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(20,71,160,0.25)",
          }}
        >
          <Upload size={16} />
          Выбрать файл
        </button>
      </div>

      <input
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileInput}
        type="file"
      />
    </div>
  );
}
