import Head from 'next/head'
import { AIAgendaApp } from '@/components/AIAgenda'

export default function Home() {
  return (
    <>
      <Head>
        <title>ti-lex IA Agenda</title>
        <meta name="description" content="Agenda intelligent propulsé par l'IA - Produit québécois par Alex Marceau Prévost" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Alex Marceau Prévost" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%2322d3ee'/><text x='16' y='22' text-anchor='middle' font-size='14' font-weight='900' fill='white'>tl</text></svg>" />
      </Head>
      <div className="h-screen">
        <AIAgendaApp />
      </div>
    </>
  )
}
