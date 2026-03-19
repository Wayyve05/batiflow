import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const num = searchParams.get('num')
  const uid = searchParams.get('uid')
  const action = searchParams.get('action')
  const print = searchParams.get('print')

  if (!num || !uid) {
    return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;padding:40px;text-align:center"><h1>Lien invalide</h1></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  const { data: devis } = await supabase.from('devis').select('*').eq('numero', num).eq('user_id', uid).single()

  if (!devis) {
    return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;padding:40px;text-align:center"><h1>Document introuvable</h1><p>Ce lien n est plus valide ou le document a ete supprime.</p></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  if (action === 'accept' && devis.status !== 'Accepte') {
    await supabase.from('devis').update({ status: 'Accepte' }).eq('id', devis.id)
    devis.status = 'Accepte'
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single()
  const ent = profile?.entreprise || ''
  const accepted = devis.status === 'Accepte'

  const lignes = (devis.lignes || []).map(l =>
    '<tr><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">' + l.poste + '</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:center">' + l.unite + '</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">' + l.quantite + '</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">' + Number(l.prixUnitaireHT).toFixed(2) + ' EUR</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:600">' + l.totalHT + ' EUR</td></tr>'
  ).join('')

  const printStyle = print ? '<style>@media print{.no-print{display:none!important}body{padding:20px!important}}</style><script>window.onload=function(){window.print()}</script>' : ''

  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Devis ' + devis.numero + ' - ' + ent + '</title>' + printStyle + '</head><body style="font-family:-apple-system,Helvetica,sans-serif;margin:0;padding:0;background:#f5f5f5"><div style="max-width:700px;margin:0 auto;padding:20px">'
    + '<div class="no-print" style="display:flex;gap:8px;margin-bottom:16px;justify-content:center">'
    + (accepted ? '' : '<a href="?num=' + num + '&uid=' + uid + '&action=accept" style="display:inline-block;background:#145A3E;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Accepter ce devis</a>')
    + '<a href="?num=' + num + '&uid=' + uid + '&print=1" style="display:inline-block;background:#333;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Telecharger PDF</a>'
    + '</div>'
    + (accepted ? '<div class="no-print" style="text-align:center;margin-bottom:16px;padding:12px;background:#E8F5E9;border-radius:8px"><p style="color:#2E7D32;font-weight:700;font-size:16px;margin:0">Devis accepte ✓</p></div>' : '')
    + '<div style="background:white;border-radius:12px;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,0.05)">'
    + '<div style="display:flex;justify-content:space-between;margin-bottom:24px;padding-bottom:20px;border-bottom:2px solid #E0F9EC;flex-wrap:wrap;gap:12px">'
    + '<div><strong style="font-size:15px;color:#145A3E">' + ent + '</strong><br/><span style="font-size:11px;color:#737373">' + (profile?.adresse || '') + ' ' + (profile?.code_postal || '') + ' ' + (profile?.ville || '') + '<br/>' + (profile?.telephone || '') + ' - ' + (profile?.email || '') + (profile?.siret ? '<br/>SIRET: ' + profile.siret : '') + '</span></div>'
    + '<div style="text-align:right"><h1 style="font-size:22px;color:#145A3E;margin:0">DEVIS</h1><span style="font-size:12px;color:#737373">N. ' + devis.numero + '<br/>' + (devis.created_at ? new Date(devis.created_at).toLocaleDateString("fr-FR") : '') + '</span></div></div>'
    + '<div style="background:#f5f5f5;border-radius:8px;padding:14px;margin-bottom:16px"><div style="font-size:10px;font-weight:600;color:#737373;text-transform:uppercase;margin-bottom:4px">Client</div><strong>' + devis.client_nom + '</strong>' + (devis.client_adresse ? '<br/>' + devis.client_adresse : '') + '</div>'
    + (devis.description ? '<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:600;color:#737373;text-transform:uppercase;margin-bottom:4px">Objet</div><div style="font-size:13px">' + devis.description + '</div></div>' : '')
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:16px"><thead><tr style="background:#F2FDF7"><th style="padding:8px;text-align:left;font-size:11px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Designation</th><th style="padding:8px;text-align:center;font-size:11px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Unite</th><th style="padding:8px;text-align:right;font-size:11px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Qte</th><th style="padding:8px;text-align:right;font-size:11px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">P.U. HT</th><th style="padding:8px;text-align:right;font-size:11px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Total HT</th></tr></thead><tbody>' + lignes + '</tbody></table>'
    + '<div style="display:flex;justify-content:flex-end"><div style="width:220px"><div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px"><span>Total HT</span><span>' + devis.total_ht + ' EUR</span></div><div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px"><span>TVA (' + (devis.tva_rate || 10) + '%)</span><span>' + devis.tva + ' EUR</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #B4F0CD;margin-top:4px;font-weight:800;font-size:18px;color:#145A3E"><span>TTC</span><span>' + devis.total_ttc + ' EUR</span></div></div></div>'
    + '<div style="margin-top:24px;padding:14px;background:#F2FDF7;border-radius:8px;font-size:11px;color:#404040"><strong>Conditions:</strong> ' + (devis.conditions || 'Paiement a 30 jours') + '</div>'
    + (profile?.assurance ? '<div style="margin-top:8px;font-size:10px;color:#999">Assurance decennale: ' + profile.assurance + '</div>' : '')
    + '<div style="margin-top:8px;font-size:10px;color:#999">TVA non applicable, art. 293 B du CGI - Devis gratuit - Valable 3 mois</div>'
    + '<div style="margin-top:20px;border-top:1px dashed #ccc;padding-top:12px;font-size:10px;color:#999">Bon pour accord:<br/><br/>Signature: _______________</div>'
    + '</div>'
    + '<p style="font-size:10px;color:#bbb;margin-top:16px;text-align:center">' + ent + ' - Document genere par Crafto</p>'
    + '</div></body></html>'

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
