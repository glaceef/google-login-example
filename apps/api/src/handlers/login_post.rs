use crate::CONFIG;
use aws_sdk_dynamodb::{types::AttributeValue, Client};
use axum::{
    extract::Json as JsonArg,
    response::{IntoResponse, Json},
};
use google_login::{oauth2::Token, Config, OAuth};
use serde::Deserialize;
use serde_json::json;

mod user_info;

use user_info::{get as get_user_info, UserInfo};

#[derive(Deserialize)]
pub struct RequestBody {
    pub state: String,
    pub code: String,
    pub session: String,
}

#[derive(Deserialize)]
struct ConfigJson {
    pub web: Config,
}

pub async fn handler(JsonArg(request_body): JsonArg<RequestBody>) -> impl IntoResponse {
    let client_json_str = include_str!("client.json");
    let config_json: ConfigJson = serde_json::from_str(&client_json_str).unwrap();
    let oauth = OAuth::new(config_json.web, "http://localhost:8080/").unwrap();

    // CSRFチェック
    // let state_str = std::fs::read_to_string("session").unwrap();
    let state_str = request_body.session;
    // if state_str != request_body.state {
    //     return Ok(HttpResponse::Unauthorized().json(json!({
    //         "result_code": Common::InvalidParameter,
    //     })));
    // }
    assert_eq!(state_str, request_body.state);

    // session.remove("google_callback_state");

    let code = urlencoding::decode(&request_body.code).unwrap();
    let token = oauth.get_token(&code).await.unwrap();

    let user_info: UserInfo = get_user_info(token.access_token()).await;

    let sdk_config = aws_config::load_from_env().await;
    let client = Client::new(&sdk_config);

    let output = client
        .get_item()
        .table_name(&CONFIG.table_name)
        .key("user_id", AttributeValue::S(user_info.email.clone()))
        .send()
        .await
        .unwrap();

    if output.item.is_none() {
        println!("user not found");
    }

    Json(json!({
        "user_id": user_info.email,
    }))
}
