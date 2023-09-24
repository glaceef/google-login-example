use crate::CONFIG;
use aws_sdk_dynamodb::{error::SdkError, types::AttributeValue, Client};
use axum::{extract::Json, http::StatusCode, response::IntoResponse};
use axum_extra::extract::CookieJar as Cookie;
use chrono::Utc;
use google_login::{oauth2::Token, Config, OAuth};
use serde::Deserialize;

mod user_info;

use user_info::{get as get_user_info, UserInfo};

#[derive(Deserialize)]
pub struct RequestBody {
    pub state: String,
    pub code: String,
}

#[derive(Deserialize)]
struct ConfigJson {
    pub web: Config,
}

pub async fn handler(cookie: Cookie, Json(request_body): Json<RequestBody>) -> impl IntoResponse {
    let client_json_str = include_str!("client.json");
    let config_json: ConfigJson = serde_json::from_str(&client_json_str).unwrap();
    let oauth = OAuth::new(config_json.web, "http://localhost:8080/").unwrap();

    // CSRFチェック
    let Some(session_code) = cookie.get("token").map(|c| c.value()) else {
        return StatusCode::UNAUTHORIZED;
    };
    if session_code != request_body.state {
        return StatusCode::BAD_REQUEST;
    }

    let code = urlencoding::decode(&request_body.code).unwrap();
    let token = oauth.get_token(&code).await.unwrap();

    let user_info: UserInfo = get_user_info(token.access_token()).await;

    let sdk_config = aws_config::load_from_env().await;
    let client = Client::new(&sdk_config);

    let oauth_at = Utc::now().timestamp_millis();
    let result = client
        .update_item()
        .table_name(&CONFIG.table_name)
        .key("user_id", AttributeValue::S(user_info.email.clone()))
        .update_expression("SET :oauth_at = #oauth_at")
        .condition_expression("attribute_exists(user_id)")
        .expression_attribute_names(":oauth_at", "oauth_at")
        .expression_attribute_values("#oauth_at", AttributeValue::N(oauth_at.to_string()))
        .send()
        .await;

    match result {
        // ユーザーが存在しない場合は ConditionalCheckFailedException になる。
        Err(SdkError::ServiceError(e)) if e.err().is_conditional_check_failed_exception() => {
            StatusCode::FORBIDDEN
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
        _ => StatusCode::OK,
    }
}
