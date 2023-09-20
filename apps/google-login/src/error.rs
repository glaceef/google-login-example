use thiserror::Error as ThisError;

#[derive(Debug, ThisError)]
pub enum Error {
    #[error(transparent)]
    OAuth2ExecuteError(#[from] oauth2::ExecuteError),

    #[error(transparent)]
    ReqwestError(#[from] reqwest::Error),
}
