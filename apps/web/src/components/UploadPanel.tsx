import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EpubImportResult } from "@liteyuki-shelf/shared";

interface UploadPanelProps {
  onImported: (book: EpubImportResult) => void;
}

export function UploadPanel({ onImported }: UploadPanelProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function getUploadErrorMessage(error: unknown) {
    if (!(error instanceof Error)) {
      return t("uploadPanel.failure");
    }

    const match = /^UPLOAD_ERROR:([^:]+):(\d+)$/.exec(error.message);
    if (!match) {
      return error.message;
    }

    const [, code, status] = match;
    const map: Record<string, string> = {
      BOOK_NOT_FOUND: "errors.bookNotFound",
      MISSING_FILE: "errors.missingFile",
      INVALID_EPUB: "errors.invalidEpub",
      SERVICE_UNAVAILABLE: "errors.serviceUnavailable"
    };

    return t(map[code] ?? "errors.uploadFailed", { status });
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads/epub", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const payload = (await response.json()) as { code?: string };
        throw new Error(`UPLOAD_ERROR:${payload.code ?? "SERVICE_UNAVAILABLE"}:${response.status}`);
      }
      const payload = (await response.json()) as EpubImportResult;
      onImported(payload);
      setMessage(t("uploadPanel.success", { title: payload.title }));
    } catch (error) {
      setMessage(getUploadErrorMessage(error));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="upload-box">
      <p className="section-note">{t("uploadPanel.helper")}</p>
      <label className="upload-label">
        <span>{uploading ? t("uploadPanel.working") : t("uploadPanel.idle")}</span>
        <input type="file" accept=".epub,application/epub+zip" onChange={handleChange} disabled={uploading} />
      </label>
      {message ? <span className="upload-message">{message}</span> : null}
    </div>
  );
}
