'use client'

export function WelcomeScreen({ onSelectAgent }: { onSelectAgent: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-lg animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-alex-primary to-alex-accent flex items-center justify-center glow">
          <span className="text-4xl font-bold">A</span>
        </div>

        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-alex-primary to-alex-accent bg-clip-text text-transparent">
          AlexGPT
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Votre assistant IA pour coder, cr&eacute;er et construire ce que vous voulez.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-alex-card border border-gray-800 hover:border-alex-primary/50 transition-colors">
            <div className="text-2xl mb-2">&#x1F4BB;</div>
            <h3 className="font-semibold mb-1">Coder</h3>
            <p className="text-sm text-gray-500">&Eacute;crire et structurer du code</p>
          </div>
          <div className="p-4 rounded-xl bg-alex-card border border-gray-800 hover:border-alex-primary/50 transition-colors">
            <div className="text-2xl mb-2">&#x1F916;</div>
            <h3 className="font-semibold mb-1">Agents</h3>
            <p className="text-sm text-gray-500">Cr&eacute;er vos propres agents IA</p>
          </div>
          <div className="p-4 rounded-xl bg-alex-card border border-gray-800 hover:border-alex-primary/50 transition-colors">
            <div className="text-2xl mb-2">&#x2728;</div>
            <h3 className="font-semibold mb-1">Cr&eacute;er</h3>
            <p className="text-sm text-gray-500">Construire n&apos;importe quoi</p>
          </div>
        </div>

        <button
          onClick={onSelectAgent}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-alex-primary to-alex-accent font-semibold hover:opacity-90 transition-opacity text-lg"
        >
          Commencer avec AlexGPT
        </button>
      </div>
    </div>
  )
}
