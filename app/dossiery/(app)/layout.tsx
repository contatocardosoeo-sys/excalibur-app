import { Suspense } from 'react'
import DossierySidebar from './components/DossierySidebar'
import AvisoRenovacao from './components/AvisoRenovacao'

export default function DossieryAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DossierySidebar />
      <div className="flex-1 flex flex-col overflow-auto d-grid-bg">
        {/* D330: aviso de renovação nos últimos 35 dias do anual */}
        <Suspense fallback={null}>
          <AvisoRenovacao />
        </Suspense>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
