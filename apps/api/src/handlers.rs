use std::{
    fs::File,
    io::{Read, Seek, Write},
    path::PathBuf,
};

use actix_multipart::Multipart;
use actix_web::{HttpResponse, Result, error, web};
use chrono::Local;
use epub::doc::EpubDoc;
use futures_util::TryStreamExt;
use uuid::Uuid;

use crate::{
    app_state::AppState,
    models::{
        BookRecord, BookReviewInput, BookStatus, BookUpsertInput, DashboardQuery, DashboardSummary,
        EpubImportResult, UserRole,
    },
};

pub async fn health() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({ "status": "ok" }))
}

pub async fn list_books(state: web::Data<AppState>) -> Result<HttpResponse> {
    let books = state
        .storage
        .list_books()
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Ok().json(books))
}

pub async fn get_book(path: web::Path<String>, state: web::Data<AppState>) -> Result<HttpResponse> {
    let requested_id = path.into_inner();
    let books = state
        .storage
        .list_books()
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;

    if let Some(book) = books.iter().find(|item| item.id == requested_id) {
        Ok(HttpResponse::Ok().json(book))
    } else {
        Ok(api_error(HttpResponse::NotFound(), "BOOK_NOT_FOUND"))
    }
}

pub async fn create_book(
    payload: web::Json<BookUpsertInput>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let book = book_from_input(payload.into_inner(), BookStatus::Draft, false, None);
    state
        .storage
        .with_books_mut(|books| books.push(book.clone()))
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    state
        .storage
        .save_snapshot()
        .await
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Created().json(book))
}

pub async fn update_book(
    path: web::Path<String>,
    payload: web::Json<BookUpsertInput>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let requested_id = path.into_inner();
    let update = payload.into_inner();

    let updated = state
        .storage
        .with_books_mut(|books| {
            books
                .iter_mut()
                .find(|book| book.id == requested_id)
                .map(|book| {
                    book.title = update.title.clone();
                    book.author = update.author.clone();
                    book.description = update.description.clone();
                    book.language = update.language.clone();
                    book.tags = update.tags.clone();
                    book.chapters = update.chapters;
                    book.word_count = update.word_count;
                    book.updated_at = today_string();
                    book.clone()
                })
        })
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;

    let Some(book) = updated else {
        return Ok(api_error(HttpResponse::NotFound(), "BOOK_NOT_FOUND"));
    };

    state
        .storage
        .save_snapshot()
        .await
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Ok().json(book))
}

pub async fn review_book(
    path: web::Path<String>,
    payload: web::Json<BookReviewInput>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let requested_id = path.into_inner();
    let review = payload.into_inner();

    let updated = state
        .storage
        .with_books_mut(|books| {
            books
                .iter_mut()
                .find(|book| book.id == requested_id)
                .map(|book| {
                    book.status = review.status.clone();
                    book.updated_at = today_string();
                    book.clone()
                })
        })
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;

    let Some(book) = updated else {
        return Ok(api_error(HttpResponse::NotFound(), "BOOK_NOT_FOUND"));
    };

    state
        .storage
        .save_snapshot()
        .await
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    Ok(HttpResponse::Ok().json(book))
}

pub async fn dashboard(
    query: web::Query<DashboardQuery>,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let role = query.role.unwrap_or(UserRole::Reader);
    let books = state
        .storage
        .list_books()
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;

    let published_books = books
        .iter()
        .filter(|book| matches!(book.status, BookStatus::Published))
        .count();
    let draft_books = books
        .iter()
        .filter(|book| matches!(book.status, BookStatus::Draft))
        .count();
    let pending_reviews = books
        .iter()
        .filter(|book| matches!(book.status, BookStatus::Review))
        .count();

    let active_readers = match role {
        UserRole::Reader => 126,
        UserRole::Author => 38,
        UserRole::Admin => 12,
    };

    let summary = DashboardSummary {
        role,
        total_books: books.len(),
        published_books,
        draft_books,
        pending_reviews,
        active_readers,
        recent_books: books.iter().take(3).cloned().collect(),
    };

    Ok(HttpResponse::Ok().json(summary))
}

