pub use oauth2;

mod config;
mod error;
mod oauth;
mod scope;

pub use config::Config;
pub use error::Error;
pub use oauth::*;

pub type Result<T> = std::result::Result<T, Error>;
