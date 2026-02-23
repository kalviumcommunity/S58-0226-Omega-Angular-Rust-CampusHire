use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

#[derive(Serialize, Deserialize)]
struct Message {
    text: String,
}

#[derive(Serialize, Deserialize)]
struct Student {
    id: i32,
    name: String,
    email: String,
    created_at: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct Job {
    id: i32,
    title: String,
    company: String,
    description: Option<String>,
    salary_min: Option<i32>,
    created_at: Option<String>,
}

#[derive(Deserialize)]
struct ApplicationRequest {
    student_id: i32,
    job_id: i32,
}

#[derive(Deserialize)]
struct CreateStudentRequest {
    name: String,
    email: String,
}

#[derive(Deserialize)]
struct CreateJobRequest {
    title: String,
    company: String,
    description: Option<String>,
    salary_min: Option<i32>,
}

#[derive(Serialize)]
struct ApplicationResponse {
    id: i32,
    student_id: i32,
    job_id: i32,
    status: String,
    applied_at: Option<String>,
}

#[derive(Serialize)]
struct StudentApplication {
    id: i32,
    job_id: i32,
    job_title: String,
    job_company: String,
    status: String,
    applied_at: Option<String>,
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

#[get("/api/students/{id}")]
async fn get_student_by_id(
    pool: web::Data<PgPool>,
    path: web::Path<i32>,
) -> impl Responder {
    let student_id = path.into_inner();
    match sqlx::query_as::<_, (i32, String, String, Option<String>)>(
        "SELECT id, name, email, CAST(created_at AS TEXT) FROM students WHERE id = $1"
    )
    .bind(student_id)
    .fetch_optional(pool.get_ref())
    .await
    {
        Ok(Some((id, name, email, created_at))) => {
            HttpResponse::Ok().json(Student {
                id,
                name,
                email,
                created_at,
            })
        }
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({"error": "Student not found"})),
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Database error"}))
        }
    }
}

#[get("/api/students/{id}/applications")]
async fn get_student_applications(
    pool: web::Data<PgPool>,
    path: web::Path<i32>,
) -> impl Responder {
    let student_id = path.into_inner();
    match sqlx::query_as::<_, (i32, i32, String, String, String, Option<String>)>(
        r#"
        SELECT a.id, a.job_id, j.title, j.company, a.status, CAST(a.applied_at AS TEXT)
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.student_id = $1
        ORDER BY a.applied_at DESC
        "#
    )
    .bind(student_id)
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(rows) => {
            let apps: Vec<StudentApplication> = rows
                .into_iter()
                .map(|(id, job_id, job_title, job_company, app_status, applied_at)| StudentApplication {
                    id,
                    job_id,
                    job_title,
                    job_company,
                    status: app_status,
                    applied_at,
                })
                .collect();
            HttpResponse::Ok().json(apps)
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Database error"}))
        }
    }
}

#[get("/api/students")]
async fn get_students(pool: web::Data<PgPool>) -> impl Responder {
    match sqlx::query_as::<_, (i32, String, String, Option<String>)>(
        "SELECT id, name, email, CAST(created_at AS TEXT) FROM students ORDER BY id"
    )
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(rows) => {
            let students: Vec<Student> = rows
                .into_iter()
                .map(|(id, name, email, created_at)| Student {
                    id,
                    name,
                    email,
                    created_at,
                })
                .collect();
            HttpResponse::Ok().json(students)
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch students",
                "message": e.to_string()
            }))
        }
    }
}

#[post("/api/students")]
async fn create_student(
    pool: web::Data<PgPool>,
    req: web::Json<CreateStudentRequest>,
) -> impl Responder {
    let name = &req.name;
    let email = &req.email;

    match sqlx::query_as::<_, (i32, String, String, Option<String>)>(
        "INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id, name, email, CAST(created_at AS TEXT)"
    )
    .bind(name)
    .bind(email)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok((id, name, email, created_at)) => {
            println!("✅ Created student: {} ({})", name, email);
            HttpResponse::Created().json(Student {
                id,
                name,
                email,
                created_at,
            })
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            if e.to_string().contains("duplicate key value violates unique constraint") {
                return HttpResponse::Conflict().json(serde_json::json!({
                    "error": "Email already exists"
                }));
            }
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create student",
                "message": e.to_string()
            }))
        }
    }
}