pub async fn upload_epub(
    mut payload: Multipart,
    state: web::Data<AppState>,
) -> Result<HttpResponse> {
    let mut saved_path: Option<PathBuf> = None;
    let mut relative_epub_path: Option<String> = None;

    while let Some(mut field) = payload.try_next().await? {
        let _filename = field
            .content_disposition()
            .and_then(|disposition| disposition.get_filename())
            .map(sanitize_filename)
            .unwrap_or_else(|| format!("{}.epub", Uuid::new_v4()));

        let generated_name = format!("{}.epub", Uuid::new_v4());
        let full_path = state.epubs_dir.join(generated_name.clone());
        let mut target = File::create(&full_path).map_err(|err| {
            error::ErrorInternalServerError(format!("failed to create file: {err}"))
        })?;

        while let Some(chunk) = field.try_next().await? {
            target.write_all(&chunk).map_err(|err| {
                error::ErrorInternalServerError(format!("failed to write file: {err}"))
            })?;
        }

        saved_path = Some(full_path);
        relative_epub_path = Some(format!("epubs/{generated_name}"));
    }

    let Some(epub_path) = saved_path else {
        return Ok(api_error(HttpResponse::BadRequest(), "MISSING_FILE"));
    };

    let doc = match EpubDoc::new(epub_path.to_string_lossy().as_ref()) {
        Ok(doc) => doc,
        Err(_) => return Ok(api_error(HttpResponse::BadRequest(), "INVALID_EPUB")),
    };

    let title = metadata_value(&doc, "title", "Untitled EPUB");
    let creator = metadata_value(&doc, "creator", "Unknown author");
    let language = metadata_value(&doc, "language", "und");
    let identifier = doc.mdata("identifier").map(|item| item.value.clone());
    let epub_path = relative_epub_path.clone();

    let imported = EpubImportResult {
        id: Uuid::new_v4().to_string(),
        title: title.clone(),
        creator: creator.clone(),
        language: language.clone(),
        identifier: identifier.clone(),
    };

    let imported_book = BookRecord {
        id: imported.id.clone(),
        title,
        author: imported.creator.clone(),
        description: String::new(),
        epub_available: true,
        epub_path,
        identifier: identifier.clone(),
        status: BookStatus::Review,
        language,
        tags: vec!["EPUB".to_owned()],
        updated_at: today_string(),
        chapters: 0,
        word_count: 0,
    };

    state
        .storage
        .with_books_mut(|books| books.push(imported_book))
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;
    state
        .storage
        .save_snapshot()
        .await
        .map_err(|err| error::ErrorInternalServerError(err.to_string()))?;

    Ok(HttpResponse::Ok().json(imported))
}

fn sanitize_filename(input: &str) -> String {
    input
        .chars()
        .map(|character| match character {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '.' | '-' | '_' => character,
            _ => '_',
        })
        .collect()
}

fn metadata_value<R>(doc: &EpubDoc<R>, key: &str, fallback: &str) -> String
where
    R: Read + Seek,
{
    doc.mdata(key)
        .map(|item| item.value.clone())
        .unwrap_or_else(|| fallback.to_owned())
}

fn book_from_input(
    input: BookUpsertInput,
    status: BookStatus,
    epub_available: bool,
    id: Option<String>,
) -> BookRecord {
    BookRecord {
        id: id.unwrap_or_else(|| Uuid::new_v4().to_string()),
        title: input.title,
        author: input.author,
        description: input.description,
        epub_available,
        epub_path: None,
        identifier: None,
        status,
        language: input.language,
        tags: input.tags,
        updated_at: today_string(),
        chapters: input.chapters,
        word_count: input.word_count,
    }
}

fn today_string() -> String {
    Local::now().format("%Y-%m-%d").to_string()
}

fn api_error(mut builder: actix_web::HttpResponseBuilder, code: &str) -> HttpResponse {
    builder.json(serde_json::json!({ "code": code }))
}
