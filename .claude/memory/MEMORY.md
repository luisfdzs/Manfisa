# MEMORY.md — Índice de memorias (MANFISA)

Índice de las memorias normales del proyecto. Una línea por memoria. El contenido vive en cada
archivo `.md`, nunca aquí.

- [Identidad de Manfisa](identidad-manfisa.md) — quién es Manfisa, grupo, planta, contacto y qué fabrica, con fuentes
- [Encargo y competencia](encargo-y-competencia.md) — de dónde sale el proyecto: Electrolead como referencia y por qué Manfisa es su competidor directo
- [Pendientes de Manfisa](pendientes-manfisa.md) — **CRÍTICO**: qué datos están sin validar y por qué la web no puede salir de test
- [Arquitectura de la web](arquitectura-web.md) — stack (Next.js 16 + TS + Tailwind 4), patrones (puerta única, estático primero, tokens, `<Media>`, `spec-table`)
- [Panel de administración](panel-administracion.md) — Sanity en `/admin`: proyecto `65pypeao`, modelo de contenido y qué puede editar Manfisa
- [Diseño web y referencias](diseno-web-referencias.md) — lenguaje visual «aluminio»: tokens, tipografía técnica, tablas como ficha impresa
- [Despliegue en Vercel](despliegue-vercel.md) — dos proyectos (prod ← `main`, test ← `test`) y por qué la indexación no puede depender de `VERCEL_ENV`
- [Verificación y despliegue](verificacion-y-despliegue.md) — `check:mobile` obligatorio en interfaz; los fallos reales que ya ha cazado
- [Trampas de la migración a Sanity](trampas-migracion-sanity.md) — el punto en el `_id`, el `file://` del `_sanityAsset` y el `_type` de los objetos
- [Sistema de contexto](sistema-contexto.md) — cómo funciona la memoria/skills/settings en `.claude/`
- [Convenciones de mantenimiento](convenciones-mantenimiento.md) — actualizar memorias + changelog + CLAUDE.md en cada cambio
- [Política de commits](politica-commits.md) — Claude nunca hace commit/push; propone mensaje en inglés
- [Flujo Git y ramas](flujo-git-y-ramas.md) — modelo de ramas, rama `claude` de contexto (no merge/no borrar), rama por tarea
- [Seguridad de secretos](seguridad-secretos.md) — nunca subir credenciales/keys/tokens/.env
- [Cuenta Git/gh del repo](cuenta-git-gh.md) — en este repo la única cuenta activa es la personal `luisfdzs`
