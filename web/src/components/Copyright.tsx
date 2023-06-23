import Link from 'next/link'

export default function Copyright() {
  return (
    <div className="text-sm leading-relaxed text-gray-200">
      Feito por Mateus no NLW da{' '}
      <Link
        target="_blank"
        rel="noreferrer"
        href="https://rocketseat.com.br"
        className="underline transition-colors hover:text-gray-100"
      >
        Rocketseat
      </Link>
    </div>
  )
}
