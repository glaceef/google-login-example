use crate::{scope, Config, Result};
use oauth2::{Client, StandardToken, State, Url};
use reqwest::IntoUrl;

pub struct OAuth {
    client: Client,
    config: Config,
}

impl OAuth {
    pub fn new(config: Config, callback_url: impl IntoUrl) -> Result<Self> {
        let redirect_url = callback_url.into_url()?;

        let mut client = Client::new(
            config.client_id.clone(),
            config.auth_uri.clone(),
            config.token_uri.clone(),
        );
        client.set_client_secret(&config.client_secret);
        client.add_scope(scope::USERINFO_EMAIL);
        client.add_scope(scope::USERINFO_PROFILE);
        client.set_redirect_url(redirect_url);

        Ok(Self { client, config })
    }

    pub fn config(&self) -> &Config {
        &self.config
    }

    pub fn authorize_url(&self) -> (State, Url) {
        let state = State::new_random();
        let authorize_url = self.client.authorize_url(&state);

        (state, authorize_url)
    }

    pub async fn get_token(&self, code: &str) -> Result<StandardToken> {
        let reqwest_client = reqwest::Client::new();
        self.client
            .exchange_code(code)
            .with_client(&reqwest_client)
            .execute::<StandardToken>()
            .await
            .map_err(|e| e.into())
    }
}
