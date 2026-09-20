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

# 3. Configuración CORS para que React pueda acceder
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar por la IP de la Raspberry
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Dependencias comunes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Desencripta el Token JWT para descubrir qué usuario está haciendo la petición."""
    try:
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

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    """Verifica que el usuario actual tenga privilegios de administrador."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Permisos insuficientes. Esta acción requiere rol de Administrador."
        )
    return current_user

# 5. POBLADO INICIAL (Seeding) al arrancar el servidor
@app.on_event("startup")
def seed_database():
    db = SessionLocal()

    # A) Crear usuario administrador por defecto
    db_admin = crud.get_user_by_email(db, email="admin@uah.es")
    if not db_admin:
        # Si no existe, lo creamos nuevo con poderes
        crud.create_user(db, schemas.UserCreate(
            username="Borja_Admin",
            email="admin@uah.es",
            password="supersecreto",
            is_admin=True
        ))
    else:
        # Si ya existíe, le forzamos que sea Admin
        db_admin.is_admin = True
        db.commit()

    # B) Inyectar el Plan de Estudios si no existe
    curriculum = [
        # --- BLOQUE 1: RITMO ---
        schemas.LessonCreate(
            lesson_number="1",
            title="B1: Hola Mundo Sonoro (El Pulso)",
            hint_code="""// BLOQUE 1: RITMO
// s() dispara un sample de audio.
// 'bd' es bombo (bass drum), 'sd' es caja (snare drum).
// Evalúa esto para escuchar tu primer latido:

s("bd sd bd sd")"""
        ),
        schemas.LessonCreate(
            lesson_number="2",
            title="B1: El valor del Silencio",
            hint_code="""// BLOQUE 1: RITMO
// La música respira. Usamos la virgulilla (~) para crear silencios.
// Nota cómo el silencio cambia el 'groove'.

s("bd ~ bd sd")"""
        ),
        schemas.LessonCreate(
            lesson_number="3",
            title="B1: Multiplicadores",
            hint_code="""// BLOQUE 1: RITMO
// Con el asterisco (*) multiplicamos un sonido dentro del mismo pulso.
// 'hh' es el charles (hi-hat). Vamos a acelerarlo:

s("bd hh*4 sd hh*2")"""
        ),

        # --- BLOQUE 2: COMPÁS Y ESTRUCTURA ---
        schemas.LessonCreate(
            lesson_number="4",
            title="B2: Multicanal (Stack)",
            hint_code="""// BLOQUE 2: COMPÁS
// stack() nos permite reproducir varias pistas a la vez.
// Es el equivalente a tener varios músicos tocando juntos.

stack(
  s("bd ~ bd sd"),
  s("hh*8").gain(0.5) // .gain() baja el volumen de esta pista
)"""
        ),
        schemas.LessonCreate(
            lesson_number="5",
            title="B2: Manipulación del Tiempo",
            hint_code="""// BLOQUE 2: COMPÁS
// .fast() y .slow() alteran la velocidad de una pista específica
// sin cambiar el BPM global del proyecto.

stack(
  s("bd sd").fast(2),
  s("cp").slow(2) // 'cp' = aplauso (clap) a mitad de velocidad
)"""
        ),
        schemas.LessonCreate(
            lesson_number="6",
            title="B2: Ritmos Euclidianos",
            hint_code="""// BLOQUE 2: COMPÁS
// Los ritmos euclidianos (pulsos,pasos) distribuyen golpes 
// matemáticamente de forma equidistante en un compás.

stack(
  s("bd(3,8)"), // 3 bombos repartidos en 8 pasos
  s("hh*8").gain(0.3)
)"""
        ),

        # --- BLOQUE 3: ESCALAS Y MELODÍA ---
        schemas.LessonCreate(
            lesson_number="7",
            title="B3: Notas y Sintetizadores",
            hint_code="""// BLOQUE 3: ESCALAS
// Abandonamos los samples. n() genera notas musicales por números.
// .s("saw") le dice a Strudel que use un sintetizador de onda de sierra.

n("0 2 4 5").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="8",
            title="B3: Aplicando Escalas",
            hint_code="""// BLOQUE 3: ESCALAS
// Tocar números sueltos puede sonar desafinado.
// .scale() fuerza a las notas a pertenecer a una familia armónica.

n("0 2 4 7 4 2 0 -1")
  .scale("C:minor") // Escala de Do menor
  .s("square")      // Sintetizador de onda cuadrada"""
        ),
        schemas.LessonCreate(
            lesson_number="9",
            title="B3: Sub-patrones Melódicos",
            hint_code="""// BLOQUE 3: ESCALAS
// Los corchetes [] permiten agrupar varias notas en el espacio de una.
// Esto crea melodías mucho más dinámicas y rítmicas.

n("0 [2 4] 7 [4 2]")
  .scale("A:minor")
  .s("saw")"""
        ),

        # --- BLOQUE 4: ARMONÍA ---
        schemas.LessonCreate(
            lesson_number="10",
            title="B4: Triadas y Acordes",
            hint_code="""// BLOQUE 4: ARMONÍA
// Un acorde es un grupo de notas sonando a la vez.
// Usamos comilla simple (') para llamar acordes predefinidos.

n("'c:maj 'a:min 'f:maj 'g:maj")
  .s("triangle") // Onda triangular, muy suave
  .slow(2)       // Acordes largos y sostenidos"""
        ),
        schemas.LessonCreate(
            lesson_number="11",
            title="B4: Arpegios",
            hint_code="""// BLOQUE 4: ARMONÍA
// .arp() rompe un acorde sólido y toca sus notas una tras otra,
// creando una textura rítmica y armónica a la vez.

n("'c:maj 'a:min 'f:maj 'g:maj")
  .arp("updown") // Sube y baja por las notas del acorde
  .s("saw")
  .gain(0.5)"""
        ),

        # --- BLOQUE 5: SÍNTESIS ---
        schemas.LessonCreate(
            lesson_number="12",
            title="B5: Esculpiendo Frecuencias",
            hint_code="""// BLOQUE 5: SÍNTESIS
// .lpf() (Low Pass Filter) recorta las frecuencias agudas.
// Hace que un sonido brillante y molesto suene oscuro y cálido.

n("0 [2 4] 7 4").scale("E:minor").s("saw")
  .lpf(800) // Prueba a cambiar este 800 por 4000"""
        ),
        schemas.LessonCreate(
            lesson_number="13",
            title="B5: El Espacio (Reverb y Delay)",
            hint_code="""// BLOQUE 5: SÍNTESIS
// Damos profundidad 3D al sonido simulando habitaciones o ecos.

n("0 ~ 4 ~").scale("E:minor").s("saw")
  .room(0.8)  // Tamaño de la habitación (reverberación)
  .delay(0.5) // Añade un eco rítmico"""
        ),
        schemas.LessonCreate(
            lesson_number="14",
            title="B5: Modulación de Parámetros",
            hint_code="""// BLOQUE 5: SÍNTESIS
// Podemos hacer que los parámetros se muevan solos.
// Aquí, el filtro sube y baja usando una onda sinusoidal.

stack(
  s("bd*4"),
  n("0 2 4 7").scale("E:minor").s("saw")
    .lpf(sine.range(400, 3000).fast(0.2)) // El filtro 'respira'
    .room(0.5)
)"""
        )
    ]

    for lesson_data in curriculum:
        if not crud.get_lesson_by_number(db, lesson_number=lesson_data.lesson_number):
            crud.create_lesson(db, lesson_data)

    db.close()


