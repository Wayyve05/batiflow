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
      'REGLES:',
      '- Reste fidele a ce que artisan decrit. Si la description est courte, fais un devis court (1-3 lignes).',
      '- Ne rajoute PAS de postes non mentionnes (pas de depose, nettoyage, deplacement sauf si mentionne).',
      '- Prix realistes France 2025.',
      '- 1 a 6 lignes maximum.',
      '',
      'IMPORTANT: Reponds UNIQUEMENT avec le JSON, aucun texte avant ou apres:',
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.map((c) => c.text || '').join('') || ''
    
    // Robust JSON parsing - extract JSON even if there is text around it
    let parsed
    const clean = text.replace(/```json|```/g, '').trim()
    try {
      parsed = JSON.parse(clean)
    } catch (e) {
      // Try to find JSON object in the text
      const match = clean.match(/\{[\s\S]*"lignes"[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        throw new Error('Format de reponse invalide')
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Erreur generation devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la generation du devis' },
      { status: 500 }
    )
  }
}
