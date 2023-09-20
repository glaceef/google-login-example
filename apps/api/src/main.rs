use axum::{
    http::{StatusCode, Uri},
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use dotenv::dotenv;
use lambda_http::{run, Error};
use once_cell::sync::Lazy;
use std::sync::Arc;

mod config;
mod handlers;

use self::config::Config;
use handlers::*;

static CONFIG: Lazy<Arc<Config>> = Lazy::new(|| {
    dotenv().ok();

    Arc::new(Config::from_env().unwrap())
});

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    let app = Router::new()
        .route("/api/login", get(login_get::handler))
        .route("/api/login", post(login_post::handler))
        .fallback(fallback);

    let service = lambda_http::tower::ServiceBuilder::new()
        .layer(axum_aws_lambda::LambdaLayer::default())
        .service(app);

    run(service).await
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    (StatusCode::NOT_FOUND, format!("No route for {}", uri))
}
