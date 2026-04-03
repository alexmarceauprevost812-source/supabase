import Head from 'next/head'
import { AIAgendaApp } from '@/components/AIAgenda'

export default function Home() {
  return (
    <>
      <Head>
        <title>ti-lex IA Agenda</title>
        <meta name="description" content="Agenda intelligent propulsé par l'IA - Produit québécois par Alex Marceau Prévost" />
        <meta name="author" content="Alex Marceau Prévost" />

        {/* Mobile app viewport - full screen, no zoom, HD */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />

        {/* PWA - Installable on Android & iOS */}
        <meta name="application-name" content="ti-lex IA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ti-lex IA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />

        {/* Open Graph */}
        <meta property="og:title" content="ti-lex IA Agenda" />
        <meta property="og:description" content="Agenda intelligent propulsé par l'IA - Produit québécois" />
        <meta property="og:type" content="website" />

        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%2322d3ee'/><text x='16' y='22' text-anchor='middle' font-size='14' font-weight='900' fill='white'>tl</text></svg>" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className="h-screen h-[100dvh] w-screen overflow-hidden">
        <AIAgendaApp />
      </div>
    </>
  )
}
