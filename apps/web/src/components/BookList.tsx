import { useTranslation } from "react-i18next";
import type { BookRecord, UserRole } from "@liteyuki-shelf/shared";

interface BookListProps {
  books: BookRecord[];
  role: UserRole;
  selectedBookId: string | null;
  onSelect: (book: BookRecord) => void;
}

export function BookList({ books, role, selectedBookId, onSelect }: BookListProps) {
  const { t } = useTranslation();

  if (!books.length) {
    const emptyKey = role === "reader" ? "catalog.emptyReader" : role === "author" ? "catalog.emptyAuthor" : "catalog.emptyAdmin";
    return <div className="empty-state">{t(emptyKey)}</div>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <button
          key={book.id}
          className={book.id === selectedBookId ? "book-item active" : "book-item"}
          onClick={() => onSelect(book)}
        >
          <div>
            <strong>{book.title}</strong>
            <span>{book.author}</span>
          </div>
          <div className="book-item-meta">
            <span>{t(`status.${book.status}`)}</span>
            <span>{book.language}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
