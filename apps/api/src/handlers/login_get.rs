use axum::response::{IntoResponse, Json};
use google_login::{Config, OAuth};
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
struct ConfigJson {
    pub web: Config,
}

pub async fn handler() -> impl IntoResponse {
    let client_json_str = include_str!("client.json");
    let config_json: ConfigJson = serde_json::from_str(&client_json_str).unwrap();
    let oauth = OAuth::new(config_json.web, "http://localhost:8080/").unwrap();

    let (state, authorize_url) = oauth.authorize_url();
    // std::fs::write("session", state.to_base64()).unwrap();
    println!("session code = {}", state.to_base64());

    Json(json!({
        "url": authorize_url.to_string(),
    }))
}
