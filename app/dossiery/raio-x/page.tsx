import type { Metadata } from 'next'
import RaioXClient from './RaioXClient'

export const metadata: Metadata = {
  title: 'Raio-X: qual é o seu Modo? · Dossiery',
  description:
    'Teste de 2 minutos: descubra qual padrão está matando suas conversas — e as 3 correções imediatas para o seu caso.',
}

// ♠ Quiz gamificado — destino de tráfego frio (funil alternativo à página direta).
export default function RaioXPage() {
  return <RaioXClient />
}
