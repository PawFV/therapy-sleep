"""
Generate five therapeutic MP3s with an Argentine Rioplatense-style voice via
OpenAI Chat Completions (audio output, e.g. gpt-audio-mini).

Requires: pip install openai python-dotenv
Usage:    python generar_audios.py
          Set OPENAI_API_KEY in the environment or in a local .env file (never commit it).
"""

import os
import sys
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY", "")
if not API_KEY:
    print("ERROR: OPENAI_API_KEY not found. Add it to .env or your environment.")
    sys.exit(1)

client = OpenAI(api_key=API_KEY)

OUTPUT_DIR = Path("audios")
OUTPUT_DIR.mkdir(exist_ok=True)

SYSTEM_PROMPT = (
    "Sos una voz terapéutica con acento rioplatense argentino auténtico. "
    "Usás 'vos' en lugar de 'tú'. "
    "Tu tono es suave, pausado y cálido, como si acompañaras a alguien en un momento muy difícil. "
    "Ritmo lento, con pequeñas pausas naturales entre frases. Tono íntimo y cercano. "
    "Leé exactamente el texto que te doy, sin agregar ni cambiar nada."
)

AUDIOS = [
    {
        "file": "01_ancla_seguridad_nocturna.mp3",
        "title": "Audio 1 — Ancla de seguridad nocturna",
        "script": """Ahora estoy acá.
Estoy en mi cama.
Este momento no es aquel momento.
Lo que viví fue real y me golpeó fuerte, pero ahora mismo estoy acá, respirando.
Mi sistema nervioso está alterado, pero no estoy indefenso.
No necesito resolver toda mi vida esta noche.
Solo necesito bajar un cambio.
Inhalo lento. Exhalo lento.
Mi cuerpo puede tardar en confiar, y está bien.
No tengo que demostrarle nada a nadie ahora.
Estoy sobreviviendo. Estoy reparándome.
Mi mente puede estar agitada y aun así yo sigo estando acá.
Esta noche el objetivo no es ganar.
El objetivo es descansar un poco.
Un minuto. Después otro.
Estoy a salvo en este instante.""",
    },
    {
        "file": "02_anti_dano_anti_gaslighting.mp3",
        "title": "Audio 2 — Anti-daño / anti-gaslighting",
        "script": """Las frases que me metieron no son mi identidad.
Que me hayan atacado no define mi valor.
Que me hayan humillado no define mi capacidad.
Que me hayan querido quebrar no prueba que yo esté roto.
No soy lo que me dijeron bajo crueldad, manipulación y hostigamiento.
Mi criterio puede volver.
Mi foco puede volver.
Mi energía puede volver.
Mi profesión no desapareció.
Mi inteligencia no desapareció.
Mi dignidad no desapareció.
Estoy herido, no terminado.
Estoy cansado, no vencido.
Estoy saturado, no perdido para siempre.
Puedo reconstruirme por partes.
Hoy no necesito sentirme perfecto.
Solo necesito seguir acá.""",
    },
    {
        "file": "03_para_estudiar_funcionar.mp3",
        "title": "Audio 3 — Para estudiar / funcionar",
        "script": """No tengo que esperar a sentirme bien para empezar.
Puedo empezar roto, cansado, enojado o vacío.
Diez minutos cuentan.
Una sola tarea cuenta.
Abrir el archivo cuenta.
Leer una página cuenta.
Mi cerebro está en recuperación, no en inutilidad.
La concentración puede volver por ventanas cortas.
Voy a usar la ventana que tenga.
No necesito épica.
Necesito tracción.
Una acción simple.
Ahora una más.
Lo mínimo útil ya es progreso.
Estoy reconstruyendo función, no buscando perfección.""",
    },
    {
        "file": "04_terror_nocturno.mp3",
        "title": "Audio 4 — Si te despertás con terror o imágenes",
        "script": """Pará.
Esto es activación.
No es una sentencia.
Mirá alrededor.
Nombrá cinco cosas que están en esta habitación.
Sentí el peso del colchón.
Sentí el aire entrando y saliendo.
Estás en el presente.
No estás allá.
No estás en manos de ellos ahora.
Tu cuerpo recuerda peligro, pero este momento es otro.
Podés volver despacio.
No hace falta pelear con la sensación.
Solo dejar que baje.""",
    },
    {
        "file": "05_kyoto_shinsengumi.mp3",
        "title": "Audio 5 — Kyoto / Tokugawa / Shinsengumi",
        "script": """Cerrás los ojos y no estás escapando: estás cruzando un umbral.
La noche está fresca. El aire huele a madera vieja, piedra húmeda y flores de cerezo.
Estás en Kyoto.
No en la Kyoto apurada del turista, sino en una Kyoto más silenciosa, donde la historia todavía respira entre faroles y callecitas estrechas.

Caminás despacio.
Escuchás el roce de tu ropa y el crujido suave de la grava bajo los pies.
A lo lejos aparece el contorno de Nijo-jo, el castillo asociado a Tokugawa Ieyasu, y todo tiene esa solemnidad rara de los lugares que sobrevivieron a demasiados hombres, demasiadas intrigas y demasiadas despedidas.

Las sakura caen lento.
No como una lluvia triste, sino como una confirmación: hasta lo frágil puede ser hermoso sin pedir permiso.
Cada pétalo que cae no anuncia final.
Anuncia estación.

Seguís caminando y el trayecto te lleva hacia Mibu.
Ahí la ciudad cambia apenas de tono.
Menos ceremonia. Más pulso.
Más borde.
Más acero bajo la seda.
Estás cerca de Mibu-dera y de la zona vinculada al nacimiento del Shinsengumi, donde todavía quedan huellas de esa mezcla absurda y humana de disciplina, lealtad, miedo y destino.

Entrás a un local tenue, medio café, medio refugio, medio altar para obsesivos de la historia.
Te sentás.
Nadie te exige nada.
Nadie te examina.
Nadie te manipula.
Nadie te define.
Solo estás vos, el vapor de una taza caliente, la madera oscura, el murmullo casi sagrado del lugar y esa sensación de que, por un rato, la historia no pesa: acompaña.

Pensás en todos los guerreros rotos que siguieron caminando igual.
No porque no tuvieran miedo.
Sino porque el miedo no tuvo la última palabra.

Afuera, Kyoto sigue floreciendo.
Adentro, algo en vos afloja la guardia.
No del todo.
Lo justo.

Y te decís:
yo también puedo volver.
No igual.
Pero entero de otra manera.

La noche de Kyoto no te promete una vida perfecta.
Te promete algo más serio:
que incluso después del invierno, hay árboles que insisten.
Y florecen igual.""",
    },
]


def generate_track(track: dict) -> None:
    import base64

    out_path = OUTPUT_DIR / track["file"]
    if out_path.exists():
        print(f"  [skip] {track['file']} already exists.")
        return

    print(f"  Generating: {track['title']} ...", end=" ", flush=True)
    response = client.chat.completions.create(
        model="gpt-audio-mini",
        modalities=["text", "audio"],
        audio={"voice": "nova", "format": "mp3"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": track["script"]},
        ],
    )
    audio_data = response.choices[0].message.audio.data
    out_path.write_bytes(base64.b64decode(audio_data))
    print(f"OK -> {out_path}")


def main() -> None:
    print(f"\nGenerating {len(AUDIOS)} tracks into '{OUTPUT_DIR}/'...\n")
    for track in AUDIOS:
        generate_track(track)
    print("\nDone. All files are in the 'audios/' folder.")


if __name__ == "__main__":
    main()
