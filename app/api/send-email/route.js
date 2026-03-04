import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const body = await req.json();
    const { to, type, num, clientNom, entreprise, totalTTC, lignes, description, conditions, tvaRate, totalHT, tva, artisan, devisId } = body;
    if (!to || !type || !num) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) return NextResponse.json({ error: "Service email non configure" }, { status: 500 });
    const rows = (lignes || []).map(l => "<tr><td style=\"padding:8px;border-bottom:1px solid #eee\">"+l.poste+"</td><td style=\"padding:8px;text-align:right;border-bottom:1px solid #eee\">"+l.quantite+" "+l.unite+"</td><td style=\"padding:8px;text-align:right;border-bottom:1px solid #eee\">"+Number(l.prixUnitaireHT).toFixed(2)+" EUR</td><td style=\"padding:8px;text-align:right;font-weight:600;border-bottom:1px solid #eee\">"+l.totalHT+" EUR</td></tr>").join("");
const acceptBtn = type === "DEVIS" && devisId ? '<div style=\"text-align:center;margin:20px 0\"><a href=\"'+process.env.NEXT_PUBLIC_SITE_URL+'/api/accept-devis?id='+devisId+'\" style=\"display:inline-block;background:#145A3E;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700\">Accepter ce devis</a></div>' : '';
    const html = "<div style=\"font-family:sans-serif;max-width:600px;margin:0 auto\"><div style=\"background:#145A3E;padding:24px;border-radius:12px 12px 0 0\"><h1 style=\"color:white;margin:0;font-size:18px\">"+entreprise+"</h1></div><div style=\"padding:24px;border:1px solid #eee;border-top:none\"><p>Bonjour "+clientNom+",</p><p>Voici votre "+type.toLowerCase()+" :</p><table style=\"width:100%;border-collapse:collapse;margin:16px 0\"><thead><tr style=\"background:#F2FDF7\"><th style=\"padding:8px;text-align:left;font-size:12px;color:#145A3E\">Poste</th><th style=\"padding:8px;text-align:right;font-size:12px;color:#145A3E\">Qte</th><th style=\"padding:8px;text-align:right;font-size:12px;color:#145A3E\">PU</th><th style=\"padding:8px;text-align:right;font-size:12px;color:#145A3E\">Total</th></tr></thead><tbody>"+rows+"</tbody></table><div style=\"text-align:right;padding:12px;background:#F2FDF7;border-radius:8px\"><div>TTC: <strong>"+totalTTC+"</strong></div></div>"+acceptBtn+"<p style=\"font-size:11px;color:#999;margin-top:24px\">"+entreprise+" via Batiflow</p></div></div>";
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer "+RESEND_KEY }, body: JSON.stringify({ from: entreprise+" <onboarding@resend.dev>", to: [to], subject: type+" "+num+" - "+entreprise, html }) });
    const data = await res.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
