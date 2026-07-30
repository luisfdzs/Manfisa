---
name: seguridad-secretos
description: Nunca subir credenciales, keys, tokens ni .env a GitHub; añadirlos al .gitignore antes de subir nada
metadata:
  type: feedback
---

**Nunca se sincronizan con GitHub** credenciales, keys, API keys, tokens de MCP ni variables de
entorno. Cada vez que se añada un secreto nuevo —o un fichero local de configuración de un
desarrollador para una integración— hay que incluirlo en `.gitignore` **antes** de subir nada.

**Why:** un secreto en el historial de Git no se borra rotándolo del fichero: sigue ahí en cualquier
clon y en cualquier fork. Y este repo es público en potencia.

**How to apply:**

- `.env.local` está gitignorado y **nunca** se sube. La plantilla que sí se versiona es
  `.env.example`, con las claves y sin los valores.
- El `.gitignore` de la rama de código cubre además `.env*`, `*.pem`, `*.key`, `*token*.json`,
  ficheros de recovery codes y configuraciones locales de MCP.
- **También ignora `.claude/` y `CLAUDE.md`** en las ramas de código: el contexto vive en la rama
  huérfana `claude` y así no se cuela por descuido (ver [[flujo-git-y-ramas]]).

## Secretos de este proyecto y dónde están

- **`SANITY_REVALIDATE_SECRET`** — generado al crear el proyecto (2026-07-30). Está en `.env.local`
  y tiene que ponerse igual en los dos proyectos de Vercel y en el webhook de sanity.io/manage.
- **`SANITY_API_WRITE_TOKEN`** — **vacío a propósito**. No hace falta: la migración usa la sesión de
  `sanity login` y la web sólo lee. Si algún día se necesita, se crea en sanity.io/manage › API ›
  Tokens con permiso Editor y **no se comparte por chat**.
- **`NEXT_PUBLIC_SANITY_PROJECT_ID`** y **`NEXT_PUBLIC_SANITY_DATASET`** no son secretos: van en el
  HTML de cualquier web con Sanity.

Relacionado: [[flujo-git-y-ramas]], [[despliegue-vercel]], [[panel-administracion]].
