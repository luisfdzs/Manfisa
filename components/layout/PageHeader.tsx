/**
 * Cabecera de una página interior: título y entradilla.
 *
 * Existe como componente y no como copia en cada página por una razón práctica: las cuatro
 * páginas interiores comparten el mismo `padding-top`, y ese valor tiene que compensar la
 * barra sticky. Repartido en cuatro ficheros, se desincroniza a la primera que alguien
 * toque una.
 */
export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="page-gutter pt-32 pb-12 md:pt-44 md:pb-16">
      <h1 className="text-display max-w-4xl font-semibold text-balance">{title}</h1>
      {lead && <p className="text-lead mt-6 max-w-2xl text-graphite-soft">{lead}</p>}
    </header>
  )
}
