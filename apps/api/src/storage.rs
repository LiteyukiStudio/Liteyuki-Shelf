use std::{
    path::{Path, PathBuf},
    sync::RwLock,
};

use anyhow::Context;
use serde::{Deserialize, Serialize};

use crate::{models::BookRecord, sample_data::sample_books};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LibraryIndex {
    pub books: Vec<BookRecord>,
}

pub struct AppStorage {
    index_path: PathBuf,
    epubs_dir: PathBuf,
    books: RwLock<Vec<BookRecord>>,
}

impl AppStorage {
    pub async fn load(data_dir: PathBuf) -> anyhow::Result<Self> {
        tokio::fs::create_dir_all(&data_dir)
            .await
            .with_context(|| format!("failed to create storage dir {}", data_dir.display()))?;

        let epubs_dir = data_dir.join("epubs");
        tokio::fs::create_dir_all(&epubs_dir)
            .await
            .with_context(|| format!("failed to create epub dir {}", epubs_dir.display()))?;

        let index_path = data_dir.join("index.json");
        let legacy_index_path = data_dir.join("library.json");

        let books = if index_path.exists() {
            let content = tokio::fs::read_to_string(&index_path)
                .await
                .with_context(|| format!("failed to read {}", index_path.display()))?;
            let books = serde_json::from_str::<LibraryIndex>(&content)
                .map(|index| index.books)
                .with_context(|| format!("failed to parse {}", index_path.display()))?;
            if legacy_index_path.exists() {
                let _ = tokio::fs::remove_file(&legacy_index_path).await;
            }
            books
        } else if legacy_index_path.exists() {
            let content = tokio::fs::read_to_string(&legacy_index_path)
                .await
                .with_context(|| format!("failed to read {}", legacy_index_path.display()))?;
            let books = serde_json::from_str::<LibraryIndex>(&content)
                .map(|index| index.books)
                .with_context(|| format!("failed to parse {}", legacy_index_path.display()))?;
            save_index(&index_path, &books).await?;
            let _ = tokio::fs::remove_file(&legacy_index_path).await;
            books
        } else {
            let books = sample_books();
            save_index(&index_path, &books).await?;
            books
        };

        Ok(Self {
            index_path,
            epubs_dir,
            books: RwLock::new(books),
        })
    }

    pub fn list_books(&self) -> anyhow::Result<Vec<BookRecord>> {
        Ok(self
            .books
            .read()
            .map_err(|_| anyhow::anyhow!("book store lock poisoned"))?
            .clone())
    }

    pub fn with_books_mut<T>(
        &self,
        updater: impl FnOnce(&mut Vec<BookRecord>) -> T,
    ) -> anyhow::Result<T> {
        let mut books = self
            .books
            .write()
            .map_err(|_| anyhow::anyhow!("book store lock poisoned"))?;
        Ok(updater(&mut books))
    }

    pub fn epubs_dir(&self) -> &Path {
        &self.epubs_dir
    }

    pub async fn save_snapshot(&self) -> anyhow::Result<()> {
        let snapshot = self.list_books()?;
        save_index(&self.index_path, &snapshot).await
    }
}

async fn save_index(path: &Path, books: &[BookRecord]) -> anyhow::Result<()> {
    let payload = serde_json::to_string_pretty(&LibraryIndex {
        books: books.to_vec(),
    })?;
    tokio::fs::write(path, payload)
        .await
        .with_context(|| format!("failed to write {}", path.display()))
}
