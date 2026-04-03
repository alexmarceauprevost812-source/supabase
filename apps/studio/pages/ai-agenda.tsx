import Head from 'next/head'
import { AIAgendaApp } from 'components/interfaces/AIAgenda'
import type { NextPageWithLayout } from 'types'

const AIAgendaPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>AI Agenda | Supabase</title>
        <meta name="description" content="AI-powered agenda and scheduling assistant" />
      </Head>
      <div className="h-screen">
        <AIAgendaApp />
      </div>
    </>
  )
}

AIAgendaPage.getLayout = (page) => page

export default AIAgendaPage
