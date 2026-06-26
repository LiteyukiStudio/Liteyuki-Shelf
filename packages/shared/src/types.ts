export type UserRole = "reader" | "author" | "admin";

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  description: string;
  epubAvailable: boolean;
  epubPath?: string;
  identifier?: string;
  status: "draft" | "published" | "review";
  language: string;
  tags: string[];
  updatedAt: string;
  chapters: number;
  wordCount: number;
}

export interface DashboardSummary {
  role: UserRole;
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  pendingReviews: number;
  activeReaders: number;
  recentBooks: BookRecord[];
}

export interface EpubImportResult {
  id: string;
  title: string;
  creator: string;
  language: string;
  identifier?: string;
}

export interface BookUpsertInput {
  title: string;
  author: string;
  description: string;
  language: string;
  tags: string[];
  chapters: number;
  wordCount: number;
}

export interface BookReviewInput {
  status: BookRecord["status"];
}