# ─── RUTAS DEL SISTEMA ────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"status": "online", "message": "Servidor de música listo", "university": "UAH - EPS"}

@app.get("/health-check")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected", "storage": "NVMe SSD detected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")


# ─── RUTAS DE AUTENTICACIÓN ───────────────────────────────────────────────────

@app.post("/api/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")
    return crud.create_user(db, user=user)

@app.post("/api/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = security.create_access_token(
        data={"sub": str(user.id), "username": user.username, "email": user.email, "is_admin": user.is_admin}
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "username": user.username, "email": user.email, "is_admin": user.is_admin}}


# ─── RUTAS DE LECCIONES ───────────────────────────────────────────────────────

@app.get("/api/lessons/", response_model=list[schemas.Lesson])
def read_all_lessons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_lessons(db, skip=skip, limit=limit)

@app.get("/api/lessons/{lesson_number}", response_model=schemas.Lesson)
def read_lesson(lesson_number: str, db: Session = Depends(get_db)):
    lesson = crud.get_lesson_by_number(db, lesson_number=lesson_number)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


# ─── RUTAS DE PROYECTOS (COMUNIDAD Y PRIVADOS) ────────────────────────────────

@app.get("/api/projects/", response_model=list[schemas.Project])
def read_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Devuelve todas las pistas para la Galería Comunitaria."""
    return crud.get_projects(db, skip=skip, limit=limit)

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

@app.get("/api/users/{user_id}/projects/", response_model=list[schemas.Project])
def read_user_projects(user_id: int, db: Session = Depends(get_db)):
    """Devuelve los proyectos de un usuario específico para su Dashboard."""
    return crud.get_user_projects(db, user_id=user_id)

@app.post("/api/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Guarda una pista verificando el Token JWT."""
    return crud.create_user_project(db=db, project=project, user_id=current_user.id)

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Elimina una pista verificando que pertenece al usuario del Token."""
    success = crud.delete_user_project(db=db, project_id=project_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado o sin permisos.")
    return {"message": "Proyecto eliminado con éxito."}

# ─── RUTAS DE PROGRESO ACADÉMICO ────────────────────────────────

@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Marca una lección como completada para el usuario logueado."""
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada")
    
    # Si no la ha completado ya, se la añadimos
    if lesson not in current_user.completed_lessons:
        current_user.completed_lessons.append(lesson)
        db.commit()
        
    return {"message": "Lección completada con éxito"}

