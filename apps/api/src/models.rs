use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookRecord {
    pub id: String,
    pub title: String,
    pub author: String,
    pub description: String,
    pub epub_available: bool,
    pub epub_path: Option<String>,
    pub identifier: Option<String>,
    pub status: BookStatus,
    pub language: String,
    pub tags: Vec<String>,
    pub updated_at: String,
    pub chapters: u32,
    pub word_count: u32,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookUpsertInput {
    pub title: String,
    pub author: String,
    pub description: String,
    pub language: String,
    pub tags: Vec<String>,
    pub chapters: u32,
    pub word_count: u32,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookReviewInput {
    pub status: BookStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum BookStatus {
    Draft,
    Published,
    Review,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DashboardSummary {
    pub role: UserRole,
    pub total_books: usize,
    pub published_books: usize,
    pub draft_books: usize,
    pub pending_reviews: usize,
    pub active_readers: usize,
    pub recent_books: Vec<BookRecord>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum UserRole {
    Reader,
    Author,
    Admin,
}

#[derive(Debug, Deserialize)]
pub struct DashboardQuery {
    pub role: Option<UserRole>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EpubImportResult {
    pub id: String,
    pub title: String,
    pub creator: String,
    pub language: String,
    pub identifier: Option<String>,
}
