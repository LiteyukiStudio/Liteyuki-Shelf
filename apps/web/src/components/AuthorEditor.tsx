import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BookRecord, BookUpsertInput } from "@liteyuki-shelf/shared";

interface AuthorEditorProps {
  selectedBook: BookRecord | null;
  onSaved: () => void;
}

const emptyDraft: BookUpsertInput = {
  title: "",
  author: "",
  description: "",
  language: "zh-CN",
  tags: [],
  chapters: 1,
  wordCount: 1000
};

export function AuthorEditor({ selectedBook, onSaved }: AuthorEditorProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<BookUpsertInput>(emptyDraft);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBook) {
      setForm(emptyDraft);
      return;
    }

    setForm({
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description,
      language: selectedBook.language,
      tags: selectedBook.tags,
      chapters: selectedBook.chapters,
      wordCount: selectedBook.wordCount
    });
  }, [selectedBook]);

  function updateField<K extends keyof BookUpsertInput>(key: K, value: BookUpsertInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const targetPath = selectedBook ? `/api/books/${selectedBook.id}` : "/api/books";
    const method = selectedBook ? "PUT" : "POST";

    const response = await fetch(targetPath, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setMessage(t("authorEditor.saveFailed", { status: response.status }));
      return;
    }

    setMessage(t(selectedBook ? "authorEditor.updated" : "authorEditor.created"));
    if (!selectedBook) {
      setForm(emptyDraft);
    }
    onSaved();
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <p className="section-note">{t("authorEditor.helper")}</p>
      <input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder={t("authorEditor.title")} required />
      <input value={form.author} onChange={(event) => updateField("author", event.target.value)} placeholder={t("authorEditor.author")} required />
      <input value={form.language} onChange={(event) => updateField("language", event.target.value)} placeholder={t("authorEditor.language")} required />
      <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder={t("authorEditor.description")} rows={4} required />
      <input
        value={form.tags.join(", ")}
        onChange={(event) => updateField("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
        placeholder={t("authorEditor.tags")}
      />
      <div className="meta-grid compact-grid">
        <input type="number" min={1} value={form.chapters} onChange={(event) => updateField("chapters", Number(event.target.value))} placeholder={t("authorEditor.chapters")} required />
        <input type="number" min={0} value={form.wordCount} onChange={(event) => updateField("wordCount", Number(event.target.value))} placeholder={t("authorEditor.wordCount")} required />
      </div>
      <button className="secondary-button" type="submit">{selectedBook ? t("authorEditor.update") : t("authorEditor.create")}</button>
      {message ? <span className="upload-message">{message}</span> : null}
    </form>
  );
}
