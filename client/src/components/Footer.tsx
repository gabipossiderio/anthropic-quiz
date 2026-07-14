import { useI18n } from '../i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="flex w-full justify-center py-4">
      <a
        href="https://www.linkedin.com/in/gabriella-possiderio/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-round inline-flex items-center gap-1.5 px-3 py-1 text-xs text-text/55 hover:text-accent"
      >
        <span className="text-accent/70">♥</span>
        {t.madeBy} Gabriella Possidério
        <span className="text-accent/70">♥</span>
      </a>
    </footer>
  )
}
