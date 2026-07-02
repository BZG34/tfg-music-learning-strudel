from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relación: Un usuario puede tener muchos proyectos guardados
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    strudel_code = Column(Text, nullable=False)
    bpm = Column(Integer, default=128)
    
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