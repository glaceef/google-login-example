use reqwest::Url;
use serde::{de, Deserialize, Deserializer};

#[derive(Deserialize)]
pub struct Config {
    pub client_id: String,
    pub project_id: String,
    #[serde(deserialize_with = "deserialize_url")]
    pub auth_uri: Url,
    #[serde(deserialize_with = "deserialize_url")]
    pub token_uri: Url,
    pub auth_provider_x509_cert_url: String,
    pub client_secret: String,
    pub redirect_uris: Vec<String>,
}

fn deserialize_url<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Url, D::Error> {
    let url_str = String::deserialize(deserializer)?;
    Url::parse(&url_str).map_err(de::Error::custom)
}