@app.get("/api/users/me/progress")
def get_user_progress(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Devuelve las estadísticas y las IDs de las lecciones completadas."""
    total_lessons = db.query(models.Lesson).count()
    completed_ids = [lesson.id for lesson in current_user.completed_lessons]
    
    return {
        "completed_ids": completed_ids,
        "total_lessons": total_lessons,
        "completed_count": len(completed_ids)
    }

# ─── RUTA PARA BORRAR LA CUENTA DEL USUARIO ────────────────────────────────

@app.delete("/api/users/me")
def delete_user_account(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Elimina la cuenta del usuario actual y TODO su rastro en la base de datos."""
    
    try:
        # 1. Borrar todos los proyectos (canciones) que le pertenecen
        db.query(models.Project).filter(models.Project.owner_id == current_user.id).delete()
        
        # 2. Desvincular todo su progreso académico (limpia la tabla intermedia)
        current_user.completed_lessons = []
        
        # 3. Borrar al usuario del sistema
        db.delete(current_user)
        
        # 4. Guardar los cambios
        db.commit()
        return {"message": "Cuenta y datos eliminados para siempre."}
        
    except Exception as e:
        db.rollback() # Si algo falla, cancelamos la destrucción por seguridad
        raise HTTPException(status_code=500, detail="Error interno al borrar la cuenta")


# ─── PANEL DE ADMINISTRACIÓN (SOLO PARA ADMINS) ───────────────────────────────

@app.get("/api/admin/users/")
def admin_get_users(db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    """ADMIN: Devuelve la lista de todos los usuarios registrados."""
    users = db.query(models.User).all()
    # Ocultamos la contraseña por seguridad al enviarlo a React
    return [{"id": u.id, "username": u.username, "email": u.email, "is_admin": u.is_admin} for u in users]

@app.delete("/api/admin/users/{user_id}")
def admin_delete_user(user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    """ADMIN: Elimina a cualquier usuario y todo su rastro."""
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Limpiamos sus datos
    db.query(models.Project).filter(models.Project.owner_id == user.id).delete()
    user.completed_lessons = []
    db.delete(user)
    db.commit()
    return {"message": f"Usuario {user.username} eliminado por el administrador."}


@app.delete("/api/admin/projects/{project_id}")
def admin_delete_project(project_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    """ADMIN: Elimina cualquier pista de la galería de la comunidad."""
    project = crud.get_project(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Pista no encontrada")
    
    db.delete(project)
    db.commit()
    return {"message": "Pista eliminada de la galería comunitaria."}


@app.post("/api/admin/lessons/", response_model=schemas.Lesson)
def admin_create_lesson(lesson: schemas.LessonCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    """ADMIN: Añade una nueva lección al temario."""
    return crud.create_lesson(db, lesson)


@app.delete("/api/admin/lessons/{lesson_id}")
def admin_delete_lesson(lesson_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    """ADMIN: Elimina una lección del temario."""
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada")
    
    # Desvinculamos a los alumnos que la hayan completado para no romper la BD
    lesson.users_completed = []
    db.delete(lesson)
    db.commit()
    return {"message": "Lección eliminada del currículo."}