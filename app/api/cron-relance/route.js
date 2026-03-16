import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function GET(req) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all devis with a relance date that has passed and status still Brouillon
    const { data: devisToRelance } = await supabase
      .from('devis')
      .select('*, profiles!inner(entreprise, email)')
      .eq('status', 'Brouillon')
      .not('relance_date', 'is', null)
      .lte('relance_date', new Date().toISOString())

    if (!devisToRelance || devisToRelance.length === 0) {
      return NextResponse.json({ message: 'Aucune relance a envoyer', count: 0 })
    }

    const RESEND_KEY = process.env.RESEND_API_KEY
    if (!RESEND_KEY) {
      return NextResponse.json({ error: 'Resend non configure' }, { status: 500 })
    }

    let sent = 0
    for (const devis of devisToRelance) {
      if (!devis.client_email) continue

      const entreprise = devis.profiles?.entreprise || 'Votre artisan'
      const html = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#145A3E;padding:24px;border-radius:12px 12px 0 0"><h1 style="color:white;margin:0;font-size:18px">Rappel - ' + entreprise + '</h1></div><div style="padding:24px;border:1px solid #eee;border-top:none"><p>Bonjour ' + devis.client_nom + ',</p><p>Nous nous permettons de vous relancer concernant le devis <strong>' + devis.numero + '</strong> d un montant de <strong>' + devis.total_ttc + ' EUR</strong>.</p><p>Ce devis est toujours valable. N hesitez pas a nous contacter pour toute question.</p><div style="text-align:center;margin:20px 0"><a href="' + (process.env.NEXT_PUBLIC_SITE_URL || '') + '/api/accept-devis?id=' + devis.id + '" style="display:inline-block;background:#145A3E;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700">Accepter ce devis</a></div><p style="font-size:11px;color:#999">' + entreprise + ' via QUOTY</p></div></div>'

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + RESEND_KEY },
        body: JSON.stringify({
          from: entreprise + ' <onboarding@resend.dev>',
          to: [devis.client_email],
          subject: 'Rappel: Devis ' + devis.numero + ' - ' + entreprise,
          html
        })
      })

      if (res.ok) {
        // Clear relance_date so we don't send again
        await supabase.from('devis').update({ relance_date: null }).eq('id', devis.id)
        sent++
      }
    }

    return NextResponse.json({ message: 'Relances envoyees', count: sent })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
