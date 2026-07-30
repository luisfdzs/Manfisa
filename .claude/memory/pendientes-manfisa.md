---
name: pendientes-manfisa
description: CRÍTICO — qué datos técnicos de la web NO están validados por Manfisa y por qué no puede salir del entorno de test hasta que lo estén
metadata:
  type: project
---

**La web está terminada a nivel técnico, pero no puede publicarse en producción todavía.** Parte
del contenido son valores plausibles del sector redactados a partir de las normas EN 573-3 y
EN ISO 18273 y de la práctica habitual — **no datos facilitados por Manfisa**.

## Qué está verificado

Contra manfisa.com, Informa D&B y la Asociación Española del Aluminio (ver
[[identidad-manfisa]]): razón social y estructura del grupo, dirección, CP, teléfono, fax, email,
coordenadas, fundación en 1973, Dalian Manfisa (2008), las cinco actividades, energía 100 %
renovable y la planta fotovoltaica.

## Qué hay que confirmar antes de publicar

1. **Tablas de aleaciones** — designaciones, purezas, resistencias, alargamientos y diámetros de
   las cinco líneas.
2. **Formatos de suministro** — pesos de bobina y embalajes.
3. **Cifras de portada** — capacidad instalada (se ha puesto 3.500 t, que es la de Electrolead) y
   facturación.
4. **Certificaciones** — números y alcances de ISO 9001 e ISO 14001. Si alguna no está vigente, se
   **borra la entrada**: en una auditoría de cliente, una certificación caducada en la web pesa más
   que no tenerla.
5. **Logotipo** — el wordmark (`components/layout/Wordmark.tsx`) y el favicon
   (`scripts/generate-brand-assets.mjs`) son un montaje tipográfico provisional. Cuando llegue el
   vector oficial se sustituyen ahí y nada más cambia.
6. **Fotografía** — el catálogo usa imágenes generadas
   (`scripts/generate-placeholders.mjs`), con «IMAGEN PROVISIONAL» escrito encima a propósito. Se
   sustituyen subiendo las reales desde `/admin`, y luego se borra el script.

Los puntos 1-4 están marcados uno por uno en la cabecera de
`scripts/migration/content-snapshot.mjs`, y resumidos en el README.

## Por qué esto es una regla y no un aviso

**Publicar una tabla de aleaciones inventada en una web industrial es peor que no tener tabla.**
Un comprador de metalización elige por pureza y diámetro: si pide una 1085 en 1,20 mm porque la
web la anuncia y resulta que no se fabrica, no vuelve a pedir presupuesto. El coste de una cifra
mal puesta no es una corrección, es un cliente.

**Mientras 1-4 no estén confirmados, la web se queda en el entorno de test**, que emite `noindex`
y `robots: disallow` automáticamente (ver [[despliegue-vercel]]). Es exactamente para lo que está
ese entorno.

Relacionado: [[identidad-manfisa]], [[despliegue-vercel]], [[panel-administracion]].
