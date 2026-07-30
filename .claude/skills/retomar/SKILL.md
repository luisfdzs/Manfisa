---
name: retomar
description: >-
  Recupera y resume el contexto del proyecto MANFISA — estado, progreso, última sesión y siguientes
  pasos. Úsala al empezar una sesión (o cuando el usuario escriba /retomar) para ponerse al día antes
  de trabajar. Lee CLAUDE.md, las memorias y el changelog; no modifica nada.
---

# /retomar — Recuperar el contexto del proyecto

Cuando se invoca esta skill, reconstruye el estado del proyecto y preséntalo al usuario de forma
concisa. **Es una operación de sólo lectura**: no cambies archivos.

## Pasos

0. **Origen del contexto:** el contexto de verdad vive en la rama Git **`claude`** (ver memoria
   `flujo-git-y-ramas`). Asegúrate de leerlo desde esa rama y sugiere `git fetch`/`pull` de `claude`
   para partir del último estado. **Nunca mergear ni borrar la rama `claude`.**

1. **Lee** los siguientes archivos (con la herramienta Read; si alguno no existe, indícalo y sigue):
   - `CLAUDE.md` (raíz) — contexto principal, estructura, stack y estado.
   - `.claude/auto-memory/INDEX.md` — foto del estado y puntero a la última sesión.
   - `.claude/auto-memory/CHANGELOG.md` — últimas entradas del historial.
   - La **auto-memoria de sesión más reciente** en `.claude/auto-memory/session-*.md`.
   - `.claude/memory/MEMORY.md` y las memorias relevantes para lo que pida el usuario.

2. **Lee siempre `pendientes-manfisa`**, aunque no venga a cuento. Es la memoria que dice qué datos
   técnicos están sin validar y por qué la web **no puede salir del entorno de test**. Si en la
   sesión se habla de publicar, promocionar a `main` o apuntar un dominio, hay que recordarlo antes
   de tocar nada.

3. **Sintetiza y muestra** un resumen con esta estructura:
   - **Proyecto:** qué es (MANFISA, web corporativa del fabricante de hilo de aluminio) en 1 línea.
   - **Fase / estado actual.**
   - **Últimos cambios** (2-4 puntos del changelog más reciente).
   - **Última sesión:** fecha y qué se hizo.
   - **Bloqueos vigentes** — en particular lo que falta de Manfisa.
   - **Siguiente paso sugerido.**

4. **Pregunta** al usuario en qué quiere trabajar en esta sesión.

## Al terminar la sesión (recordatorio)

Cuando el trabajo implique cambios relevantes, aplica el **protocolo de mantenimiento** (memoria
`convenciones-mantenimiento`): actualiza las memorias afectadas + `MEMORY.md`, añade entrada al
`CHANGELOG.md`, crea/actualiza la `session-<fecha>.md`, refresca `INDEX.md` y `CLAUDE.md` si aplica,
y **propón** el commit a la rama `claude` (no lo ejecutes — memoria `politica-commits`).
