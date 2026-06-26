import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  AppLocale,
  BookRecord,
  DashboardSummary,
  EpubImportResult,
  UserRole
} from "@liteyuki-shelf/shared";
import { appLocales, resolveAppLocale } from "@liteyuki-shelf/shared";
import { RoleTabs } from "./components/RoleTabs";
import { SummaryCards } from "./components/SummaryCards";
import { BookList } from "./components/BookList";
import { BookDetail } from "./components/BookDetail";
import { RoleWorkspace } from "./components/RoleWorkspace";
import { AuthorEditor } from "./components/AuthorEditor";
import { AdminReviewPanel } from "./components/AdminReviewPanel";
import { UploadPanel } from "./components/UploadPanel";

const localeOptions: AppLocale[] = appLocales;

function getVisibleBooks(role: UserRole, books: BookRecord[]) {
  if (role === "reader") {
    return books.filter((book) => book.status === "published");
  }

  if (role === "author") {
    return books.filter((book) => book.status === "draft" || book.status === "review");
  }

  return books;
}

function getErrorMessage(t: ReturnType<typeof useTranslation>["t"], error: unknown) {
  if (!(error instanceof Error)) {
    return t("common.unknownError");
  }

  const match = /^API_ERROR:([^:]+)(?::(\d+))?$/.exec(error.message);
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

  return t(map[code] ?? "errors.requestFailed", status ? { status } : undefined);
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    let payload: { code?: string } | null = null;

    try {
      payload = (await response.json()) as { code?: string };
    } catch {
      payload = null;
    }

    throw new Error(`API_ERROR:${payload?.code ?? "SERVICE_UNAVAILABLE"}:${response.status}`);
  }
  return (await response.json()) as T;
}

export function App() {
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState<UserRole>("reader");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);
  const [importedBook, setImportedBook] = useState<EpubImportResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeLocale = (resolveAppLocale(i18n.resolvedLanguage) ?? "en") as AppLocale;
  const visibleBooks = getVisibleBooks(role, books);
  const visibleSelectedBook = visibleBooks.find((book) => book.id === selectedBook?.id) ?? visibleBooks[0] ?? null;

  async function loadData(nextRole: UserRole) {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, booksData] = await Promise.all([
        fetchJson<DashboardSummary>(`/api/dashboard?role=${nextRole}`),
        fetchJson<BookRecord[]>("/api/books")
      ]);
      setSummary(dashboardData);
      setBooks(booksData);
      setSelectedBook((current) => current ?? getVisibleBooks(nextRole, booksData)[0] ?? null);
    } catch (requestError) {
      setError(getErrorMessage(t, requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setError(null);
      try {
        const [dashboardData, booksData] = await Promise.all([
          fetchJson<DashboardSummary>(`/api/dashboard?role=${role}`),
          fetchJson<BookRecord[]>("/api/books")
        ]);
        setSummary(dashboardData);
        setBooks(booksData);
        setSelectedBook((current) => current ?? getVisibleBooks(role, booksData)[0] ?? null);
      } catch (requestError) {
        setError(getErrorMessage(t, requestError));
      } finally {
        setLoading(false);
      }
    }

    void loadInitialData();
  }, [role, t]);

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{t("workspace.label")}</span>
          <h1>{t("tagline")}</h1>
          <p className="hero-note">{t(`workspace.${role}Body`)}</p>
        </div>
        <div className="hero-actions">
          <button className="secondary-button" onClick={() => void loadData(role)}>
            {t("actions.refresh")}
          </button>
          <select
            aria-label={t("actions.changeLocale")}
            value={activeLocale}
            onChange={(event) => void i18n.changeLanguage(event.target.value)}
          >
            {localeOptions.map((locale) => (
              <option key={locale} value={locale}>
                {t(`localeNames.${locale}`)}
              </option>
            ))}
          </select>
        </div>
      </header>

      <RoleTabs role={role} onChange={setRole} />

      {error ? <div className="error-banner">{error}</div> : null}
      {loading ? <div className="panel">{t("common.loading")}</div> : null}

      {summary ? <SummaryCards role={role} summary={summary} books={visibleBooks} importedBook={importedBook} /> : null}

      {summary ? <RoleWorkspace role={role} summary={summary} books={visibleBooks} /> : null}

      <main className="content-grid">
        <section className="panel stack-gap catalog-panel">
          <div className="section-heading section-heading-vertical">
            <h2>{t("sections.catalog")}</h2>
            <p className="section-note">{t(`catalog.${role}`)}</p>
            <span>{visibleBooks.length} {t("common.items")}</span>
          </div>
          <BookList books={visibleBooks} role={role} selectedBookId={visibleSelectedBook?.id ?? null} onSelect={setSelectedBook} />
        </section>

        <section className="panel stack-gap detail-panel">
          <h2>{t("sections.detail")}</h2>
          <BookDetail role={role} book={visibleSelectedBook} />
        </section>
      </main>

      <section className="workspace-grid">
        <section className="panel stack-gap action-panel">
          <h2>{t("sections.import")}</h2>
          <UploadPanel
            onImported={(book) => {
              setImportedBook(book);
              void loadData(role);
            }}
          />
          {importedBook ? (
            <div className="import-result">
              <strong>{importedBook.title}</strong>
              <span>{importedBook.creator}</span>
              <span>{importedBook.language}</span>
            </div>
          ) : null}
        </section>

        {role === "author" ? (
          <section className="panel stack-gap action-panel">
            <h2>{t("sections.authorDesk")}</h2>
            <AuthorEditor selectedBook={visibleSelectedBook} onSaved={() => void loadData(role)} />
          </section>
        ) : null}

        {role === "admin" ? (
          <section className="panel stack-gap action-panel">
            <h2>{t("sections.adminQueue")}</h2>
            <AdminReviewPanel selectedBook={visibleSelectedBook} onReviewed={() => void loadData(role)} />
          </section>
        ) : null}
      </section>
    </div>
  );
}
