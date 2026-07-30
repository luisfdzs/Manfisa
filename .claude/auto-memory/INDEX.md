# INDEX.md — Auto-memorias (MANFISA)

Foto del estado del proyecto y puntero a la última sesión. Lo lee la skill `/retomar`.

## Estado (2026-07-30)

**Fase:** arranque terminado. Web trilingüe (es/en/fr) **completa a nivel técnico y verificada en
local**: `npm run check` limpio, `npm run check:mobile` **26/26**, `npm run build` con **48 rutas
prerrenderizadas**. Panel de Sanity creado (**`65pypeao`**) con el contenido inicial importado.

**Desplegado y verificado en real:** el código está en `origin/test` (commit de merge `2c8dc01`) y
**https://manfisatest.vercel.app** pasa **26/26** en `check:mobile`.

**Bloqueos y cabos sueltos:**

1. **La rama `claude` no existe todavía en GitHub.** Estos ficheros de contexto están sólo en el
   árbol de trabajo local: el `git worktree add --orphan` para crearla quedó **bloqueado por la
   política de permisos**. Los comandos están dados al usuario.
2. **Los dos proyectos de Vercel despliegan la misma rama (`test`).** Hay que poner las Production
   Branch a mano: `manfisa` → `main`, `manfisatest` → `test`. Ver `despliegue-vercel`.
3. **`develop` arrastra el código de la web.** Se creó desde `test` y el `git reset --hard` + force
   push para devolverla a `main` quedó bloqueado. No es urgente (no despliega nada), pero conviene
   arreglarlo para que `develop` signifique lo que dice el modelo de ramas.
4. **Manfisa tiene que validar los datos técnicos** (aleaciones, formatos, cifras, certificaciones).
   Hasta entonces la web **no sale de test**. Ver `pendientes-manfisa`.
5. Falta el **webhook de revalidación** en sanity.io/manage › API › Webhooks.

**Siguiente paso:** crear y subir la rama `claude`, corregir las Production Branch en Vercel y mandar
a Manfisa la lista de datos por confirmar.

## Sesiones

- [session-2026-07-30.md](session-2026-07-30.md) — arranque completo del proyecto: web, panel de
  Sanity, contenido inicial y contexto.
