import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')

  if (!id) {
    return new Response('<html><body><h1>Lien invalide</h1></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  if (action === 'accept') {
    await supabase.from('devis').update({ status: 'Accepte' }).eq('id', id)
  }

  const { data: devis } = await supabase.from('devis').select('*').eq('id', id).single()

  if (!devis) {
    return new Response('<html><body style="font-family:sans-serif;padding:40px;text-align:center"><h1>Devis introuvable</h1></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  const accepted = devis.status === 'Accepte'
  const lignes = (devis.lignes || []).map(l =>
    '<tr><td style="padding:8px;border-bottom:1px solid #eee">' + l.poste + '</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">' + l.quantite + ' ' + l.unite + '</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">' + Number(l.prixUnitaireHT).toFixed(2) + ' EUR</td><td style="padding:8px;text-align:right;font-weight:600;border-bottom:1px solid #eee">' + l.totalHT + ' EUR</td></tr>'
  ).join('')

  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Devis ' + devis.numero + '</title></head><body style="font-family:-apple-system,sans-serif;margin:0;padding:0;background:#f5f5f5"><div style="max-width:600px;margin:0 auto;padding:20px"><div style="background:#145A3E;padding:24px;border-radius:12px 12px 0 0;text-align:center"><h1 style="color:white;margin:0;font-size:20px">DEVIS ' + devis.numero + '</h1></div><div style="background:white;padding:24px;border:1px solid #eee;border-top:none"><p><strong>Client:</strong> ' + devis.client_nom + '</p><p><strong>Description:</strong> ' + (devis.description || '') + '</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><thead><tr style="background:#F2FDF7"><th style="padding:8px;text-align:left;font-size:12px;color:#145A3E">Poste</th><th style="padding:8px;text-align:right;font-size:12px;color:#145A3E">Qte</th><th style="padding:8px;text-align:right;font-size:12px;color:#145A3E">PU HT</th><th style="padding:8px;text-align:right;font-size:12px;color:#145A3E">Total</th></tr></thead><tbody>' + lignes + '</tbody></table><div style="text-align:right;padding:16px;background:#F2FDF7;border-radius:8px"><div style="font-size:14px">Total HT: <strong>' + devis.total_ht + ' EUR</strong></div><div style="font-size:14px">TVA (' + (devis.tva_rate || 10) + '%): <strong>' + devis.tva + ' EUR</strong></div><div style="font-size:22px;color:#145A3E;font-weight:800;margin-top:8px">TTC: ' + devis.total_ttc + ' EUR</div></div>' + (accepted ? '<div style="text-align:center;margin-top:24px;padding:16px;background:#E8F5E9;border-radius:8px"><p style="color:#2E7D32;font-weight:700;font-size:18px;margin:0">Devis accepte</p></div>' : '<div style="text-align:center;margin-top:24px"><a href="?id=' + id + '&action=accept" style="display:inline-block;background:#145A3E;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Accepter ce devis</a><p style="color:#999;font-size:12px;margin-top:8px">En cliquant, vous acceptez les conditions du devis.</p></div>') + '<p style="font-size:11px;color:#999;margin-top:24px;text-align:center">Document genere par QUOTY</p></div></div></body></html>'

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
