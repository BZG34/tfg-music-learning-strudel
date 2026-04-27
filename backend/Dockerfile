# Imagen de Python ligera basada en Debian Bookworm (compatible con RPi 5)
FROM python:3.12-slim-bookworm

# Para evitar que Python genere archivos .pyc y permite que los logs aparezcan en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalamos dependencias del sistema necesarias para psycopg2 (conector de PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiamos solo el archivo de requerimientos primero para aprovechar la caché de Docker
COPY requirements.txt .

# Instalamos las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto que usará FastAPI
EXPOSE 8000

# Comando para arrancar la aplicación con Uvicorn
# --reload solo se usa en desarrollo; para el TFG final usaremos una config más robusta
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]