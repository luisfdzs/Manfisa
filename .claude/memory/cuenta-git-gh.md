---
name: cuenta-git-gh
description: En este repo la única cuenta activa es la personal luisfdzs; la del trabajo nunca se usa. Sanity y Vercel van con la misma cuenta personal
metadata:
  type: project
---

La **única** cuenta que interactúa con servicios externos en este proyecto es la **personal**:

| Servicio | Cuenta                                                    |
| -------- | --------------------------------------------------------- |
| GitHub   | **`luisfdzs`** (`luisfsangil@gmail.com`), vía `gh` CLI    |
| Sanity   | `luisfsangil@gmail.com` (org «Luis Fernández Sangil»)     |
| Vercel   | `luisfsangil-9858`                                        |

La cuenta del trabajo (`luissangil` / `lfernandezs@mobilesmart.city`) **nunca** se usa aquí, aunque
esté también autenticada en `gh` y sea la que aparece como email por defecto del entorno.

**Why:** es un proyecto personal; mezclar la cuenta corporativa deja commits firmados con un correo
de empresa en un repo que no es de la empresa, y eso después no se limpia sin reescribir historia.

**How to apply:**

- **Ya está bien configurado (comprobado 2026-07-30).** Este repo tiene un override local:
  `git config user.email` → **`luisfdzs@users.noreply.github.com`**, no el correo del trabajo (que
  sí es el global, `lfernandezs@mobilesmart.city`). El primer commit (`2d131ab`) está firmado con
  ese correo de GitHub, así que el historial está limpio.
- Si alguna vez sale el del trabajo, corregirlo **a nivel de repositorio**, nunca global:

  ```bash
  git config user.name  "Luis Fernández Sangil"
  git config user.email "luisfdzs@users.noreply.github.com"
  ```

- `gh auth status` tiene que mostrar `luisfdzs` como **cuenta activa** (lo está). Si no,
  `gh auth switch`.

Relacionado: [[flujo-git-y-ramas]], [[seguridad-secretos]].
