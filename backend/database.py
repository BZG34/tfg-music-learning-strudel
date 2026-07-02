import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Tu configuración de URL
# NOTA DOCKER: Si la BD está en otro contenedor, en el .env "localhost" deberá ser el nombre del servicio de la BD (ej. "db")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tfg_user:secret@localhost:5432/musica_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()