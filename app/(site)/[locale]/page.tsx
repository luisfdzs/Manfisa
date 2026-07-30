import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Figures } from '@/components/sections/Figures'
import { Hero } from '@/components/sections/Hero'
import { LineCard } from '@/components/sections/LineCard'
import { Prose } from '@/components/sections/Prose'
import { Reveal } from '@/components/ui/Reveal'
import { getCompany, getFeaturedProductLines } from '@/lib/content'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const [featured, company] = await Promise.all([getFeaturedProductLines(7), getCompany()])
  const [hero, ...pool] = featured
  if (!hero) notFound()

  // La rejilla va en ciclos de tres piezas: una a ancho completo + dos a mitad. Sólo queda
  // hueco cuando sobra UNA pieza a mitad (resto 2), y entonces se recorta: un hueco vacío
  // al lado de la última línea se ve peor que una línea menos. Si el resto es 1, esa pieza
  // es ancha y cierra la fila entera, así que se queda.
  const rest = pool.length % 3 === 2 ? pool.slice(0, -1) : pool

  return (
    <>
      <Hero line={hero} company={company} locale={locale} dictionary={t} />

      {/* Quién es Manfisa, en el primer párrafo del panel y nada más. La página Empresa
          cuenta el resto; repetirlo aquí sería decir dos veces lo mismo a media pantalla. */}
      <section className="page-gutter pt-(--spacing-section)">
        <div className="md:flex md:items-start md:justify-between md:gap-16">
          <Prose
            paragraphs={company.statement[locale].slice(0, 1)}
            className="text-lead font-normal"
          />
          <Link
            href={href(locale, 'company')}
            className="link-underline tap mt-6 inline-block shrink-0 text-small md:mt-3"
          >
            {t.home.companyCta}
          </Link>
        </div>
      </section>

      {/* Líneas de producto: ritmo alterno ancho/mitad para que no se lea como catálogo. */}
      <section className="page-gutter pt-(--spacing-section)">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="eyebrow">{t.home.productLines}</h2>
          <Link href={href(locale, 'products')} className="link-underline tap text-small">
            {t.home.viewAllProducts}
          </Link>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-16 md:mt-16 md:grid-cols-2 md:gap-y-24">
          {rest.map((line, index) => {
            // Cada tercera pieza ocupa el ancho completo. El col-span va en el hijo directo
            // de la rejilla (Reveal), no en la ficha.
            const wide = index % 3 === 0
            return (
              <Reveal
                key={line.slug}
                step={index % 2}
                className={wide ? 'md:col-span-2' : undefined}
              >
                <LineCard
                  line={line}
                  locale={locale}
                  dictionary={t}
                  span={wide ? 'wide' : 'half'}
                />
              </Reveal>
            )
          })}
        </div>
      </section>

      <div className="mt-(--spacing-section)">
        <Figures company={company} locale={locale} dictionary={t} />
      </div>

      {/* Cierre: una sola llamada a la acción. En B2B el objetivo de la portada no es
          vender, es que alguien escriba pidiendo una aleación concreta. */}
      <section className="page-gutter pt-(--spacing-section)">
        <div className="border-t border-line pt-12 md:flex md:items-end md:justify-between md:gap-16">
          <div>
            <h2 className="text-title max-w-xl font-semibold text-balance">
              {t.home.contactTitle}
            </h2>
            <p className="mt-4 max-w-prose text-graphite-soft">{t.home.contactLead}</p>
          </div>
          <Link
            href={href(locale, 'contact')}
            className="link-underline tap mt-8 inline-block shrink-0 text-small text-accent md:mt-0"
          >
            {t.home.contactCta}
          </Link>
        </div>
      </section>
    </>
  )
}
