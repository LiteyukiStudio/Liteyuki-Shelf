import { useTranslation } from "react-i18next";
import type { BookRecord, UserRole } from "@liteyuki-shelf/shared";

interface BookDetailProps {
  role: UserRole;
  book: BookRecord | null;
}

export function BookDetail({ role, book }: BookDetailProps) {
  const { t } = useTranslation();

  if (!book) {
    return <div className="empty-state">{t("detail.empty")}</div>;
  }

  const roleTitle = {
    reader: t("workspace.readerTitle"),
    author: t("workspace.authorTitle"),
    admin: t("workspace.adminTitle")
  }[role];

  return (
    <article className="book-detail stack-gap">
      <div>
        <h3>{book.title}</h3>
        <p>{book.description || t("detail.noDescription")}</p>
      </div>
      <div className="meta-grid">
        <span>{t("detail.author")}: {book.author}</span>
        <span>{t("detail.status")}: {t(`status.${book.status}`)}</span>
        <span>{t("detail.language")}: {book.language}</span>
        <span>{t("detail.chapters")}: {book.chapters}</span>
        <span>{t("detail.words")}: {book.wordCount}</span>
        <span>{t("detail.updated")}: {book.updatedAt}</span>
        <span>{t("detail.epub")}: {book.epubAvailable ? t("detail.epubReady") : t("detail.epubMissing")}</span>
        <span>{t("detail.identifier")}: {book.identifier ?? t("common.notAvailable")}</span>
      </div>
      <div className="tag-row">
        {book.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="role-note">{roleTitle}</div>
    </article>
  );
}
