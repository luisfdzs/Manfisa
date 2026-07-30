---
name: flujo-git-y-ramas
description: Modelo de ramas del repo, rama claude para contexto (nunca se mergea/borra), sync antes de trabajar y rama por tarea
metadata:
  type: project
---

Reglas de Git y flujo de trabajo del proyecto, heredadas de SANGIL STUDIO.

## Repositorio

- **URL:** https://github.com/luisfdzs/Manfisa

## Modelo de ramas

- **`main`** — estado de producción ya subido.
- **`develop`** — lo que se va a subir a producción.
- **`test`** — entorno TEST; **es donde se desarrolla el día a día** y la rama que despliega el
  proyecto `manfisatest` (ver [[despliegue-vercel]]).
- **Ramas temporales** — se sacan de `test` para desarrollar algo y se fusionan de vuelta a `test`.
  **«Morir» es literal: se BORRAN** (ver abajo).
- **`claude`** — rama especial de CONTEXTO, huérfana y aislada del ciclo de despliegue.

## Una rama temporal se BORRA al mergearla en `test`

Cuando su contenido ya está en `test`, la rama desaparece, en local y en GitHub. No se dejan ramas
viejas colgando en el remoto; el historial queda en `test`, que es donde vive el código.

```bash
git checkout test && git pull --ff-only
git merge --no-ff feature/lo-que-sea      # commit de merge explícito: se ve qué entró y cuándo
git push origin test
git branch -d feature/lo-que-sea          # -d, no -D: falla si quedara algo sin mergear
git push origin --delete feature/lo-que-sea
```

- **`git branch -d` (minúscula) a propósito.** Se niega a borrar si la rama tiene commits que no
  estén en `test`, así que hace de red de seguridad. Nunca `-D`.
- **`--no-ff` en el merge.** Deja un commit de merge aunque se pudiera avanzar en línea recta, de
  modo que en `test` se ve el bloque de trabajo que entró. Borrar la rama después **no pierde
  historia**: el commit de merge conserva la referencia a esos commits.

## Política de merge: `--no-ff` por defecto, NUNCA squash en las promociones

- **Por defecto, `git merge --no-ff`** (rama temporal → `test`).
- **NUNCA squash en las promociones** (`test` → `develop` → `main`). Es la regla dura.
- **Squash sólo como excepción**, en ramas pequeñas con historial de tanteo («wip», «ahora sí»).

**Por qué no squash por defecto en este repo:** el **mismo código viaja por tres ramas largas**
(`test` → `develop` → `main`). El squash crea commits **nuevos**, con SHA distinto, así que las
ramas dejan de compartir historia y Git ya no reconoce «esto ya está allí»: cada promoción reabre
conflictos por cambios que ya estaban aplicados. Con merges normales, el mismo commit se reconoce en
las tres y las promociones son limpias. El squash brilla en el modelo de una sola rama principal con
Pull Requests, que no es el de este repo.

Efecto secundario a recordar si alguna vez se hace squash: Git no considera la rama fusionada (sus
commits originales no están en `test`), así que `git branch -d` se niega y hay que usar `-D`, que
borra sin comprobar nada.

## Rama `claude` (contexto) — REGLAS INVIOLABLES

- Contiene `.claude/` y `CLAUDE.md` con todo el contexto del proyecto.
- Es una rama **huérfana** (`git checkout --orphan claude`): sin historia compartida con las demás,
  lo que refuerza que nunca se mergea.
- **NUNCA se fusiona** con `main`, `develop`, `test` ni ninguna otra rama.
- **NUNCA se elimina.**
- **Implicación práctica:** al ser huérfana, `.claude/` y `CLAUDE.md` NO existen en el árbol de las
  ramas de código — y de hecho el `.gitignore` de la rama de código los ignora, para que no se
  cuelen por descuido. Para trabajar con el contexto disponible mientras se programa, un
  **worktree** dedicado: `git worktree add ../manfisa-claude claude`.

### ⚠️ TRAMPA: el ciclo de worktree deja el árbol principal en `main`

Comprobado **dos veces** el 2026-07-30: tras un ciclo
`git worktree add ../manfisa-claude claude` … `git worktree remove ../manfisa-claude`, el **árbol de
trabajo principal aparece en `main`**, no en la rama en la que estabas. Y como en `main` sólo hay el
README, **el código desaparece del disco** y parece que se ha perdido algo grave.

No se pierde nada: está en `origin/test`. La receta, siempre, al terminar de tocar el contexto:

```bash
git checkout test
git diff --stat HEAD origin/test    # vacío = el árbol está intacto
```

Por eso conviene **dejar el worktree del contexto puesto** en vez de crearlo y borrarlo cada vez: el
ciclo es lo que muerde.
- **Claude siempre toma el contexto desde esta rama.**

## Flujo de trabajo por cambio

1. **Antes de empezar:** sincronizar (`git fetch` + `pull` de `test` y de `claude`).
2. **Crear una rama temporal** con nombre representativo, sacada de **`test`**.
3. Al **finalizar**: el código a su rama temporal (y de ahí a `test`), y el **contexto actualizado**
   siempre a la **rama `claude`**.
4. Todo respetando [[politica-commits]]: Claude **propone**, el usuario ejecuta.

Relacionado: [[politica-commits]], [[convenciones-mantenimiento]], [[cuenta-git-gh]],
[[despliegue-vercel]].
