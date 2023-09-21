use serde::{de::DeserializeOwned, Deserialize};

const ENDPOINT: &str = "https://www.googleapis.com/oauth2/v1/userinfo";

#[derive(Deserialize)]
pub struct UserInfo {
    #[serde(rename(serialize = "user_id"))]
    pub email: String,
}

pub async fn get<T: DeserializeOwned>(token: &str) -> T {
    let client = reqwest::Client::new();
    let response = client
        .get(ENDPOINT)
        .bearer_auth(token)
        .send()
        .await
        .unwrap();

    response.json().await.unwrap()
}
