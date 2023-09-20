use serde::{de::DeserializeOwned, Deserialize, Serialize};

const ENDPOINT: &str = "https://www.googleapis.com/oauth2/v1/userinfo";

#[derive(Deserialize, Serialize)]
pub struct UserInfo {
    pub email: String,
    pub id: String,
    pub name: Option<String>,
    pub family_name: Option<String>,
    pub given_name: Option<String>,
    pub hd: Option<String>,
    pub locale: Option<String>,
    pub picture: Option<String>,
    pub verified_email: Option<bool>,
}

pub async fn execute<T: DeserializeOwned>(token: &str) -> T {
    let client = reqwest::Client::new();
    let response = client
        .get(ENDPOINT)
        .bearer_auth(token)
        .send()
        .await
        .unwrap();

    response.json().await.unwrap()
}
