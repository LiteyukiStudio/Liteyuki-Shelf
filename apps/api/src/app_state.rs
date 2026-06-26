use std::path::PathBuf;

use crate::storage::AppStorage;

pub struct AppState {
    pub storage: AppStorage,
    pub epubs_dir: PathBuf,
}

impl AppState {
    pub fn new(storage: AppStorage, epubs_dir: PathBuf) -> Self {
        Self { storage, epubs_dir }
    }
}
