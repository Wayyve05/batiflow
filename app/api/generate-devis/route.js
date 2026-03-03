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

    const prompt = [
      'Tu es un assistant devis pour un artisan ' + (metier || 'du batiment') + ' francais.',
      '',
      'CHANTIER: "' + description + '"',
      'CLIENT: ' + clientNom,
      urgence === 'urgent' ? 'URGENT - majorer de 20%' : '',
      '',
      'REGLES STRICTES:',
      '- Genere UNIQUEMENT les postes que artisan a decrits. Ninvente RIEN.',
      '- Si artisan ecrit "pose carrelage 15m2", mets SEULEMENT pose carrelage. Najoute PAS depose, ragerage, joints, nettoyage, deplacement sauf si EXPLICITEMENT mentionne.',
      '- En cas de doute, NE PAS ajouter le poste.',
      '- Prix realistes France 2025.',
      '- 2 a 6 lignes maximum.',
      '',
      'JSON uniquement, sans markdown:',
      '{"lignes":[{"poste":"Description","unite":"m2/u/forfait/h","quantite":1,"prixUnitaireHT":100}],"conditions":"Paiement a 30 jours"}'
    ].join('\n')

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
        messages: [{ role: 'user', content: prompt }],
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
