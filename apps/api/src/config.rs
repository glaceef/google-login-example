use serde::Deserialize;

#[derive(Deserialize)]
pub struct Config {
    pub table_name: String,
}

impl Config {
    pub fn from_env() -> Result<Self, config::ConfigError> {
        config::Config::builder()
            .add_source(config::Environment::default())
            .build()
            .and_then(config::Config::try_deserialize)
    }
}
