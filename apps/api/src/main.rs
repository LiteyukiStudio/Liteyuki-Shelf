mod app_state;
mod handlers;
mod models;
mod sample_data;
mod storage;

use std::path::PathBuf;

use actix_cors::Cors;
use actix_files::Files;
use actix_web::{App, HttpServer, web};
use app_state::AppState;
use storage::AppStorage;

const DEFAULT_PORT: u16 = 8899;
const DEFAULT_HOST: &str = "0.0.0.0";

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let host = std::env::var("HOST").unwrap_or_else(|_| DEFAULT_HOST.to_owned());
    let port = std::env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(DEFAULT_PORT);

    let data_dir = PathBuf::from("apps/api/data");
    tokio::fs::create_dir_all(&data_dir).await?;

    let storage = AppStorage::load(data_dir)
        .await
        .map_err(std::io::Error::other)?;

    let epubs_dir = storage.epubs_dir().to_path_buf();

    let state = web::Data::new(AppState::new(storage, epubs_dir));

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(Cors::permissive())
            .route("/api/health", web::get().to(handlers::health))
            .route("/api/books", web::get().to(handlers::list_books))
            .route("/api/books", web::post().to(handlers::create_book))
            .route("/api/books/{id}", web::get().to(handlers::get_book))
            .route("/api/books/{id}", web::put().to(handlers::update_book))
            .route(
                "/api/books/{id}/review",
                web::patch().to(handlers::review_book),
            )
            .route("/api/dashboard", web::get().to(handlers::dashboard))
            .route("/api/uploads/epub", web::post().to(handlers::upload_epub))
            .service(Files::new("/", "apps/web/dist").index_file("index.html"))
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}
