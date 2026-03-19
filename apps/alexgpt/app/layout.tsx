import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlexGPT - Assistant IA',
  description: 'Créez vos propres agents IA avec AlexGPT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
