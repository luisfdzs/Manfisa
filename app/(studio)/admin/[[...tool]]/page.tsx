import type { Metadata, Viewport } from 'next'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

/**
 * El panel de administración completo, servido desde la propia web en `/admin`.
 *
 * Se monta en una ruta comodín (`[[...tool]]`) porque Sanity gestiona su propia navegación
 * por debajo de esa dirección. Quien entra sin sesión ve la pantalla de acceso de Sanity: el
 * contenido sólo se puede leer o cambiar con una cuenta invitada.
 */
export const metadata: Metadata = {
  title: 'Administración · Manfisa',
  // El panel nunca debe aparecer en buscadores.
  robots: { index: false, follow: false },
}

/** Ventana que necesita el panel para funcionar bien en móvil y tablet. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
}

/**
 * No se declara `export const dynamic`: **Cache Components lo rechaza** y el build falla con
 * «Route segment config "dynamic" is not compatible with nextConfig.cacheComponents». No hace
 * falta, además: el panel es una aplicación de cliente que se monta en el navegador contra el
 * proyecto de Sanity, así que lo que se prerrenderiza es una cáscara vacía y el contenido lo
 * trae el propio Sanity al cargar.
 */
export default function AdminPage() {
  return <NextStudio config={config} />
}
