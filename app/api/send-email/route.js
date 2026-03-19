import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, type, num, clientNom, entreprise, totalTTC, lignes, description, conditions, tvaRate, totalHT, tva, artisan, devisId, relance, uid } = body;
    if (!to || !type || !num) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) return NextResponse.json({ error: "Service email non configure" }, { status: 500 });
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://batiflow-kappa.vercel.app';

    const viewLink = SITE_URL + '/api/accept-devis?num=' + encodeURIComponent(num) + '&uid=' + (uid || '');
    const acceptLink = viewLink + '&action=accept';
    const pdfLink = viewLink + '&print=1';

    const rows = (lignes || []).map(l => '<tr><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">'+l.poste+'</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee;font-size:12px">'+l.quantite+' '+l.unite+'</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee;font-size:12px">'+Number(l.prixUnitaireHT).toFixed(2)+' EUR</td><td style="padding:8px;text-align:right;font-weight:600;border-bottom:1px solid #eee;font-size:12px">'+l.totalHT+' EUR</td></tr>').join('');

    const html = '<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto">'
      + '<div style="background:#145A3E;padding:24px;border-radius:12px 12px 0 0"><h1 style="color:white;margin:0;font-size:18px">' + entreprise + '</h1><p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">' + type + ' N. ' + num + '</p></div>'
      + '<div style="padding:24px;border:1px solid #eee;border-top:none;background:white">'
      + '<p style="font-size:14px">Bonjour ' + clientNom + ',</p>'
      + '<p style="font-size:14px">Veuillez trouver ci-dessous votre ' + type.toLowerCase() + ' <strong>n' + num + '</strong> d\'un montant de <strong>' + totalTTC + '</strong>.</p>'
      + '<table style="width:100%;border-collapse:collapse;margin:16px 0"><thead><tr style="background:#F2FDF7"><th style="padding:8px;text-align:left;font-size:11px;color:#145A3E">Poste</th><th style="padding:8px;text-align:right;font-size:11px;color:#145A3E">Qte</th><th style="padding:8px;text-align:right;font-size:11px;color:#145A3E">PU HT</th><th style="padding:8px;text-align:right;font-size:11px;color:#145A3E">Total</th></tr></thead><tbody>' + rows + '</tbody></table>'
      + '<div style="text-align:right;padding:12px;background:#F2FDF7;border-radius:8px"><div style="font-size:14px">HT: <strong>' + totalHT + '</strong></div><div style="font-size:14px">TVA: <strong>' + tva + '</strong></div><div style="font-size:20px;color:#145A3E;font-weight:800;margin-top:4px">TTC: ' + totalTTC + '</div></div>'
      + '<div style="text-align:center;margin:24px 0">'
      + (type === 'DEVIS' ? '<a href="' + acceptLink + '" style="display:inline-block;background:#145A3E;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;margin-right:8px">Accepter ce devis</a>' : '')
      + '<a href="' + pdfLink + '" style="display:inline-block;background:#333;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Telecharger PDF</a>'
      + '</div>'
      + '<p style="font-size:11px;color:#999">N\'hesitez pas a nous contacter pour toute question.</p>'
      + '<p style="font-size:10px;color:#bbb;margin-top:16px">' + entreprise + ' via Crafto</p>'
      + '</div></div>';

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + RESEND_KEY },
      body: JSON.stringify({
        from: entreprise + " <onboarding@resend.dev>",
        to: [to],
        subject: type + " " + num + " - " + entreprise,
        html: html
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
