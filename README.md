# trauma-sleep

Aplicación web (y script opcional en Python) para generar **audios terapéuticos personalizados** con voz de IA, pensada para acompañar la regulación del sistema nervioso en contextos de **estrés extremo, hostigamiento prolongado o secuelas de manipulación psicológica sostenida** (incluyendo dinámicas comparables a técnicas de descomposición psicológica).

Los textos y la voz se orientan a un tono **rioplatense (vos)**, directo y anclado en el cuerpo, sin motivación vacía.

---

## Objetivo del proyecto

- Ofrecer una herramienta **local-first**: la persona usa su propia **API key de OpenAI** en el navegador; los audios se guardan en **localStorage** del dispositivo.
- Generar guiones y audio alineados con **categorías terapéuticas** (ancla nocturna, anti-gaslighting, viaje mental, etc.) y con **parámetros ajustables** (calidez, cercanía, ritmo, duración, voz).
- Complementar el uso con **auriculares** cuando sea posible, para favorecer la contención sensorial y reducir la hipervigilancia al entorno.

Este proyecto es **apoyo psicoeducativo y de autorregulación**; no sustituye psicoterapia, psiquiatría ni emergencias. Si estás en riesgo, buscá ayuda profesional o líneas de crisis en tu país.

---

## Beneficios que persigue (no garantizados)

Cada persona responde distinto. En términos de **diseño de contenido**, la app apunta a:

| Área | Enfoque |
|------|--------|
| **Sistema nervioso** | Textos que invitan a bajar la activación, respirar y anclarse al presente. |
| **Sueño** | Encabezados como ancla nocturna o terror nocturno, con duración configurable. |
| **Identidad y realidad** | Audios anti-gaslighting que nombran el daño sin minimizarlo. |
| **Función diaria** | Piezas para “arrancar” tareas pequeñas sin exigencia de rendimiento. |
| **Visualización** | Imagen generada en paralelo al audio (mismo flujo de generación) para acompañar el guion. |

Nada de esto reemplaza el juicio clínico ni un plan de tratamiento individual.

---

## Funcionalidades principales (app web)

- **Encabezados terapéuticos** predefinidos (según `src/lib/prompts.js`).
- **Contexto personal** opcional para afinar el guion y la imagen.
- **Modelos configurables**: texto, audio (chat con salida de audio) e imagen ([Image API / GPT Image](https://developers.openai.com/api/docs/guides/image-generation)).
- **Duración** del guion (~1–8 min en presets) y **voces** con vista previa corta.
- **Biblioteca local** de audios, reproducción tras recargar (audio en base64 en almacenamiento local).
- **Playlist** con loop, descarga de pistas y modal de reproducción.
- **Tests** con Vitest (`pnpm test`).

---

## Privacidad y API key

- La **API key** se guarda en **sessionStorage** (típicamente se pierde al cerrar la pestaña/navegador; revisá el comportamiento de tu navegador).
- Las llamadas a OpenAI salen **desde tu navegador** hacia los servidores de OpenAI (no hay backend propio del proyecto).
- Los **audios** y preferencias de modelos persisten en **localStorage** en tu máquina.

**Recomendación:** no subas nunca un archivo `.env` ni claves al repositorio. El `.env` está en `.gitignore`.

---

## Requisitos

- [Node.js](https://nodejs.org/) (versión reciente LTS recomendada)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- Cuenta OpenAI con acceso a los modelos que elijas (texto, audio con modalidades de audio, e imagen si usás generación de imágenes)

---

## Uso rápido (app web)

```bash
cd trauma-sleep-app
pnpm install
pnpm dev
```

Abrí la URL que muestre Vite (por ejemplo `http://localhost:5173`), ingresá tu API key, elegí categoría y parámetros, y pulsá **Generar**.

Build de producción:

```bash
pnpm build
pnpm preview
```

Tests:

```bash
pnpm test
```

---

## Script Python (`generar_audios.py`)

En la raíz del repo hay un script para generar audios desde la terminal usando la API de chat con salida de audio (útil si preferís no usar el navegador). Requiere `OPENAI_API_KEY` en el entorno o en `.env` (solo en tu máquina, no commitear).

```bash
pip install openai python-dotenv
python generar_audios.py
```

(Ajustá el script según los modelos y voces disponibles en tu cuenta.)

---

## Estructura del repositorio

```
trauma-sleep/
├── README.md                 # Este archivo
├── generar_audios.py         # Generación por CLI (opcional)
├── trauma-sleep-app/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── lib/              # OpenAI, prompts, storage, chunks de audio
│   │   ├── components/
│   │   └── test/
│   └── README.md             # Detalle de desarrollo del front
└── ...
```

---

## Documentación relacionada

- [OpenAI — Image generation](https://developers.openai.com/api/docs/guides/image-generation)
- Políticas y límites de uso: [OpenAI](https://openai.com/policies)

---

## Contribuciones

Issues y pull requests son bienvenidos respetando el alcance del proyecto (herramienta de apoyo, sin sustituir ayuda profesional).

---

## Aviso legal

El software se ofrece “tal cual”, sin garantías. El uso de contenido generado por IA es responsabilidad de quien lo utiliza. Para salud mental grave, acudí a profesionales titulados.
