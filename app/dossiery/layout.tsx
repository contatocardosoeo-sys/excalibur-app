import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dossiery — O sistema operacional da conquista',
  description:
    'Não fala por você. Te transforma no cara que dispensa muleta. Coach de conquista com IA, treinado no cânone de atração, carisma e psicologia.',
}

export default function DossieryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dossiery min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30">
      {children}
    </div>
  )
}
