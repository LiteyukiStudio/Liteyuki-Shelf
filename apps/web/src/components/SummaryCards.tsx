import { useTranslation } from "react-i18next";
import type { BookRecord, DashboardSummary, EpubImportResult, UserRole } from "@liteyuki-shelf/shared";

interface SummaryCardsProps {
  role: UserRole;
  summary: DashboardSummary;
  books: BookRecord[];
  importedBook: EpubImportResult | null;
}

export function SummaryCards({ role, summary, books, importedBook }: SummaryCardsProps) {
  const { t } = useTranslation();

  const cards = role === "reader"
    ? [
        { label: t("summary.published"), value: summary.publishedBooks },
        { label: t("common.epubCount"), value: books.filter((book) => book.epubAvailable).length },
        { label: t("summary.readers"), value: summary.activeReaders }
      ]
    : role === "author"
      ? [
          { label: t("summary.drafts"), value: summary.draftBooks },
          { label: t("summary.pending"), value: summary.pendingReviews },
          { label: t("summary.wordsInView"), value: books.reduce((sum, book) => sum + book.wordCount, 0) }
        ]
      : [
          { label: t("summary.books"), value: summary.totalBooks },
          { label: t("summary.published"), value: summary.publishedBooks },
          { label: t("summary.pending"), value: summary.pendingReviews }
        ];

  if (importedBook) {
    cards.push({ label: t("summary.imported"), value: 1 });
  }

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
