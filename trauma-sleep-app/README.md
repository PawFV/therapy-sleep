# trauma-sleep-app

Frontend de **trauma-sleep**: React 19, Vite 8, Tailwind CSS 4, Vitest.

La descripción del producto, objetivos, beneficios y avisos está en el [README del repositorio](../README.md).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (HMR) |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Vista previa del build |
| `pnpm test` | Tests unitarios (Vitest, jsdom) |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm lint` | ESLint |

## Instalación

```bash
pnpm install
```

## Stack

- **openai** — cliente en el navegador (`dangerouslyAllowBrowser: true`; la key es tuya y no pasa por un backend del proyecto).
- **React** — UI con elementos `<audio>` nativos para reproducción.

## Tests

Los tests cubren utilidades (`storage`, `prompts`, `audioChunks`, previews de voz). Ejecutá `pnpm test` antes de abrir un PR.

## Variables de entorno

La app **no** requiere `.env` para desarrollo: la API key se ingresa en la UI. Para despliegues propios, no expongas claves en el bundle; este diseño asume uso personal con key en el cliente.
