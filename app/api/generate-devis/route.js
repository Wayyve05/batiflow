import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { description, clientNom, metier, urgence } = await request.json()

    if (!description || !clientNom) {
      return NextResponse.json(
        { error: 'Description et nom du client requis' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Tu es un assistant pour artisans ${metier || 'du batiment'} francais.
Genere un devis detaille en JSON pour: "${description}"
Client: ${clientNom}${urgence === 'urgent' ? ' (URGENT)' : ''}

Reponds UNIQUEMENT en JSON valide sans markdown:
{"lignes":[{"poste":"Description","unite":"m2/u/forfait/h","quantite":1,"prixUnitaireHT":100}],"conditions":"Conditions de paiement"}

Regles: prix realistes France 2025, fournitures ET main d'oeuvre separes, deplacement si pertinent, 4-10 lignes.`,
          },
        ],
      }),
    })

    const data = await response.json()
    const text = data.content?.map((c) => c.text || '').join('') || ''
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Erreur generation devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la generation du devis' },
      { status: 500 }
    )
  }
}
