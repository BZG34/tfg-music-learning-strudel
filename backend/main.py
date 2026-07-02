import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

# Importamos las capas arquitectónicas
import crud, models, schemas
from database import engine, SessionLocal

# 1. Crea las tablas en PostgreSQL automáticamente si no existen
models.Base.metadata.create_all(bind=engine)

# 2. Instancia de FastAPI
app = FastAPI(
    title="API de Aprendizaje Musical - TFG UAH",
    description="Backend para la plataforma e-learning con Strudel.js",
    version="0.1.0"
)

# 3. Configuración CORS para que React (en otro puerto) pueda acceder
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar por la IP de la Raspberry
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Dependencia para obtener la sesión de la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 5. POBLADO INICIAL (Seeding): Inyectar lecciones base al arrancar
@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    if not crud.get_lesson_by_number(db, lesson_number="1"):
        crud.create_lesson(db, schemas.LessonCreate(
            lesson_number="1",
            title="Your First Beat",
            hint_code='s("bd*4")'
        ))
    if not crud.get_lesson_by_number(db, lesson_number="4"):
        crud.create_lesson(db, schemas.LessonCreate(
            lesson_number="4",
            title="Polyphonic Cycles",
            hint_code='s("hh*8").gain("0.4 0.8").lpf(800)'
        ))
    db.close()

# --- ENDPOINTS ORIGINALES ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Servidor de música listo",
        "university": "UAH - EPS"
    }

@app.get("/health-check")
def db_check(db: Session = Depends(get_db)):
    """
    Verifica si la conexión con PostgreSQL es real en el almacenamiento NVMe.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected", "storage": "NVMe SSD detected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")

# --- NUEVOS ENDPOINTS DINÁMICOS ---

@app.get("/api/lessons/{lesson_number}", response_model=schemas.Lesson)
def read_lesson(lesson_number: str, db: Session = Depends(get_db)):
    lesson = crud.get_lesson_by_number(db, lesson_number=lesson_number)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_user(db=db, user=user)

@app.post("/api/users/{user_id}/projects/", response_model=schemas.Project)
def create_project_for_user(user_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_user_project(db=db, project=project, user_id=user_id)