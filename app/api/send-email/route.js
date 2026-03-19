import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

function buildPdfHtml(type, num, clientNom, clientAdresse, entreprise, artisan, lignes, totalHT, tva, tvaRate, totalTTC, conditions, description) {
  const rows = (lignes || []).map(l =>
    '<tr><td style="padding:8px;border-bottom:1px solid #eee;font-size:11px">'+l.poste+'</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:11px;text-align:center">'+l.unite+'</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:11px;text-align:right">'+l.quantite+'</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:11px;text-align:right">'+Number(l.prixUnitaireHT).toFixed(2)+' EUR</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:11px;text-align:right;font-weight:600">'+l.totalHT+' EUR</td></tr>'
  ).join('');

  return '<html><head><meta charset="utf-8"/><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;padding:40px;color:#1a1a1a;font-size:12px;line-height:1.5}</style></head><body>'
    +'<div style="display:flex;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #E0F9EC">'
    +'<div><strong style="font-size:15px;color:#145A3E">'+(entreprise||'')+'</strong><br/><span style="font-size:10px;color:#737373">'+(artisan?.adresse||'')+' '+(artisan?.cp||'')+' '+(artisan?.ville||'')+'<br/>'+(artisan?.telephone||'')+' - '+(artisan?.email||'')+(artisan?.siret?'<br/>SIRET: '+artisan.siret:'')+'</span></div>'
    +'<div style="text-align:right"><h1 style="font-size:22px;color:#145A3E;margin:0">'+type+'</h1><span style="font-size:11px;color:#737373">N. '+num+'<br/>'+new Date().toLocaleDateString("fr-FR")+'</span></div></div>'
    +'<div style="background:#f5f5f5;border-radius:8px;padding:12px;margin-bottom:16px"><div style="font-size:9px;font-weight:600;color:#737373;text-transform:uppercase;margin-bottom:4px">Client</div><strong>'+clientNom+'</strong>'+(clientAdresse?'<br/>'+clientAdresse:'')+'</div>'
    +(description?'<div style="margin-bottom:14px"><div style="font-size:9px;font-weight:600;color:#737373;text-transform:uppercase;margin-bottom:4px">Objet</div>'+description+'</div>':'')
    +'<table style="width:100%;border-collapse:collapse;margin-bottom:16px"><thead><tr style="background:#F2FDF7"><th style="padding:8px;text-align:left;font-size:10px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Designation</th><th style="padding:8px;text-align:center;font-size:10px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Unite</th><th style="padding:8px;text-align:right;font-size:10px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Qte</th><th style="padding:8px;text-align:right;font-size:10px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">P.U. HT</th><th style="padding:8px;text-align:right;font-size:10px;font-weight:600;color:#145A3E;border-bottom:2px solid #B4F0CD">Total HT</th></tr></thead><tbody>'+rows+'</tbody></table>'
    +'<div style="display:flex;justify-content:flex-end"><div style="width:220px"><div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>Total HT</span><span>'+totalHT+'</span></div><div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>TVA ('+(tvaRate||'10')+'%)</span><span>'+tva+'</span></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #B4F0CD;margin-top:4px;font-weight:800;font-size:16px;color:#145A3E"><span>Total TTC</span><span>'+totalTTC+'</span></div></div></div>'
    +'<div style="margin-top:24px;padding:14px;background:#F2FDF7;border-radius:8px;font-size:10px;color:#404040"><strong>Conditions:</strong> '+(conditions||'Paiement a 30 jours')+'</div>'
    +(artisan?.assurance?'<div style="margin-top:8px;font-size:9px;color:#999">Assurance decennale: '+artisan.assurance+(artisan.assureur?' - '+artisan.assureur:'')+(artisan.couverture?' - Couverture: '+artisan.couverture:'')+'</div>':'')
    +'<div style="margin-top:8px;font-size:9px;color:#999">'+(artisan?.siret?'SIRET: '+artisan.siret+' - ':'')+'TVA non applicable, art. 293 B du CGI</div>'
    +(type==='DEVIS'?'<div style="margin-top:16px;border-top:1px dashed #ccc;padding-top:10px;font-size:9px;color:#999">Devis gratuit - Valable 3 mois<br/>Bon pour accord:<br/><br/>Signature: _______________</div>':'')
    +'<div style="margin-top:24px;text-align:center;font-size:9px;color:#bbb">'+entreprise+' - Document genere par Crafto</div>'
    +'</body></html>';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, type, num, clientNom, clientAdresse, entreprise, totalTTC, lignes, description, conditions, tvaRate, totalHT, tva, artisan, devisId, relance } = body;
    if (!to || !type || !num) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) return NextResponse.json({ error: "Service email non configure" }, { status: 500 });

    const pdfHtml = buildPdfHtml(type, num, clientNom, clientAdresse, entreprise, artisan, lignes, totalHT, tva, tvaRate, totalTTC, conditions, description);
    const pdfBase64 = Buffer.from(pdfHtml).toString('base64');
    const fileName = type.toLowerCase() + '-' + num.replace(/\s/g,'') + '.html';

    const acceptBtn = type === "DEVIS" && devisId ? '<div style="text-align:center;margin:20px 0"><a href="'+(process.env.NEXT_PUBLIC_SITE_URL||'')+'/api/accept-devis?id='+devisId+'" style="display:inline-block;background:#145A3E;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700">Accepter ce devis</a></div>' : '';

    const emailHtml = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">'
      +'<div style="background:#145A3E;padding:24px;border-radius:12px 12px 0 0"><h1 style="color:white;margin:0;font-size:18px">'+entreprise+'</h1></div>'
      +'<div style="padding:24px;border:1px solid #eee;border-top:none">'
      +'<p>Bonjour '+clientNom+',</p>'
      +'<p>Veuillez trouver ci-joint votre '+type.toLowerCase()+' <strong>n'+num+'</strong> d\'un montant de <strong>'+totalTTC+'</strong>.</p>'
      +'<p>N\'hesitez pas a nous contacter pour toute question.</p>'
      +acceptBtn
      +'<p style="font-size:12px;color:#999;margin-top:8px">Le document est en piece jointe de cet email.</p>'
      +'<p style="font-size:11px;color:#999;margin-top:24px">'+entreprise+' via Crafto</p>'
      +'</div></div>';

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer "+RESEND_KEY },
      body: JSON.stringify({
        from: entreprise+" <onboarding@resend.dev>",
        to: [to],
        subject: type+" "+num+" - "+entreprise,
        html: emailHtml,
        attachments: [{
          filename: fileName,
          content: pdfBase64
        }]
      })
    });
    const data = await res.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });
    if (type === "DEVIS" && devisId && relance && relance !== "none") {
      const days = parseInt(relance);
      const relanceDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('devis').update({ relance_date: relanceDate, client_email: to }).eq('id', devisId);
    }
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
