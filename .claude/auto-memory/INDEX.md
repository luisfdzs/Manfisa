# INDEX.md — Auto-memorias (MANFISA)

Foto del estado del proyecto y puntero a la última sesión. Lo lee la skill `/retomar`.

## Estado (2026-07-30)

**Fase:** arranque terminado. Web trilingüe (es/en/fr) **completa a nivel técnico y verificada en
local**: `npm run check` limpio, `npm run check:mobile` **26/26**, `npm run build` con **48 rutas
prerrenderizadas**. Panel de Sanity creado (**`65pypeao`**) con el contenido inicial importado.

**Desplegado y verificado en real:** el código está en `origin/test` (commit de merge `2c8dc01`) y
**https://manfisatest.vercel.app** pasa **26/26** en `check:mobile`.

**Infraestructura terminada:** rama `claude` publicada, Production Branch correctas (`manfisa` →
`main`, `manfisatest` → `test`), la rama `claude` ya no despliega, y el **webhook de revalidación
creado y verificado de extremo a extremo: 10 segundos** de publicar a verse.

**Cabos sueltos:**

1. **Manfisa tiene que validar los datos técnicos** — aleaciones, formatos de bobina, capacidad
   (3.500 t son de Electrolead) y certificaciones. Hasta entonces la web **no sale de test**. Es el
   único bloqueo de verdad. Ver `pendientes-manfisa`.
2. **`develop` arrastra el código de la web.** Se creó desde `test` y el `reset --hard` + force push
   para devolverla a `main` quedó bloqueado por política. No despliega nada, así que no corre prisa.
3. **Falta el webhook de producción**, para cuando `main` reciba la web (el plan admite 2).
4. Falta **invitar a quien vaya a editar** en sanity.io/manage › Members.
5. `manfisa.vercel.app` sirve un build de `test` (primer despliegue de un proyecto nuevo). Sale
   `noindex` y se resolverá al promocionar a `main`. Ver `despliegue-vercel`.

**Siguiente paso:** mandar a Manfisa la lista de datos por confirmar. El resto está listo.

## Sesiones

- [session-2026-07-30.md](session-2026-07-30.md) — arranque completo del proyecto: web, panel de
  Sanity, contenido inicial y contexto.
