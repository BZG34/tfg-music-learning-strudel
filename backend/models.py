from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from database import Base

#TABLA INTERMEDIA PARA EL PROGRESO
user_completed_lessons = Table(
    'user_completed_lessons', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('lesson_id', Integer, ForeignKey('lessons.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Campo para indicar si el usuario es administrador
    is_admin = Column(Boolean, default=False)

    # Relación: Un usuario puede tener muchos proyectos guardados
    projects = relationship("Project", back_populates="owner")

    # Relación con las lecciones completadas por el usuario
    completed_lessons = relationship("Lesson", secondary=user_completed_lessons, back_populates="users_completed")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    strudel_code = Column(Text, nullable=False)
    bpm = Column(Integer, default=128)

    # Mwetadatos del editor de Strudel
    # swing = Column(Integer, default=25)
    # quantize = Column(String, default="1/16")
    # master_volume = Column(Integer, default=80)
    
    # Clave foránea que apunta a PostgreSQL indicando de quién es este proyecto
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relación inversa
    owner = relationship("User", back_populates="projects")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    lesson_number = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    hint_code = Column(Text)

    # ── Campos para el quiz ──
    is_quiz = Column(Boolean, default=False)
    quiz_question = Column(String, nullable=True)
    quiz_options = Column(String, nullable=True)  # Guardaremos opciones separadas por '|'
    quiz_answer = Column(Integer, nullable=True)  # Índice (0, 1, 2...) de la correcta

    # Relación con los usuarios que han completado esta lección
    users_completed = relationship("User", secondary=user_completed_lessons, back_populates="completed_lessons")