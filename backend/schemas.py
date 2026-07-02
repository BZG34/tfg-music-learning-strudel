from pydantic import BaseModel
from typing import List, Optional

# --- SCHEMAS PARA PROYECTOS (Pistas de Strudel) ---
class ProjectBase(BaseModel):
    title: str
    strudel_code: str
    bpm: int = 128

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# --- SCHEMAS PARA LECCIONES ---
class LessonBase(BaseModel):
    lesson_number: str
    title: str
    hint_code: Optional[str] = None

class LessonCreate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int

    class Config:
        from_attributes = True

# --- SCHEMAS PARA USUARIOS ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    projects: List[Project] = []

    class Config:
        from_attributes = True