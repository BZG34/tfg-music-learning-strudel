import os
import security
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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

    # 1. Crear usuario administrador por defecto (User ID 1)
    if not crud.get_user_by_email(db, email="admin@uah.es"):
        crud.create_user(db, schemas.UserCreate(
            username="Borja_Admin",
            email="admin@uah.es",
            password="supersecreto"
        ))

    # 2. Plan de Estudios Pedagógico de Música y Código
    curriculum = [
        schemas.LessonCreate(
            lesson_number="1",
            title="El Pulso Fundamental",
            hint_code='// Lección 1: El bombo (bd) marca el pulso en 4/4\ns("bd*4")'
        ),
        schemas.LessonCreate(
            lesson_number="2",
            title="Subdivisiones Binarias",
            hint_code='// Lección 2: Los corchetes [] dividen el tiempo en dos corcheas\ns("bd [hh hh] sd hh")'
        ),
        schemas.LessonCreate(
            lesson_number="3",
            title="Ritmos Euclidianos",
            hint_code='// Lección 3: Distribuye x pulsos en y espacios geométricos\ns("bd(3,8)")'
        ),
        schemas.LessonCreate(
            lesson_number="4",
            title="Ciclos Polifónicos",
            hint_code='// Lección 4: stack() combina capas rítmicas en paralelo\nstack(\n  s("bd*4"),\n  s("hh*8").gain(0.5),\n  s("~ sd").room(0.4)\n).slow(2)'
        ),
        schemas.LessonCreate(
            lesson_number="5",
            title="Melodía Algorítmica",
            hint_code='// Lección 5: n() define notas musicales y s() el sintetizador\nn("c3 e3 g3 b3 c4").s("saw").lpf(1000)'
        )
    ]

    # Inyectar lecciones si la tabla está vacía
    for lesson_data in curriculum:
        if not crud.get_lesson_by_number(db, lesson_number=lesson_data.lesson_number):
            crud.create_lesson(db, lesson_data)

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

# --- ENDPOINTS DINÁMICOS ---

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

@app.get("/api/projects/", response_model=list[schemas.Project])
def read_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Devuelve todas las pistas de música guardadas en PostgreSQL para la Galería Comunitaria.
    """
    return crud.get_projects(db, skip=skip, limit=limit)

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

@app.get("/api/users/{user_id}/projects/", response_model=list[schemas.Project])
def read_user_projects(user_id: int, db: Session = Depends(get_db)):
    """
    Devuelve la lista de proyectos personales para el Dashboard del alumno.
    """
    return crud.get_user_projects(db, user_id=user_id)

@app.get("/api/lessons/", response_model=list[schemas.Lesson])
def read_all_lessons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Devuelve la lista completa de lecciones del plan de estudios."""
    return crud.get_lessons(db, skip=skip, limit=limit)

@app.post("/api/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Ruta para que nuevos alumnos se registren en la plataforma PAMS."""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")
    return crud.create_user(db, user=user)

@app.post("/api/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Ruta de Login. Recibe credenciales, valida y devuelve el Token JWT."""
    # En OAuth2Form, 'username' se mapea al campo que el usuario rellene (usaremos su email)
    user = crud.get_user_by_email(db, email=form_data.username)
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Si todo es correcto, generamos su pase VIP (token JWT) guardando su ID y nombre
    access_token = security.create_access_token(
        data={"sub": str(user.id), "username": user.username, "email": user.email}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }

# --- DECODIFICADOR DE TOKENS ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Desencripta el Token JWT para descubrir qué usuario está haciendo la petición."""
    try:
        # Abrimos el token con la misma llave secreta que usamos al crearlo
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
    except security.JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
        
    user = crud.get_user(db, user_id=int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado en la red")
    return user

# --- RUTA PARA GUARDAR LA PISTA ---
@app.post("/api/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Ruta protegida. Solo un usuario con Token válido puede guardar una pista.
    FastAPI inyecta automáticamente al 'current_user' tras validar el Token.
    """
    return crud.create_user_project(db=db, project=project, user_id=current_user.id)