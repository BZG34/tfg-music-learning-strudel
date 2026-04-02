# tfg-music-learning-strudel <img width="1024" height="343" alt="image" src="https://github.com/user-attachments/assets/118b4261-4be4-4728-8160-576873b7dbb0" />

# 🎹 Plataforma de Aprendizaje Musical con Strudel (Live Coding)

> **Trabajo de Fin de Grado** > **Grado en Ingeniería en Sistemas de Información** > **Escuela Politécnica Superior - Universidad de Alcalá (UAH)**

![Status](https://img.shields.io/badge/Estado-En_Desarrollo-orange)
![License](https://img.shields.io/badge/Licencia-AGPL--3.0-blue)
![Platform](https://img.shields.io/badge/Platform-Raspberry_Pi_5-red)

## 🎯 Descripción del Proyecto
Este proyecto consiste en una plataforma web interactiva diseñada para la enseñanza de fundamentos musicales mediante **Live Coding**. Utiliza el motor de **Strudel.js** para permitir a los alumnos experimentar con ritmos y melodías en tiempo real a través de código.

El sistema está diseñado para ejecutarse de forma autónoma en una **Raspberry Pi 5**, actuando como un servidor educativo robusto y eficiente.

---

## 🛠️ Stack Tecnológico

### Frontend
* **React + Vite:** Interfaz de usuario reactiva.
* **Strudel.js:** Motor de síntesis de audio y Live Coding.
* **Tailwind CSS:** Diseño moderno y responsivo.

### Backend & Datos
* **FastAPI (Python):** API de alto rendimiento para la gestión de usuarios y lecciones.
* **PostgreSQL:** Base de datos relacional para persistencia de datos.
* **Docker:** Orquestación de servicios mediante contenedores.

### Infraestructura
* **Host:** Raspberry Pi 5 (8GB RAM).
* **Almacenamiento:** SSD NVMe 512GB (Arranque nativo).
* **SO:** Raspberry Pi OS Lite (64-bit).

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de microservicios orquestados por Docker:



1. **Frontend:** Servido mediante Nginx.
2. **API:** Procesa la lógica de negocio.
3. **Database:** Persistencia segura en el volumen del SSD.

---

## 🚀 Instalación y Despliegue rápido

Para levantar el entorno de desarrollo en la Raspberry Pi:

1. Clona el repositorio:
   ```bash
   git clone git@github.com:tu-usuario/tfg-music-learning-strudel.git
   cd tfg-music-learning-strudel
