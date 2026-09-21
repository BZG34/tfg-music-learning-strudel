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
    allow_origins=["*"], # En producción cambiar por la IP por la de tu servidor
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
        # Si ya existe, le forzamos que sea Admin
        db_admin.is_admin = True
        db.commit()

    # B) Inyectar el Plan de Estudios si no existe
    curriculum = [
        # ==========================================
        # BLOQUE 1: RITMO Y TIEMPO
        # ==========================================
        schemas.LessonCreate(
            lesson_number="1",
            title="B1: El Pulso y el Tempo",
            hint_code="""// TEORÍA: El 'Pulso' es el latido de la música. El 'Tempo' dicta su velocidad en Beats Por Minuto (BPM).
// En Strudel, controlamos el tempo por código con .cps() (Ciclos Por Segundo).
// En música electrónica, el Bombo (Bass Drum o 'bd') suele marcar este pulso.
// Prueba a cambiar .cps(1) por .cps(2) para duplicar la velocidad o por .cps(0.5) para reducirlo a la mitad.
// Evalúa este código para escuchar 4 pulsos de bombo:

s("bd bd bd bd").cps(1)

// Prueba a cambiar el 'bd' por 'sd' (Caja) o 'hh' (Hi-Hat) y vuelve a evaluar.

// s("bd sd bd hh").cps(1)

// Descomenta y evalúa este código para escuchar 3 pulsos de bombo:

// s("bd bd bd").cps(1)"""
        ),
        schemas.LessonCreate(
            lesson_number="2",
            title="B1: Valores de Nota",
            hint_code="""// TEORÍA: El tiempo musical se divide en fracciones regulares.
// Un compás de 4/4 usa notas de cuarto (quarter notes), que Strudel entiende por defecto.
// Los corchetes [] agrupan notas en subdivisiones más pequeñas, como corcheas (eighth notes).

s("bd [hh hh] sd hh")"""
        ),
        schemas.LessonCreate(
            lesson_number="3",
            title="B1: El Compás Básico (4/4)",
            hint_code="""// TEORÍA: Un 'Compás' agrupa los pulsos. El más común en Pop/Rock es de 4 pulsos (4/4).
// Suele acentuarse el pulso 2 y el 4 con una Caja (Snare Drum o 'sd').

s("bd sd bd sd")

// Prueba a cambiar el compás a 3/4 (sólo 3 pulsos), con acentuación en el pulso 2 y vuelve a evaluar:

// s("bd sd bd")"""
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
            title="B1: Dinámica y Acento",
            hint_code="""// TEORÍA: La 'Dinámica' se refiere a la intensidad (volumen) del sonido.
// En Strudel usamos .gain() 0 es silencio y a partir de ahí, los valores son exponenciales.

s("bd [hh hh] bd sd").gain(0.6)"""
        ),
        schemas.LessonCreate(
            lesson_number="6",
            title="B1: Sincopación",
            hint_code="""// TEORÍA: La síncopa coloca el énfasis en las partes débiles del compás para crear tensión.
// Es vital en estilos electrónicos como el House o Drum & Bass.

s("~ bd ~ bd")"""
        ),
        schemas.LessonCreate(
            lesson_number="7",
            title="B1: Ritmos Aditivos",
            hint_code="""// TEORÍA: En lugar de dividir el compás, sumamos pulsos cortos (ej: 3+3+2 = 8).
// Es la base de ritmos de todo el mundo y genera un gran 'groove'.

s("bd ~ ~ bd ~ ~ bd ~").fast(2)"""
        ),
        # --- EXÁMENES BLOQUE 1 ---
        schemas.LessonCreate(
            lesson_number="8",
            title="B1: TEST de Subdivisiones",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Para qué utilizamos los corchetes [] en la programación rítmica?",
            quiz_options="Para subir el volumen general de la pista.|Para subdividir el tiempo, tocando varios sonidos dentro de un solo pulso.|Para crear silencios absolutos en el compás.",
            quiz_answer=1
        ),
        schemas.LessonCreate(
            lesson_number="9",
            title="B1: TEST del Silencio",
            hint_code="",
            is_quiz=True,
            quiz_question="En la notación de Strudel, ¿qué símbolo utilizamos para representar un silencio musical y dejar un hueco en el compás?",
            quiz_options="El asterisco (*)|El punto (.)|La virgulilla (~)",
            quiz_answer=2
        ),
        schemas.LessonCreate(
            lesson_number="10",
            title="B1: TEST de Ritmo",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Cuál es la función principal de un silencio (representado por ~ en Strudel) dentro de un patrón rítmico?",
            quiz_options="Acelerar el BPM general.|Dar forma, espacio e identidad al ritmo musical.|Crear un acorde mayor.",
            quiz_answer=1
        ),
        schemas.LessonCreate(
            lesson_number="11",
            title="B1: TEST de Sincopación",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Qué técnica rítmica consiste en colocar el estrés musical en las partes o tiempos débiles de un compás?",
            quiz_options="Sincopación|Ritmo Aditivo|Cuantización",
            quiz_answer=0
        ),

        # ===================================================
        # BLOQUE 2: MELODÍA Y ALTURA (Escalas e Intervalos)
        # ===================================================
        schemas.LessonCreate(
            lesson_number="12",
            title="B2: Tono y Formas de Onda",
            hint_code="""// TEORÍA: El sonido musical se distingue del ruido por tener una forma de onda periódica regular.
// Los sintetizadores generan tonos usando ondas: sine (senoidal), square (cuadrada), triangle (triangular) y saw (sierra).
// Prueba a cambiar la forma de onda y evalúa el código para escuchar cómo cambia el timbre del sonido:

note("c4 d4 e4 f4").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="13",
            title="B2: La Octava",
            hint_code="""// TEORÍA: Una octava es el salto a la misma nota, pero más aguda o más grave.
//Tiene una proporción de frecuencia de 2:1. Es la relación armónica más fuerte de la música.
// n() cambia la altura de la nota.
// La diferencia entre n("0") y n("12") es exactamente una octava (12 semitonos).

n("0 12").scale("C:major").s("sine")

// En Strudel, también se puede representar con el número junto a la notam lo que indica en qué octava suena:

// note("c3 c4 c5 c4").s("sine")"""
        ),
        schemas.LessonCreate(
            lesson_number="14",
            title="B2: Frecuencias y Síntesis Básica",
            hint_code="""// TEORÍA: Los sintetizadores generan tonos (frecuencias).
// .s("saw") activa un sintetizador de onda de sierra. n() cambia la altura de la nota.

n("0 2").s("saw")"""
        ),
        schemas.LessonCreate(
            lesson_number="15",
            title="B2: Las Escalas Musicales",
            hint_code="""// TEORÍA: Una escala es un conjunto ordenado de notas.
// No existe un número único de escalas: hay muchas escalas
// y sistemas musicales diferentes.
//
// Algunas de las más habituales son:
//
// Mayor (major)            → 7 notas
// Menor (minor)            → 7 notas
// Pentatónica (pentatonic) → 5 notas
// Cromática (chromatic)    → 12 notas
//
// Strudel permite seleccionar diferentes escalas mediante .scale().
// Prueba a cambiar el tipo de escala y evalúa el código para escuchar cómo cambia la melodía:

n("0 1 2 3 4 5 6").scale("C:major").s("sine")"""
        ),
        schemas.LessonCreate(
            lesson_number="16",
            title="B2: La Escala Mayor",
            hint_code="""// TEORÍA: Las escalas se construyen mediante patrones de Tonos (T) y Semitonos (S).
// La Escala Mayor usa la fórmula: T - T - S - T - T - T - S. 
// Usando .scale("major") forzamos numéricamente esa estructura.

note("0 1 2 3 4 5 6 7").scale("C:major").s("sine")"""
        ),
        schemas.LessonCreate(
            lesson_number="17",
            title="B2: La Escala Menor Natural",
            hint_code="""// TEORÍA: La Escala Menor Natural tiene una fórmula más oscura: T - S - T - T - S - T - T.
// Suele utilizarse para transmitir emociones más sombrías o melancólicas.
// Experimenta cambiando la escala a "C:minor" o "G:major" y vuelve a evaluar.

note("0 1 2 3 4 5 6 7").scale("A:minor").s("triangle")"""
        ),
        schemas.LessonCreate(
            lesson_number="18",
            title="B2: Motivos Melódicos",
            hint_code="""// TEORÍA: Un motivo es un pequeño fragmento melódico altamente reconocible por su ritmo distintivo.
// Son los "bloques de construcción" de las canciones pegadizas.
// Experimenta creando tus propios motivos y combinándolos.

note("c4 [e4 g4] c5 [g4 e4]").s("sine")"""
        ),
        # --- EXÁMENES BLOQUE 2 ---
        schemas.LessonCreate(
            lesson_number="19",
            title="B2: TEST de Melodía",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Qué propósito principal tiene el modificador .scale() en nuestras melodías?",
            quiz_options="Fuerza a los números a ajustarse a una estructura armónica (escala) para que suenen entonados.|Cambia el instrumento de un sintetizador a un piano clásico.|Alarga la duración del compás haciéndolo infinito.",
            quiz_answer=0
        ),
        schemas.LessonCreate(
            lesson_number="20",
            title="B2: TEST de Octavas",
            hint_code="",
            is_quiz=True,
            quiz_question="Al usar números para generar notas con n(), ¿cuántos semitonos de diferencia hay para subir exactamente una octava musical?",
            quiz_options="7 semitonos|8 semitonos|12 semitonos",
            quiz_answer=2
        ),
        schemas.LessonCreate(
            lesson_number="21",
            title="B2: TEST de Forma de Onda",
            hint_code="",
            is_quiz=True,
            quiz_question="Físicamente, ¿qué distingue al sonido puramente musical frente a un ruido caótico?",
            quiz_options="Que siempre se reproduce a más de 120 BPM.|Que se compone de ondas sonoras regulares, ordenadas y periódicas.|Que contiene silencios.",
            quiz_answer=1
        ),
        schemas.LessonCreate(
            lesson_number="22",
            title="B2: TEST de Escalas",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Cuál de las siguientes es la estructura matemática de Tonos (T) y Semitonos (S) para construir una Escala Menor Natural?",
            quiz_options="T - T - S - T - T - T - S|S - S - T - S - S - T - T|T - S - T - T - S - T - T",
            quiz_answer=2
        ),

        # ==========================================
        # BLOQUE 3: TEXTURA Y ARMONÍA
        # ==========================================
        schemas.LessonCreate(
            lesson_number="23",
            title="B3: Multipista (Stacks)",
            hint_code="""// TEORÍA: En un estudio de grabación hay varias pistas (instrumentos) sonando a la vez.
// La función stack() nos permite emular esto, apilando secuencias rítmicas y melódicas.

stack(
  s("bd ~ bd sd"),       // Pista 1 (Bombo y Caja)
  s("hh*8").gain(0.5)    // Pista 2 (Platillos rápidos)
)"""
        ),
        schemas.LessonCreate(
            lesson_number="24",
            title="B3: La Armonía (Acordes y Progresiones)",
            hint_code="""// TEORÍA: Un acorde consiste en reproducir 3 o más notas simultáneamente, apilando intervalos de tercera sobre una nota raíz.
// Una tríada consta de Raíz, Tercera y Quinta. Se reproducen simultáneamente. Esto da soporte a la melodía.
// Los acordes puedes crearlos a mano introduciendo una a una las notas del acorde o usando la función .chord() para que Strudel lo haga por ti.
// Una progresión armónica (o progresión de acordes) es una sucesión de dos o más acordes que se ejecutan uno tras de otro a lo largo de una pieza musical.

// Crea un acorde de Do menor (Cm) y Fa menor (Fm) y escucha cómo suena:
// Haciendolo a mano:
// C  → C4 E4 G4
// Fm → F4 Ab4 C5

note("<[c4,e4,g4] [f4,ab4,c5]>").s("sine").slow(2)

// voicing() permite a Strudel decidir cómo colocar las notas de los acrodes indicados para tocarlos con la transición más suena de uno a otro.
// Si quieres que Strudel lo haga automáticamente, puedes usar .chord() así:

// chord("<Cm Fm>").voicing().s("sine").slow(2)"""
        ),
        schemas.LessonCreate(
            lesson_number="25",
            title="B3: Arpegios (La Armonía en movimiento)",
            hint_code="""// TEORÍA: En lugar de tocar el acorde de golpe, podemos tocar sus notas una a una.
// n() no significa necesariamente “nota”; significa seleccionar el elemento en una determinada posición.
// Por ejemplo, n("0 1 2 1") significa tocar la primera nota del acorde, luego la segunda, luego la tercera y volver a la segunda.
// Esto se llama un arpegio, y es muy útil para crear melodías más fluidas y menos estáticas.

// Crea un arpegio de los acordes Cm y Fm usando n() y .chord(), .voicing() lo usaremos para que Strudel decida cómo colocar las notas.

n("0 1 2").chord("<Cm Fm>").voicing().s("sine")

// Prueba a cambiar el orden de las notas en n() y a agregar más notas para crear arpegios más complejos, vuelve a evaluar para escuchar diferentes arpegios.
// También puedes cambiar los acordes dentro de .chord() para experimentar con diferentes progresiones armónicas.
// Por ejemplo, prueba con n("0 1 2 1 0") y .chord("<Cm Fm Gm>") para crear un arpegio más largo y variado.

// n("0 1 2 1 0").chord("<Cm Fm Gm>").voicing().s("sine")"""
        ),
        schemas.LessonCreate(
            lesson_number="26",
            title="B3: Inversiones y Bajos",
            hint_code="""// TEORÍA: Una inversión cambia qué nota del acorde está en el bajo.
// El acorde sigue siendo el mismo, pero sus notas se reorganizan.
// C mayor:      C - E - G
// 1ª inversión: E - G - C
// 2ª inversión: G - C - E

// Crea un acorde de Do Mayor y sus dos inversiones usando las notas directamente con n():

note("<[c3,e3,g3] [e3,g3,c4] [g2,c3,e3]>").s("triangle")"""
        ),
        schemas.LessonCreate(
            lesson_number="27",
            title="B3: El Timbre (Filtros)",
            hint_code="""// TEORÍA: El timbre es el 'color' del sonido. Un filtro de paso bajo (LPF)
// recorta las frecuencias agudas, simulando que el sonido viene de detrás de una pared.

// Prueba a cambiar el valor de .lpf() para escuchar cómo cambia el timbre del sonido:

n("0 [2 4] 7 4").scale("E:minor").s("saw").lpf(600)"""
        ),
        schemas.LessonCreate(
            lesson_number="28",
            title="B3: Espacio y Retardo",
            hint_code="""// TEORÍA: El procesamiento espacial posiciona el sonido. La reverberación simula que el sonido ocurre dentro de un espacio físico.
// Delay crea copias rítmicas retardadas.
// .room() genera esa textura ambiental 3D. 1.0 es una catedral, 0.1 es un armario pequeño.

// Juega con el valor de .room() para escuchar cómo cambia la sensación de espacio en estos 2 ejemplos, descomenta el que quieres que suene:

n("0 ~ 4 ~").scale("E:minor").s("saw").room(0.8)
// note("c4 ~ e4 ~").s("saw").room(0.8).delay(0.5)"""
        ),
        schemas.LessonCreate(
            lesson_number="29",
            title="B3: Modulación Automática",
            hint_code="""// TEORÍA: Un LFO (Low Frequency Oscillator) permite mover parámetros de forma automática.
// Podemos automatizar un parámetro utilizando otro patrón.
// Aquí le decimos a Strudel que gire los parámetros por nosotros usando un LFO (sine) para mover automáticamente la frecuencia de corte del filtro.
// El filtro se abre y se cierra periódicamente, creando un movimiento continuo en el timbre.
// Fíjate cómo el filtro (.lpf) se abre y se cierra solo, generando texturas musicales vivas.

stack(
  s("bd*4"),

  n("0 2 4 7")
    .scale("E:minor")
    .s("saw")
    .lpf(
      sine.range(300, 3000).fast(0.2)
    )
    .room(0.5)
)"""
        ),
        # --- EXÁMENES BLOQUE 3 ---
        schemas.LessonCreate(
            lesson_number="30",
            title="B3: TEST de Armonía",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Cuál es la diferencia técnica entre programar una Melodía simple y una estructura Armónica (Acorde)?",
            quiz_options="La melodía utiliza silencios, mientras que la armonía ocupa todo el compás.|La melodía reproduce una nota detrás de otra de forma secuencial, mientras que un acorde requiere reproducir varias notas simultáneamente.|Los acordes solo pueden crearse utilizando samples de percusión.",
            quiz_answer=1
        ),
        schemas.LessonCreate(
            lesson_number="31",
            title="B3: TEST de Multipista",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Qué función nos permite reproducir varias secuencias rítmicas o melódicas al mismo tiempo, simulando las múltiples pistas de un estudio de grabación?",
            quiz_options=".room()|.arp()|stack()",
            quiz_answer=2
        ),
        schemas.LessonCreate(
            lesson_number="32",
            title="B3: TEST de Triadas",
            hint_code="",
            is_quiz=True,
            quiz_question="En la construcción de un acorde de tríada básico, ¿qué tres elementos se combinan verticalmente?",
            quiz_options="Síncopa, Cuantización y Shuffle.|Raíz, Tercera y Quinta.|Frecuencia, Onda y Amplitud.",
            quiz_answer=1
        ),
        schemas.LessonCreate(
            lesson_number="33",
            title="B3: TEST de Inversiones",
            hint_code="",
            is_quiz=True,
            quiz_question="¿Qué sucede cuando invertimos un acorde (por ejemplo, tocando un C major pero con la nota E o G en la zona más grave)?",
            quiz_options="Se convierte en un silencio absoluto.|Se suaviza el movimiento del bajo sin cambiar la identidad original del acorde.|El acorde se convierte automáticamente en Menor.",
            quiz_answer=1
        ),
        
        # --- DESPEDIDA ---
        schemas.LessonCreate(
            lesson_number="34",
            title="¡Graduación!",
            hint_code="""// ¡Felicidades! Has superado la Academia de Código Sonoro.
// Ahora dominas el ritmo, el mapeo frecuencial, las escalas, los acordes y la síntesis sonora.
//
// -> Dirígete ahora a 'Nueva Pista' en la cabecera superior.
// ¡Es hora de componer tus propias canciones para la Galería Comunitaria!
//
// Disfruta de esta melodía de graduación:

stack(
  s("bd ~ ~ bd ~ ~ bd ~").fast(2),
  s("hh*8").gain(0.4),
  note("c4 [e4 g4] a4 [g4 e4]").scale("A:minor").s("saw").lpf(1500).room(0.6),
  chord("Am F Dm Em").voicing().s("triangle").slow(2).room(0.8)
).cps(0.8)"""
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