import models, schemas, security
from sqlalchemy.orm import Session
import models, schemas

# --- OPERACIONES DE USUARIO ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Ciframos la contraseña antes de guardarla
    hashed_password = security.get_password_hash(user.password)
    
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password # Guardamos el hash seguro
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- OPERACIONES DE PROYECTOS ---
def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

# Para sacar un proyecto específico
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_user_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    db_project = models.Project(**project.model_dump(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_user_projects(db: Session, user_id: int):
    """Devuelve todos los proyectos que pertenecen a un usuario concreto."""
    return db.query(models.Project).filter(models.Project.owner_id == user_id).all()

# --- OPERACIONES DE LECCIONES ---
def get_lesson_by_number(db: Session, lesson_number: str):
    return db.query(models.Lesson).filter(models.Lesson.lesson_number == lesson_number).first()

def get_lessons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Lesson).offset(skip).limit(limit).all()

def create_lesson(db: Session, lesson: schemas.LessonCreate):
    db_lesson = models.Lesson(**lesson.model_dump())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

def get_user(db: Session, user_id: int):
    """Obtiene un usuario por su ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    """Guarda un nuevo proyecto musical ligado al ID del creador."""
    db_project = models.Project(
        title=project.title,
        strudel_code=project.strudel_code,
        bpm=project.bpm,
        owner_id=user_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project