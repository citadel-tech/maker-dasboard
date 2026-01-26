use axum::{routing::get, Router};
use std::net::SocketAddr;
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let serve_dir = ServeDir::new("frontend/build/client")
        .not_found_service(ServeFile::new("frontend/build/client/index.html"));

    let app = Router::new()
        .route("/api/health", get(health_check))
        .fallback_service(serve_dir);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}
