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
        # ==========================================
        # BLOQUE 1: RITMO Y TIEMPO (Fundamentos)
        # ==========================================
        schemas.LessonCreate(
            lesson_number="1",
            title="B1: El Latido de la Música",
            hint_code="""// TEORÍA: El 'Pulso' es el latido constante de una canción (como un reloj).
// En música electrónica, el Bombo (Bass Drum o 'bd') suele marcar este pulso.
// Evalúa este código para escuchar 4 pulsos de bombo:

s("bd bd bd bd")"""
        ),
        schemas.LessonCreate(
            lesson_number="2",
            title="B1: Dinámica (Volumen)",
            hint_code="""// TEORÍA: La 'Dinámica' se refiere a lo fuerte o suave que suena una nota.
// En Strudel usamos .gain() donde 1 es normal, 0.5 es la mitad, y 0 es mudo.

s("bd bd bd bd").gain(0.4)"""
        ),
        schemas.LessonCreate(
            lesson_number="3",
            title="B1: El Compás Básico (4/4)",
            hint_code="""// TEORÍA: Un 'Compás' agrupa los pulsos. El más común en Pop/Rock es de 4 pulsos (4/4).
// Suele acentuarse el pulso 2 y el 4 con una Caja (Snare Drum o 'sd').

s("bd sd bd sd")"""
        ),
        schemas.LessonCreate(
            lesson_number="4",
            title="B1: El Silencio",
            hint_code="""// TEORÍA: En música, el silencio tiene el mismo valor que el sonido.
// Genera tensión y 'groove'. En Strudel usamos la virgulilla (~) para crear silencios.

s("bd ~ bd sd")"""
        ),
        schemas.LessonCreate(
            lesson_number="5",
            title="B1: Tempo (BPM)",
            hint_code="""// TEORÍA: El Tempo (BPM - Beats Per Minute) dicta la velocidad.
// 60 BPM = lento (1 latido por segundo). 120 BPM = ritmo de baile estándar.
// Usa el control deslizante de arriba para subir el BPM a 130 y pulsa Play."""
        ),
        schemas.LessonCreate(
            lesson_number="6",
            title="B1: Subdivisiones (Corcheas)",
            hint_code="""// TEORÍA: Las corcheas duran la mitad que un pulso normal (entran 2 golpes por cada pulso).
// Usamos los corchetes [] para decirle a Strudel que meta varios sonidos en 1 solo pulso.

s("bd [hh hh] sd hh")"""
        ),
        # --- EXAMEN BLOQUE 1 ---
        schemas.LessonCreate(
            lesson_number="7",
            title="B1: TEST de Ritmo",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Para qué utilizamos los corchetes [] en la programación rítmica?",
            quiz_options="Para subir el volumen general de la pista.|Para subdividir el tiempo, tocando varios sonidos dentro de un solo pulso.|Para crear silencios absolutos en el compás.",
            quiz_answer=1
        ),

        # ==========================================
        # BLOQUE 2: MELODÍA Y ALTURA (Mapeo Tonal)
        # ==========================================
        schemas.LessonCreate(
            lesson_number="8",
            title="B2: Frecuencias y Síntesis Básica",
            hint_code="""// TEORÍA: Dejamos la percusión pura. Los sintetizadores generan tonos (frecuencias).
// .s("saw") activa un sintetizador. n() cambia la altura de la nota.

n("0 2").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="9",
            title="B2: La Octava",
            hint_code="""// TEORÍA: Una octava es el salto a la misma nota, pero más aguda o más grave.
// La diferencia entre n("0") y n("12") es exactamente una octava (12 semitonos).

n("0 12").s("square")"""
        ),
        schemas.LessonCreate(
            lesson_number="10",
            title="B2: Escalas Musicales",
            hint_code="""// TEORÍA: Una escala es una familia de notas que suenan bien juntas.
// La escala Mayor suele sonar alegre, la Menor (minor) suele sonar triste o épica.

n("0 1 2 3 4 5 6 7").scale("C:minor").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="11",
            title="B2: Caleidoscopio Melódico",
            hint_code="""// TEORÍA: Combinamos las subdivisiones rítmicas del B1 con las escalas del B2.
// Escucha cómo se crea una melodía compleja (arpegio).

n("0 [2 4] 7 [4 2]").scale("A:minor").s("saw")"""
        ),
        # --- EXAMEN BLOQUE 2 ---
        schemas.LessonCreate(
            lesson_number="12",
            title="B2: TEST de Melodía",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Qué propósito principal tiene el modificador .scale() en nuestras melodías?",
            quiz_options="Fuerza a los números a ajustarse a una estructura armónica (escala) para que suenen entonados.|Cambia el instrumento de un sintetizador a un piano clásico.|Alarga la duración del compás haciéndolo infinito.",
            quiz_answer=0
        ),

        # ==========================================
        # BLOQUE 3: TEXTURA Y ARMONÍA (Capas y Efectos)
        # ==========================================
        schemas.LessonCreate(
            lesson_number="13",
            title="B3: Multipista (Stacks)",
            hint_code="""// TEORÍA: En un estudio de grabación hay varias pistas (instrumentos) sonando a la vez.
// La función stack() nos permite emular esto, apilando secuencias rítmicas.

stack(
  s("bd ~ bd sd"),       // Pista 1 (Bombo/Caja)
  s("hh*8").gain(0.5)    // Pista 2 (Platillos rápidos)
)"""
        ),
        schemas.LessonCreate(
            lesson_number="14",
            title="B3: La Armonía (Acordes)",
            hint_code="""// TEORÍA: Un acorde consiste en reproducir 3 o más notas simultáneamente.
// Esto da soporte (textura) a la melodía. Usamos acordes escritos (ej. c:min para Do Menor).

n("'c:min 'f:min").s("triangle").slow(2)"""
        ),
        schemas.LessonCreate(
            lesson_number="15",
            title="B3: Arpegios (La Armonía en movimiento)",
            hint_code="""// TEORÍA: En lugar de tocar el acorde de golpe, podemos tocar sus notas una a una.
// La función .arp() se encarga de descomponer el acorde automáticamente.

n("'c:min 'f:min").arp("updown").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="16",
            title="B3: El Timbre (Filtros)",
            hint_code="""// TEORÍA: El timbre es el 'color' del sonido. Un filtro de paso bajo (LPF)
// recorta las frecuencias agudas, simulando que el sonido viene de detrás de una pared.

n("0 [2 4] 7 4").scale("E:minor").s("saw").lpf(600)"""
        ),
        schemas.LessonCreate(
            lesson_number="17",
            title="B3: El Espacio (Reverb)",
            hint_code="""// TEORÍA: La reverberación simula que el sonido ocurre dentro de un espacio físico.
// .room() genera esa textura ambiental 3D. 1.0 es una catedral, 0.1 es un armario.

n("0 ~ 4 ~").scale("E:minor").s("saw").room(0.8)"""
        ),
        schemas.LessonCreate(
            lesson_number="18",
            title="B3: Modulación Automática",
            hint_code="""// TEORÍA: Podemos decirle a Strudel que gire los botones por nosotros usando un LFO (sine).
// Fíjate cómo el filtro (.lpf) se abre y se cierra solo, dándole vida a la textura.

stack(
  s("bd*4"),
  n("0 2 4 7").scale("E:minor").s("saw")
    .lpf(sine.range(300, 3000).fast(0.2)) 
    .room(0.5)
)"""
        ),
        # --- EXAMEN BLOQUE 3 ---
        schemas.LessonCreate(
            lesson_number="19",
            title="B3: TEST de Armonía",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Cuál es la diferencia técnica entre programar una Melodía simple y una estructura Armónica (Acorde)?",
            quiz_options="La melodía utiliza silencios, mientras que la armonía ocupa todo el compás.|La melodía reproduce una nota detrás de otra de forma secuencial, mientras que un acorde requiere reproducir varias notas simultáneamente.|Los acordes solo pueden crearse utilizando samples de percusión.",
            quiz_answer=1
        ),
        
        # --- DESPEDIDA ---
        schemas.LessonCreate(
            lesson_number="20",
            title="¡Graduación!",
            hint_code="""// ¡Felicidades! Has superado la Academia de Código Sonoro.
// Ya dominas el ritmo, las escalas, la armonía y el diseño sonoro algorítmico.
//
// -> Dirígete ahora a 'Nueva Pista' en la cabecera.
// ¡Es hora de componer tus propias canciones para la Galería Comunitaria!
//
// Disfruta de esta melodía de graduación:

stack(
  s("bd*4"),
  s("hh*8").gain(0.4),
  n("0 [3 5] 7 [10 12]").scale("G:major").s("saw").lpf(1500).room(0.6).fast(2),
  n("'g:maj 'c:maj 'd:maj 'g:maj").s("triangle").slow(2).room(0.8)
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