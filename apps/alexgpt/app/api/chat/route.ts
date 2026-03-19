import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { messages, systemPrompt } = await request.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured. Add ANTHROPIC_API_KEY to .env.local' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt || 'Tu es un assistant IA utile. Réponds en français.',
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text || 'Pas de réponse.'

    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to call AI API' },
      { status: 500 }
    )
  }
}
