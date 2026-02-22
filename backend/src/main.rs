use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use dotenv::dotenv;

#[derive(Serialize, Deserialize)]
struct Message {
    text: String,
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Hello from Rust backend!",
        "status": "success"
    }))
}

#[get("/api/status")]
async fn status() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "Backend is running",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

#[post("/api/echo")]
async fn echo(msg: web::Json<Message>) -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "echo": msg.text,
        "received": true
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file
    dotenv().ok();
    
    // Get DATABASE_URL from environment
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "Not configured".to_string());
    
    println!("🚀 Starting Rust backend server on http://localhost:8080");
    println!("📊 Database URL: {}", if database_url == "Not configured" { "Not configured" } else { "✅ Loaded" });
    
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:4200")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(hello)
            .service(status)
            .service(echo)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
