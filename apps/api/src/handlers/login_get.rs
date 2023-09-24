use crate::CONFIG;
use axum::{
    http::header::SET_COOKIE,
    response::{IntoResponse, Json},
};
use google_login::{Config, OAuth};
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
struct ConfigJson {
    pub web: Config,
}

pub async fn handler() -> impl IntoResponse {
    let client_json_str = include_str!("client.json"); // 実際はパラメータストアなどから取得する。
    let config_json: ConfigJson = serde_json::from_str(&client_json_str).unwrap();
    let oauth = OAuth::new(config_json.web, &CONFIG.callback_url).unwrap();

    let (state, authorize_url) = oauth.authorize_url();
    let session_code = state.to_base64();
    dbg!(&session_code);

    let headers = [
        (SET_COOKIE, format!("token={session_code}")),
        // (ACCESS_CONTROL_ALLOW_ORIGIN, "*".into()),
        // (ACCESS_CONTROL_ALLOW_CREDENTIALS, "true".into()),
        // (ACCESS_CONTROL_ALLOW_METHODS, "*".into()),
        // (ACCESS_CONTROL_ALLOW_HEADERS, "*".into()),
    ];
    let body = Json(json!({
        "url": authorize_url.to_string(),
    }));

    (headers, body)
}
