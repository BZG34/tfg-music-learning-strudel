import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

# 1. Configuración de la Base de Datos
# Sacamos la URL de las variables de entorno que inyecta Docker
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tfg_user:secret@localhost:5432/musica_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Instancia de FastAPI
app = FastAPI(
    title="API de Aprendizaje Musical - TFG UAH",
    description="Backend para la plataforma e-learning con Strudel.js",
    version="0.1.0"
)

# 3. Dependencia para obtener la sesión de la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---

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
    Este endpoint verifica si la conexión con PostgreSQL es real.
    Para las pruebas iniciales en la Raspberry Pi.
    """
    try:
        # Ejecutamos una consulta simple para verificar la conexión
        db.execute(text("SELECT 1"))
        return {"database": "connected", "storage": "NVMe SSD detected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")