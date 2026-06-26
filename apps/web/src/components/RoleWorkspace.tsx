import { useTranslation } from "react-i18next";
import type { BookRecord, DashboardSummary, UserRole } from "@liteyuki-shelf/shared";

interface RoleWorkspaceProps {
  role: UserRole;
  summary: DashboardSummary;
  books: BookRecord[];
}

export function RoleWorkspace({ role, summary, books }: RoleWorkspaceProps) {
  const { t } = useTranslation();

  return (
    <section className="panel workspace-panel stack-gap">
      <div className="workspace-header">
        <div>
          <span className="eyebrow">{t(`roles.${role}`)}</span>
          <h2>{t(`workspace.${role}Title`)}</h2>
        </div>
        <span className="workspace-count">{books.length} {t("common.items")}</span>
      </div>
      <p className="role-note">{t(`workspace.${role}Body`)}</p>
      <div className="meta-grid workspace-stats">
        <span>{t("summary.published")}: {summary.publishedBooks}</span>
        <span>{t("summary.drafts")}: {summary.draftBooks}</span>
        <span>{t("summary.pending")}: {summary.pendingReviews}</span>
      </div>
      <div className="workspace-recent stack-gap">
        <div className="section-heading">
          <h3>{t("workspace.recent")}</h3>
        </div>
        {books.length ? (
          <div className="workspace-recent-list">
            {books.slice(0, 3).map((book) => (
              <article key={book.id} className="workspace-recent-item">
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">{t("workspace.emptyRecent")}</div>
        )}
      </div>
    </section>
  );
}
