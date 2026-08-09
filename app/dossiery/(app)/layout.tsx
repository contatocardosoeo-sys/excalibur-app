import DossierySidebar from './components/DossierySidebar'

export default function DossieryAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DossierySidebar />
      <main className="flex-1 overflow-auto d-grid-bg">{children}</main>
    </div>
  )
}