#[get("/api/jobs")]
async fn get_jobs(pool: web::Data<PgPool>) -> impl Responder {
    match sqlx::query_as::<_, (i32, String, String, Option<String>, Option<i32>, Option<String>)>(
        "SELECT id, title, company, description, salary_min, CAST(created_at AS TEXT) FROM jobs ORDER BY id"
    )
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(rows) => {
            let jobs: Vec<Job> = rows
                .into_iter()
                .map(|(id, title, company, description, salary_min, created_at)| Job {
                    id,
                    title,
                    company,
                    description,
                    salary_min,
                    created_at,
                })
                .collect();
            HttpResponse::Ok().json(jobs)
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch jobs",
                "message": e.to_string()
            }))
        }
    }
}

#[post("/api/jobs")]
async fn create_job(
    pool: web::Data<PgPool>,
    req: web::Json<CreateJobRequest>,
) -> impl Responder {
    let title = &req.title;
    let company = &req.company;
    let description = &req.description;
    let salary_min = req.salary_min;

    match sqlx::query_as::<_, (i32, String, String, Option<String>, Option<i32>, Option<String>)>(
        "INSERT INTO jobs (title, company, description, salary_min) VALUES ($1, $2, $3, $4) RETURNING id, title, company, description, salary_min, CAST(created_at AS TEXT)"
    )
    .bind(title)
    .bind(company)
    .bind(description)
    .bind(salary_min)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok((id, title, company, description, salary_min, created_at)) => {
            println!("✅ Created job: {} at {}", title, company);
            HttpResponse::Created().json(Job {
                id,
                title,
                company,
                description,
                salary_min,
                created_at,
            })
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create job",
                "message": e.to_string()
            }))
        }
    }
}

#[post("/api/applications")]
async fn apply_for_job(
    pool: web::Data<PgPool>,
    req: web::Json<ApplicationRequest>,
) -> impl Responder {
    let student_id = req.student_id;
    let job_id = req.job_id;

    // Verify student exists
    match sqlx::query_scalar::<_, i32>("SELECT id FROM students WHERE id = $1")
        .bind(student_id)
        .fetch_optional(pool.get_ref())
        .await
    {
        Ok(None) => {
            return HttpResponse::NotFound().json(serde_json::json!({
                "error": "Student not found"
            }))
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Database error",
                "message": e.to_string()
            }));
        }
        _ => {}
    }

    // Verify job exists
    match sqlx::query_scalar::<_, i32>("SELECT id FROM jobs WHERE id = $1")
        .bind(job_id)
        .fetch_optional(pool.get_ref())
        .await
    {
        Ok(None) => {
            return HttpResponse::NotFound().json(serde_json::json!({
                "error": "Job not found"
            }))
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Database error",
                "message": e.to_string()
            }));
        }
        _ => {}
    }

    // Check if already applied
    match sqlx::query_scalar::<_, i32>(
        "SELECT id FROM applications WHERE student_id = $1 AND job_id = $2"
    )
    .bind(student_id)
    .bind(job_id)
    .fetch_optional(pool.get_ref())
    .await
    {
        Ok(Some(_)) => {
            return HttpResponse::BadRequest().json(serde_json::json!({
                "error": "You have already applied for this job"
            }))
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Database error",
                "message": e.to_string()
            }));
        }
        _ => {}
    }

    // Insert application
    match sqlx::query(
        "INSERT INTO applications (student_id, job_id, status, applied_at) VALUES ($1, $2, 'Applied', NOW())"
    )
    .bind(student_id)
    .bind(job_id)
    .execute(pool.get_ref())
    .await
    {
        Ok(_) => {
            println!("✅ Application submitted - Student {} applied for Job {}", student_id, job_id);
            HttpResponse::Created().json(serde_json::json!({
                "message": "Application submitted successfully",
                "student_id": student_id,
                "job_id": job_id,
                "status": "Applied"
            }))
        }
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to submit application",
                "message": e.to_string()
            }))
        }
    }
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
    
    // Create database connection pool
    let pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
    {
        Ok(p) => {
            println!("✅ Successfully connected to PostgreSQL database");
            p
        }
        Err(e) => {
            eprintln!("❌ Failed to connect to database: {}", e);
            println!("⚠️  Continuing without database connection...");
            eprintln!("Make sure your DATABASE_URL is set correctly in .env");
            PgPoolOptions::new()
                .max_connections(5)
                .connect("postgresql://user:password@localhost/neondb")
                .await
                .unwrap_or_else(|_| panic!("Failed to create dummy pool"))
        }
    };
    
    let pool_data = web::Data::new(pool);
    
    HttpServer::new(move || {
        let pool = pool_data.clone();
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
            .app_data(pool.clone())
            .wrap(cors)
            .service(hello)
            .service(status)
            .service(echo)
            .service(get_students)
            .service(get_student_by_id)
            .service(get_student_applications)
            .service(create_student)
            .service(get_jobs)
            .service(create_job)
            .service(apply_for_job)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
