import { useTranslation } from "react-i18next";
import type { BookRecord } from "@liteyuki-shelf/shared";

interface AdminReviewPanelProps {
  selectedBook: BookRecord | null;
  onReviewed: () => void;
}

export function AdminReviewPanel({ selectedBook, onReviewed }: AdminReviewPanelProps) {
  const { t } = useTranslation();

  if (!selectedBook) {
    return <div className="empty-state">{t("adminReview.empty")}</div>;
  }

  const selectedBookId = selectedBook.id;

  const reviewActions: Array<{ label: string; status: BookRecord["status"] }> = [
    { label: t("adminReview.markReview"), status: "review" },
    { label: t("adminReview.publish"), status: "published" },
    { label: t("adminReview.sendDraft"), status: "draft" }
  ];

  async function submit(status: BookRecord["status"]) {
    const response = await fetch(`/api/books/${selectedBookId}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      onReviewed();
    }
  }

  return (
    <div className="stack-gap">
      <p className="section-note">{t("adminReview.helper")}</p>
      <div className="review-actions">
        {reviewActions.map((action) => (
          <button key={action.status} className="secondary-button" onClick={() => void submit(action.status)}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
