import { useState, useRef, createContext, useContext, useEffect } from "react";

const C={g900:"#0B3D2E",g800:"#145A3E",g700:"#1A7A52",g600:"#22995E",g500:"#2DB872",g400:"#4FD68B",g300:"#7FE6AA",g200:"#B4F0CD",g100:"#E0F9EC",g50:"#F2FDF7",o500:"#E8873A",o100:"#FFF3E6",w50:"#FFFCF8",r500:"#E53E3E",r100:"#FEE2E2",b500:"#3B82F6",b100:"#DBEAFE",x900:"#1A1A1A",x700:"#404040",x500:"#737373",x300:"#C4C4C4",x100:"#F5F5F5",wh:"#FFFFFF"};

// Mobile hook
function useMobile(bp=768){const[m,setM]=useState(false);useEffect(()=>{const check=()=>setM(window.innerWidth<bp);check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check)},[bp]);return m}

// Toast
const TC=createContext();
function TP({children}){const[ts,setTs]=useState([]);
const add=(msg,type="success")=>{const id=Date.now();setTs(p=>[...p,{id,msg,type}]);setTimeout(()=>setTs(p=>p.filter(t=>t.id!==id)),3000)};
return <TC.Provider value={add}>{children}
<div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
{ts.map(t=><div key={t.id} style={{background:t.type==="success"?C.g700:t.type==="error"?C.r500:C.b500,color:C.wh,padding:"12px 20px",borderRadius:12,fontSize:"0.88rem",fontWeight:500,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:8,maxWidth:320}}>
<span>{t.type==="success"?"✓":t.type==="error"?"✕":"ℹ"}</span>{t.msg}</div>)}
</div></TC.Provider>}
const useT=()=>useContext(TC);

// Shared
const Logo=({s=32})=><svg viewBox="0 0 36 36" fill="none" style={{width:s,height:s,flexShrink:0}}><rect width="36" height="36" rx="10" fill={C.g700}/><path d="M10 24V14a2 2 0 012-2h12a2 2 0 012 2v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/><path d="M8 24h20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/><path d="M15 18h6M18 15v6" stroke={C.g400} strokeWidth="2" strokeLinecap="round"/></svg>;
const Chk=()=><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 6-6" stroke={C.g600} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const inp={padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.x300}`,fontSize:"0.9rem",fontFamily:"inherit",outline:"none",background:C.wh,width:"100%",boxSizing:"border-box"};
const lbl={fontSize:"0.82rem",fontWeight:600,color:C.x700,marginBottom:4,display:"block"};
const crd={background:C.wh,borderRadius:16,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",border:`1px solid ${C.g100}`};
const bp={display:"inline-flex",alignItems:"center",gap:8,padding:"11px 24px",borderRadius:50,fontWeight:600,fontSize:"0.9rem",border:"none",cursor:"pointer",background:C.g700,color:C.wh,fontFamily:"inherit"};
const bs={...bp,background:C.wh,color:C.g800,border:`2px solid ${C.g200}`};
const bsm={padding:"8px 18px",fontSize:"0.82rem"};

const SBadge=({s})=>{const m={Brouillon:[C.x100,C.x700],Envoyé:[C.b100,C.b500],Accepté:[C.g100,C.g700],Émise:[C.b100,C.b500],Payée:[C.g100,C.g600]};const[bg,fg]=m[s]||[C.x100,C.x700];return <span style={{fontSize:"0.72rem",fontWeight:600,padding:"3px 10px",borderRadius:50,background:bg,color:fg,whiteSpace:"nowrap"}}>{s}</span>};
const SearchBar=({value,onChange,placeholder})=><input style={{...inp,maxWidth:300,paddingLeft:14}} placeholder={placeholder||"Rechercher..."} value={value} onChange={e=>onChange(e.target.value)}/>;

// ===================== LANDING =====================
function Landing({onStart,onLogin,onLegal}){
  const mob=useMobile();const[faq,setFaq]=useState(null);const[menu,setMenu]=useState(false);
  const features=[{i:"📝",t:"Devis automatique",d:"L'IA génère un devis pro en 10 secondes."},{i:"🧾",t:"Factures en 1 clic",d:"Devis → facture conforme automatiquement."},{i:"🔔",t:"Relance intelligente",d:"Relance auto des devis non signés."},{i:"📊",t:"Calcul de marges",d:"Rentabilité en temps réel."},{i:"🏗️",t:"Suivi de chantier",d:"Suivez l'avancement.",soon:true},{i:"📑",t:"Contrats PDF",d:"Contrats pré-remplis.",soon:true}];
  const plans=[{n:"Starter",p:"14,99",f:["Devis illimités","PDF personnalisés","Envoi email","Support"]},{n:"Pro",p:"34,99",pop:true,f:["Tout Starter","Factures","Relances auto","Marges","Dashboard","Support prio"]},{n:"Entreprise",p:"49,99",f:["Tout Pro","Suivi chantier","Contrats","5 utilisateurs","Accompagnement"]}];
  const faqs=[{q:"Adapté à mon métier ?",a:"Oui ! Plombiers, électriciens, peintres, carreleurs…"},{q:"Pas doué en informatique ?",a:"Si vous savez envoyer un SMS, c'est bon. Support en 24h."},{q:"Devis conformes ?",a:"Mentions légales incluses : SIRET, assurance, TVA."},{q:"Annulation ?",a:"Sans engagement. Résiliation en un clic."},{q:"Comment ça marche ?",a:"Décrivez le chantier, l'IA génère les lignes + prix. Vous ajustez."},{q:"Données sécurisées ?",a:"Hébergées en France, chiffrées, RGPD."}];
  const scr=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth"})};

  return <div style={{background:C.w50}}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    {/* NAV */}
    <nav style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:mob?"12px 16px":"14px 32px",background:"rgba(255,252,248,0.92)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.g100}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:mob?"1.1rem":"1.3rem",color:C.g800}}><Logo s={mob?28:32}/> Batiflow</div>
      {mob?<button onClick={()=>setMenu(!menu)} style={{border:"none",background:"none",cursor:"pointer",fontSize:"1.5rem"}}>{menu?"✕":"☰"}</button>:
      <div style={{display:"flex",alignItems:"center",gap:24}}>
        {["outils","tarifs","faq"].map(s=><button key={s} onClick={()=>scr(s)} style={{fontSize:"0.9rem",fontWeight:500,color:C.x700,cursor:"pointer",border:"none",background:"none",fontFamily:"inherit"}}>{s==="outils"?"Outils":s==="tarifs"?"Tarifs":"FAQ"}</button>)}
        <button onClick={onLogin} style={{...bs,...bsm}}>Connexion</button>
        <button onClick={onStart} style={{...bp,...bsm}}>Essai gratuit →</button>
      </div>}
    </nav>
    {mob&&menu&&<div style={{position:"fixed",top:52,left:0,right:0,bottom:0,background:C.wh,zIndex:99,padding:24,display:"flex",flexDirection:"column",gap:16}}>
      {["outils","tarifs","faq"].map(s=><button key={s} onClick={()=>{scr(s);setMenu(false)}} style={{fontSize:"1.1rem",fontWeight:600,color:C.x700,border:"none",background:"none",fontFamily:"inherit",padding:"12px 0",textAlign:"left"}}>{s==="outils"?"Outils":s==="tarifs"?"Tarifs":"FAQ"}</button>)}
      <button onClick={()=>{onLogin();setMenu(false)}} style={{...bs,justifyContent:"center"}}>Connexion</button>
      <button onClick={()=>{onStart();setMenu(false)}} style={{...bp,justifyContent:"center"}}>Essai gratuit →</button>
    </div>}

    {/* HERO */}
    <section style={{maxWidth:1200,margin:"0 auto",padding:mob?"40px 20px":"80px 32px",display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?32:60,alignItems:"center"}}>
      <div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",background:C.g100,borderRadius:50,fontSize:"0.82rem",fontWeight:500,color:C.g800,marginBottom:20}}><span style={{width:8,height:8,borderRadius:"50%",background:C.g500,display:"inline-block"}}/>L'IA pour les artisans</div>
        <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"2.2rem":"3.2rem",lineHeight:1.1,color:C.g900,marginBottom:20}}>Fini la paperasse,<br/>place au <em style={{color:C.g600,fontStyle:"normal"}}>chantier</em></h1>
        <p style={{fontSize:"1.05rem",lineHeight:1.65,color:C.x700,marginBottom:28,maxWidth:480}}>Devis, factures, relances… Batiflow automatise votre admin en quelques clics.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button style={bp} onClick={onStart}>Essayer 14 jours gratuit →</button>
          <button style={bs} onClick={()=>scr("outils")}>Découvrir</button>
        </div>
      </div>
      {!mob&&<div style={{background:C.wh,borderRadius:20,boxShadow:"0 24px 60px rgba(11,61,46,0.12)",padding:24,border:`1px solid ${C.g100}`,position:"relative"}}>
        <div style={{position:"absolute",top:-12,right:-8,background:C.o500,color:C.wh,fontWeight:700,fontSize:"0.78rem",padding:"6px 14px",borderRadius:50}}>⚡ 10s</div>
        <div style={{display:"flex",justifyContent:"space-between",paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${C.x100}`}}><span style={{fontWeight:600,fontSize:"0.9rem"}}>Devis n°2024-0847</span><span style={{fontSize:"0.72rem",fontWeight:600,padding:"4px 12px",borderRadius:50,background:C.g100,color:C.g700}}>✓ Envoyé</span></div>
        {[["Client","M. Dupont — SDB"],["Fournitures","1 240 €"],["Main d'œuvre","2 800 €"]].map(([l,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.x100}`,fontSize:"0.88rem"}}><span style={{color:C.x500}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}
        <div style={{marginTop:14,padding:14,background:C.g50,borderRadius:12,display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,color:C.g800}}>Total TTC</span><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",fontWeight:700,color:C.g700}}>4 992 €</span></div>
      </div>}
    </section>

    {/* PAIN */}
    <section style={{background:C.g900,padding:mob?"48px 16px":"80px 32px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"1.8rem":"2.4rem",color:C.wh,marginBottom:32}}>Vous êtes artisan, pas comptable</h2>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:16}}>
        {[["5h","Perdues/semaine"],["40%","Devis jamais relancés"],["0","Vision sur vos marges"]].map(([s,t],i)=><div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:24}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"2rem",fontWeight:700,color:C.g400}}>{s}</div>
          <div style={{fontWeight:600,color:C.wh,marginTop:4}}>{t}</div>
        </div>)}
      </div>
    </div></section>

    {/* FEATURES */}
    <section id="outils" style={{background:C.wh,padding:mob?"48px 16px":"80px 32px"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"1.8rem":"2.4rem",color:C.g900,marginBottom:32}}>Tout ce qu'il vous faut</h2>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:16}}>
        {features.map((f,i)=><div key={i} style={{padding:24,borderRadius:16,border:`1px solid ${C.x100}`,background:C.w50}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.g100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",marginBottom:12}}>{f.i}</div>
          <div style={{fontWeight:700,color:C.g900,marginBottom:6}}>{f.t}</div>
          <div style={{fontSize:"0.85rem",lineHeight:1.6,color:C.x500}}>{f.d}</div>
          <span style={{display:"inline-block",marginTop:10,fontSize:"0.7rem",fontWeight:600,padding:"3px 10px",borderRadius:50,background:f.soon?C.o100:C.g100,color:f.soon?C.o500:C.g700}}>{f.soon?"Bientôt":"Disponible"}</span>
        </div>)}
      </div>
    </div></section>

    {/* PRICING */}
    <section id="tarifs" style={{background:C.w50,padding:mob?"48px 16px":"80px 32px",textAlign:"center"}}><div style={{maxWidth:1200,margin:"0 auto"}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"1.8rem":"2.4rem",color:C.g900,marginBottom:32}}>Un prix honnête</h2>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:16,alignItems:"start"}}>
        {plans.map((p,i)=><div key={i} style={{borderRadius:20,padding:28,border:`2px solid ${p.pop?C.g500:C.x100}`,background:p.pop?C.g900:C.wh,color:p.pop?C.wh:C.x900,position:"relative"}}>
          {p.pop&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:C.g500,color:C.wh,fontSize:"0.7rem",fontWeight:700,padding:"4px 14px",borderRadius:50}}>⭐ Le plus choisi</div>}
          <div style={{fontWeight:600,color:p.pop?C.g300:C.x900,marginBottom:4}}>{p.n}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:3,justifyContent:"center",marginBottom:16}}><span style={{fontSize:"2.2rem",fontWeight:800,fontFamily:"'Playfair Display',Georgia,serif",color:p.pop?C.wh:C.g800}}>{p.p}</span><span style={{fontSize:"0.85rem",color:p.pop?"rgba(255,255,255,0.5)":C.x500}}>€/mois</span></div>
          <div style={{textAlign:"left"}}>{p.f.map((f,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.84rem",color:p.pop?"rgba(255,255,255,0.8)":C.x700,padding:"4px 0"}}><Chk/>{f}</div>)}</div>
          <button onClick={onStart} style={{...bp,width:"100%",justifyContent:"center",marginTop:16,...(p.pop?{background:C.g400,color:C.g900}:{})}}>{p.pop?"Essai 14j gratuit →":"Commencer"}</button>
        </div>)}
      </div>
    </div></section>

    {/* FAQ */}
    <section id="faq" style={{background:C.wh,padding:mob?"48px 16px":"80px 32px"}}><div style={{maxWidth:700,margin:"0 auto"}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"1.8rem":"2.4rem",color:C.g900,marginBottom:32,textAlign:"center"}}>Questions fréquentes</h2>
      {faqs.map((f,i)=><div key={i} style={{border:`1px solid ${C.x100}`,borderRadius:12,marginBottom:8}}>
        <button onClick={()=>setFaq(faq===i?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"14px 18px",border:"none",background:"none",cursor:"pointer",fontWeight:600,fontSize:"0.9rem",color:C.g900,fontFamily:"inherit",textAlign:"left",gap:12}}>
          <span>{f.q}</span><span style={{transform:faq===i?"rotate(180deg)":"none",transition:"transform 0.3s",color:C.g500,flexShrink:0}}>▼</span>
        </button>
        {faq===i&&<div style={{padding:"0 18px 14px",fontSize:"0.88rem",color:C.x500,lineHeight:1.6}}>{f.a}</div>}
      </div>)}
    </div></section>

    {/* CTA */}
    <section style={{background:`linear-gradient(135deg,${C.g900},${C.g800})`,textAlign:"center",padding:mob?"48px 16px":"80px 32px"}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:mob?"1.8rem":"2.4rem",color:C.wh,marginBottom:12}}>Prêt à gagner 5h/semaine ?</h2>
      <p style={{color:"rgba(255,255,255,0.5)",maxWidth:460,margin:"0 auto 24px"}}>Rejoignez les artisans qui automatisent leur admin.</p>
      <button style={{...bp,background:C.g400,color:C.g900,padding:"14px 32px"}} onClick={onStart}>Démarrer l'essai gratuit →</button>
      <p style={{marginTop:12,fontSize:"0.78rem",color:"rgba(255,255,255,0.35)"}}>14 jours gratuits · Sans CB · Annulation libre</p>
    </section>

    {/* FOOTER */}
    <footer style={{background:C.g900,padding:mob?"32px 16px":"48px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:mob?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:mob?24:48}}>
        <div><div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,color:C.wh,marginBottom:10}}><Logo s={28}/> Batiflow</div><p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>L'assistant admin des artisans.</p></div>
        {[{t:"Produit",l:["Outils","Tarifs","FAQ"]},{t:"Légal",l:["Mentions légales","CGU","Confidentialité"]}].map((c,i)=><div key={i}><div style={{fontWeight:600,fontSize:"0.82rem",color:C.wh,marginBottom:8}}>{c.t}</div>{c.l.map((l,j)=><button key={j} onClick={()=>{if(["Mentions légales","CGU","Confidentialité"].includes(l))onLegal(l)}} style={{display:"block",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",padding:"3px 0",cursor:"pointer",border:"none",background:"none",fontFamily:"inherit",textAlign:"left"}}>{l}</button>)}</div>)}
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16,marginTop:24,fontSize:"0.72rem",color:"rgba(255,255,255,0.3)",textAlign:"center"}}>© 2025 Batiflow · Fait avec ❤️ pour les artisans</div>
    </footer>
  </div>;
}

// ===================== LEGAL =====================
function Legal({title,onBack}){
  const content={"Mentions légales":[["Éditeur","Batiflow SAS — [Votre adresse] — SIRET: [Votre SIRET] — contact@batiflow.fr"],["Hébergement","Vercel Inc."],["Propriété intellectuelle","Tout le contenu est protégé par le droit d'auteur."],["RGPD","Droit d'accès, rectification, suppression: dpo@batiflow.fr"]],"CGU":[["Objet","Utilisation de Batiflow, service SaaS pour artisans."],["Inscription","Informations exactes requises."],["Abonnement","Mensuel, renouvelable. Paiement via Stripe."],["Essai","14 jours gratuits sans CB."],["Résiliation","En un clic, fin de période."],["Responsabilité","Outil d'aide, vérification par l'utilisateur."],["Données","Hébergées en France, RGPD."]],"Confidentialité":[["Données collectées","Nom, email, téléphone, SIRET, adresse."],["Usage","Fonctionnement du service uniquement."],["Sécurité","Chiffrement, hébergement France."],["Vos droits","Accès, rectification, suppression: dpo@batiflow.fr"]]};
  return <div style={{minHeight:"100vh",background:C.w50}}>
    <nav style={{display:"flex",alignItems:"center",gap:12,padding:"14px 24px",borderBottom:`1px solid ${C.g100}`,background:C.wh}}>
      <button onClick={onBack} style={{...bs,...bsm}}>← Retour</button>
      <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,color:C.g800}}><Logo s={28}/> Batiflow</div>
    </nav>
    <div style={{maxWidth:700,margin:"0 auto",padding:"40px 20px"}}>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.8rem",color:C.g900,marginBottom:24}}>{title}</h1>
      {(content[title]||[]).map(([t,b],i)=><div key={i} style={{marginBottom:24}}><h3 style={{fontWeight:700,color:C.g800,marginBottom:6}}>{t}</h3><p style={{fontSize:"0.92rem",lineHeight:1.7,color:C.x700}}>{b}</p></div>)}
    </div>
  </div>;
}

// ===================== AUTH =====================
function Auth({onAuth,onBack,mode:initMode="signup"}){
  const mob=useMobile();const[mode,setMode]=useState(initMode);
  const[f,sF]=useState({email:"",password:"",confirm:""});const[err,setErr]=useState("");
  const u=(k,v)=>sF(p=>({...p,[k]:v}));
  const go=()=>{setErr("");if(!f.email||!f.password)return setErr("Remplissez tous les champs");if(mode==="signup"&&f.password!==f.confirm)return setErr("Mots de passe différents");if(f.password.length<6)return setErr("6 caractères minimum");onAuth({email:f.email})};
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:mob?"column":"row",background:`linear-gradient(135deg,${C.g900},${C.g800})`}}>
    {!mob&&<div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px 52px",color:C.wh,maxWidth:460}}>
      <button onClick={onBack} style={{color:"rgba(255,255,255,0.5)",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.82rem",marginBottom:28,padding:0,textAlign:"left"}}>← Retour</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}><Logo s={36}/><span style={{fontSize:"1.4rem",fontWeight:800}}>Batiflow</span></div>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"2.2rem",lineHeight:1.15}}>Votre admin en <span style={{color:C.g400}}>pilote auto</span></h1>
    </div>}
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{...crd,maxWidth:380,width:"100%",padding:28}}>
        {mob&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><Logo s={28}/><span style={{fontWeight:800,color:C.g800}}>Batiflow</span><button onClick={onBack} style={{marginLeft:"auto",color:C.x500,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.82rem"}}>← Retour</button></div>}
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.3rem",color:C.g900,marginBottom:4}}>{mode==="login"?"Connexion":"Créer un compte"}</h2>
        <p style={{fontSize:"0.85rem",color:C.x500,marginBottom:20}}>{mode==="login"?"Accédez à votre espace":"14 jours gratuits, sans CB"}</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div><span style={lbl}>Email</span><input style={inp} type="email" placeholder="contact@entreprise.fr" value={f.email} onChange={e=>u("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          <div><span style={lbl}>Mot de passe</span><input style={inp} type="password" placeholder="••••••••" value={f.password} onChange={e=>u("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          {mode==="signup"&&<div><span style={lbl}>Confirmer</span><input style={inp} type="password" placeholder="••••••••" value={f.confirm} onChange={e=>u("confirm",e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>}
          {err&&<div style={{fontSize:"0.82rem",color:C.r500,background:C.r100,padding:"8px 12px",borderRadius:8}}>{err}</div>}
          <button style={{...bp,width:"100%",justifyContent:"center"}} onClick={go}>{mode==="login"?"Se connecter →":"Créer mon compte →"}</button>
          <div style={{textAlign:"center",fontSize:"0.82rem",color:C.x500}}>{mode==="login"?"Pas de compte ? ":"Déjà inscrit ? "}<button onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("")}} style={{color:C.g700,fontWeight:600,border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.82rem"}}>{mode==="login"?"S'inscrire":"Se connecter"}</button></div>
        </div>
      </div>
    </div>
  </div>;
}

// ===================== ONBOARDING =====================
function Onboard({onDone}){
  const toast=useT();const mob=useMobile();const[step,setStep]=useState(1);const[logo,setLogo]=useState(null);
  const[f,sF]=useState({entreprise:"",siret:"",adresse:"",cp:"",ville:"",telephone:"",email:"",metier:"plombier",assurance:"",tvaRate:"10"});
  const u=(k,v)=>sF(p=>({...p,[k]:v}));
  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${C.g50},${C.w50})`,padding:16}}>
    <div style={{...crd,maxWidth:540,width:"100%",padding:mob?20:32}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:8}}><Logo s={28}/><span style={{fontWeight:800,fontSize:"1.2rem",color:C.g800}}>Batiflow</span></div>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.3rem",color:C.g900}}>Configuration — Étape {step}/2</h2>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8}}><div style={{width:60,height:4,borderRadius:4,background:C.g500}}/><div style={{width:60,height:4,borderRadius:4,background:step>=2?C.g500:C.x100}}/></div>
      </div>
      {step===1?<div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
          <div><span style={lbl}>Entreprise *</span><input style={inp} placeholder="Dupont Plomberie" value={f.entreprise} onChange={e=>u("entreprise",e.target.value)}/></div>
          <div><span style={lbl}>SIRET</span><input style={inp} placeholder="123 456 789 00012" value={f.siret} onChange={e=>u("siret",e.target.value)}/></div>
        </div>
        <div><span style={lbl}>Adresse</span><input style={inp} placeholder="12 rue des Artisans" value={f.adresse} onChange={e=>u("adresse",e.target.value)}/></div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 2fr",gap:10}}>
          <div><span style={lbl}>CP</span><input style={inp} placeholder="75001" value={f.cp} onChange={e=>u("cp",e.target.value)}/></div>
          <div><span style={lbl}>Ville</span><input style={inp} placeholder="Paris" value={f.ville} onChange={e=>u("ville",e.target.value)}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
          <div><span style={lbl}>Téléphone *</span><input style={inp} placeholder="06 12 34 56 78" value={f.telephone} onChange={e=>u("telephone",e.target.value)}/></div>
          <div><span style={lbl}>Email *</span><input style={inp} type="email" placeholder="contact@dupont.fr" value={f.email} onChange={e=>u("email",e.target.value)}/></div>
        </div>
        <div><span style={lbl}>Métier</span><select style={{...inp,cursor:"pointer"}} value={f.metier} onChange={e=>u("metier",e.target.value)}>{["plombier","électricien","peintre","carreleur","maçon","menuisier","autre"].map(m=><option key={m} value={m}>{m[0].toUpperCase()+m.slice(1)}</option>)}</select></div>
        <button style={{...bp,width:"100%",justifyContent:"center",opacity:f.entreprise&&f.telephone&&f.email?1:0.5,pointerEvents:f.entreprise&&f.telephone&&f.email?"auto":"none"}} onClick={()=>setStep(2)}>Continuer →</button>
      </div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:56,height:56,borderRadius:12,border:`2px dashed ${C.x300}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:C.x100,flexShrink:0}}>{logo?<img src={logo} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{color:C.x500}}>📷</span>}</div>
          <label style={{...bs,...bsm,cursor:"pointer"}}>📷 Logo<input type="file" accept="image/*" onChange={e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=ev=>setLogo(ev.target.result);r.readAsDataURL(file)}}} style={{display:"none"}}/></label>
        </div>
        <div><span style={lbl}>Assurance décennale</span><input style={inp} placeholder="N° de police" value={f.assurance} onChange={e=>u("assurance",e.target.value)}/></div>
        <div><span style={lbl}>TVA</span><select style={{...inp,cursor:"pointer"}} value={f.tvaRate} onChange={e=>u("tvaRate",e.target.value)}><option value="10">10%</option><option value="20">20%</option><option value="5.5">5.5%</option><option value="0">0%</option></select></div>
        <div style={{display:"flex",gap:8}}><button style={{...bs,flex:1,justifyContent:"center"}} onClick={()=>setStep(1)}>← Retour</button><button style={{...bp,flex:2,justifyContent:"center"}} onClick={()=>{toast("Bienvenue sur Batiflow ! 🎉");onDone({...f,logo})}}>C'est parti →</button></div>
      </div>}
    </div>
  </div>;
}

// ===================== DASHBOARD =====================
function Dash({art,setArt,onOut,email}){
  const toast=useT();const mob=useMobile();
  const[v,setV]=useState("home");const[devis,setDevis]=useState([]);const[facs,setFacs]=useState([]);const[clis,setClis]=useState([]);const[cur,setCur]=useState(null);const[nav,setNav]=useState(false);
  const addC=c=>{if(c.nom&&!clis.find(x=>x.nom===c.nom))setClis(p=>[...p,{...c,id:Date.now()}])};
  const go=id=>{setV(id);setCur(null);setNav(false)};
  const items=[{id:"home",i:"🏠",l:"Dashboard"},{id:"new-devis",i:"📝",l:"Nouveau devis"},{id:"devis-list",i:"📋",l:"Devis"},{id:"factures",i:"🧾",l:"Factures"},{id:"clients",i:"👥",l:"Clients"},{id:"settings",i:"⚙️",l:"Entreprise"},{id:"subscription",i:"💳",l:"Abonnement"}];

  const sidebar=<div style={{background:C.g900,padding:"16px 0",display:"flex",flexDirection:"column",...(mob?{position:"fixed",top:48,left:0,right:0,bottom:0,zIndex:49}:{position:"sticky",top:0,height:"100vh"})}}>
    {items.map(n=><button key={n.id} onClick={()=>go(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",fontSize:"0.84rem",fontWeight:500,cursor:"pointer",border:"none",background:v===n.id?"rgba(255,255,255,0.1)":"none",color:v===n.id?C.g300:"rgba(255,255,255,0.5)",width:"100%",textAlign:"left",fontFamily:"inherit"}}><span>{n.i}</span>{n.l}</button>)}
    <div style={{marginTop:"auto",padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.3)",marginBottom:4}}>{email}</div>
      <button onClick={onOut} style={{color:"rgba(255,255,255,0.45)",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.8rem",padding:0}}>🚪 Déconnexion</button>
    </div>
  </div>;

  const main=<main style={{padding:mob?16:24,background:C.x100,overflowY:"auto",paddingTop:mob?60:24,minHeight:"100vh"}}>
    {v==="home"&&<HView d={devis} f={facs} a={art} go={go} onNew={()=>go("new-devis")} onVD={d=>{setCur(d);setV("view-d")}} mob={mob}/>}
    {v==="new-devis"&&<DForm art={art} clis={clis} addC={addC} mob={mob} onDone={d=>{const nd={...d,id:Date.now(),date:new Date().toLocaleDateString("fr-FR"),status:"Brouillon",num:`DEV-${new Date().getFullYear()}-${String(devis.length+1).padStart(4,"0")}`};setDevis(p=>[nd,...p]);setCur(nd);setV("view-d");toast("Devis généré ! 📝")}}/>}
    {v==="devis-list"&&<DList devis={devis} onV={d=>{setCur(d);setV("view-d")}} onNew={()=>go("new-devis")}/>}
    {v==="view-d"&&cur&&<DocV doc={cur} a={art} type="devis" mob={mob} onBack={()=>go("devis-list")} onEdit={()=>setV("edit-d")} onFac={()=>{const f2={...cur,id:Date.now(),date:new Date().toLocaleDateString("fr-FR"),status:"Émise",num:`FAC-${new Date().getFullYear()}-${String(facs.length+1).padStart(4,"0")}`};setFacs(p=>[f2,...p]);setDevis(p=>p.map(d=>d.id===cur.id?{...d,status:"Accepté"}:d));setCur(f2);setV("view-f");toast("Facture créée ! 🧾")}}/>}
    {v==="edit-d"&&cur&&<EditD doc={cur} mob={mob} onSave={up=>{setDevis(p=>p.map(d=>d.id===up.id?up:d));setCur(up);setV("view-d");toast("Devis modifié ✓")}} onX={()=>setV("view-d")}/>}
    {v==="factures"&&<FList facs={facs} onV={f=>{setCur(f);setV("view-f")}}/>}
    {v==="view-f"&&cur&&<DocV doc={cur} a={art} type="facture" mob={mob} onBack={()=>go("factures")}/>}
    {v==="clients"&&<CliV clis={clis} setClis={setClis} mob={mob}/>}
    {v==="settings"&&<SetV art={art} setArt={setArt} mob={mob}/>}
    {v==="subscription"&&<SubV mob={mob}/>}
  </main>;

  if(mob) return <div>
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:C.g900,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Logo s={26}/><span style={{fontWeight:800,color:C.wh,fontSize:"1rem"}}>Batiflow</span></div>
      <button onClick={()=>setNav(!nav)} style={{border:"none",background:"none",color:C.wh,cursor:"pointer",fontSize:"1.3rem"}}>{nav?"✕":"☰"}</button>
    </div>
    {nav&&sidebar}
    {main}
  </div>;

  return <div style={{display:"grid",gridTemplateColumns:"230px 1fr",minHeight:"100vh"}}>{sidebar}{main}</div>;
}

// HOME
function HView({d,f,a,go,onNew,onVD,mob}){
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900}}>Bonjour, {a.entreprise} 👋</h1>
      <button style={{...bp,...bsm}} onClick={onNew}>+ Nouveau devis</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:10,marginBottom:20}}>
      {[{l:"Devis",v:d.length,c:C.g600,i:"📝"},{l:"En attente",v:d.filter(x=>x.status==="Brouillon").length,c:C.o500,i:"⏳"},{l:"Factures",v:f.length,c:C.b500,i:"🧾"},{l:"CA",v:f.reduce((s,x)=>s+parseFloat((x.totalTTC||"0").replace(/[^\d.,]/g,"").replace(",",".")),0).toFixed(0)+" €",c:C.g800,i:"💰"}].map((s,i)=><div key={i} style={crd}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"0.75rem",color:C.x500}}>{s.l}</span><span>{s.i}</span></div><div style={{fontSize:"1.4rem",fontWeight:700,color:s.c,marginTop:2,fontFamily:"'Playfair Display',Georgia,serif"}}>{s.v}</div></div>)}
    </div>
    <div style={crd}>
      <h3 style={{fontWeight:700,color:C.g900,marginBottom:12,fontSize:"0.95rem"}}>Derniers devis</h3>
      {d.length===0?<div style={{textAlign:"center",padding:"24px 0"}}><p style={{color:C.x500,marginBottom:10}}>Aucun devis</p><button style={bp} onClick={onNew}>+ Créer</button></div>
      :d.slice(0,5).map((x,i)=><div key={i} onClick={()=>onVD(x)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<Math.min(d.length,5)-1?`1px solid ${C.x100}`:"none",cursor:"pointer",gap:8}}>
        <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:"0.84rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.num} — {x.clientNom}</div><div style={{fontSize:"0.72rem",color:C.x500}}>{x.date}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>{!mob&&<span style={{fontWeight:700,color:C.g800,fontSize:"0.85rem"}}>{x.totalTTC}</span>}<SBadge s={x.status}/></div>
      </div>)}
    </div>
  </div>;
}

// DEVIS FORM
function DForm({art,clis,addC,mob,onDone}){
  const toast=useT();const[f,sF]=useState({clientNom:"",clientAdresse:"",clientEmail:"",clientTel:"",description:"",urgence:"normal"});
  const[loading,setLoading]=useState(false);const[err,setErr]=useState(null);const[showC,setShowC]=useState(false);
  const u=(k,v)=>sF(p=>({...p,[k]:v}));
  const gen=async()=>{setLoading(true);setErr(null);try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Artisan ${art.metier} français. Devis JSON: "${f.description}" Client: ${f.clientNom}. UNIQUEMENT JSON: {"lignes":[{"poste":"X","unite":"m²/u/forfait/h","quantite":1,"prixUnitaireHT":100}],"conditions":"..."} 4-10 lignes, prix France 2025.`}]})});
    const data=await r.json();const txt=data.content?.map(c=>c.text||"").join("")||"";
    const p=JSON.parse(txt.replace(/```json|```/g,"").trim());const tv=parseFloat(art.tvaRate||"10")/100;
    const lignes=p.lignes.map(l=>({...l,totalHT:(l.quantite*l.prixUnitaireHT).toFixed(2)}));
    const ht=lignes.reduce((s,l)=>s+parseFloat(l.totalHT),0);
    addC({nom:f.clientNom,adresse:f.clientAdresse,email:f.clientEmail,telephone:f.clientTel});
    onDone({...f,lignes,totalHT:ht.toFixed(2)+" €",tva:(ht*tv).toFixed(2)+" €",totalTTC:(ht+ht*tv).toFixed(2)+" €",tvaRate:art.tvaRate||"10",conditions:p.conditions||"Paiement à 30 jours"});
  }catch(e){setErr("Erreur. Réessayez.");toast("Erreur","error")}setLoading(false)};
  return <div>
    <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900,marginBottom:16}}>Nouveau devis</h1>
    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14}}>
      <div style={crd}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{fontWeight:700,color:C.g900,fontSize:"0.95rem"}}>👤 Client</h3>{clis.length>0&&<button onClick={()=>setShowC(!showC)} style={{...bs,...bsm}}>📋</button>}</div>
        {showC&&<div style={{background:C.g50,borderRadius:8,padding:8,marginBottom:10,maxHeight:120,overflowY:"auto"}}>{clis.map((c,i)=><button key={i} onClick={()=>{sF(p=>({...p,clientNom:c.nom,clientAdresse:c.adresse||"",clientEmail:c.email||"",clientTel:c.telephone||""}));setShowC(false)}} style={{display:"block",width:"100%",textAlign:"left",padding:"6px 8px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.82rem"}}><strong>{c.nom}</strong></button>)}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div><span style={lbl}>Nom *</span><input style={inp} placeholder="M. Dupont" value={f.clientNom} onChange={e=>u("clientNom",e.target.value)}/></div>
          <div><span style={lbl}>Adresse</span><input style={inp} placeholder="15 rue de la Paix" value={f.clientAdresse} onChange={e=>u("clientAdresse",e.target.value)}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div><span style={lbl}>Email</span><input style={inp} value={f.clientEmail} onChange={e=>u("clientEmail",e.target.value)}/></div>
            <div><span style={lbl}>Tél</span><input style={inp} value={f.clientTel} onChange={e=>u("clientTel",e.target.value)}/></div>
          </div>
        </div>
      </div>
      <div style={crd}>
        <h3 style={{fontWeight:700,color:C.g900,marginBottom:12,fontSize:"0.95rem"}}>🏗️ Chantier</h3>
        <div><span style={lbl}>Description *</span><textarea style={{...inp,minHeight:120,resize:"vertical"}} placeholder={"Rénovation SDB\nDouche italienne\nCarrelage 15m²"} value={f.description} onChange={e=>u("description",e.target.value)}/></div>
        <div style={{background:C.g50,borderRadius:8,padding:10,fontSize:"0.78rem",color:C.x700,marginTop:8}}>💡 Plus c'est précis, meilleur sera le devis.</div>
      </div>
    </div>
    <div style={{marginTop:16,textAlign:"center"}}>
      {err&&<div style={{color:C.r500,marginBottom:8,fontSize:"0.85rem"}}>{err}</div>}
      <button style={{...bp,padding:"12px 28px",opacity:f.clientNom&&f.description&&!loading?1:0.5,pointerEvents:f.clientNom&&f.description&&!loading?"auto":"none"}} onClick={gen}>
        {loading?<span style={{display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-block",width:16,height:16,border:"2.5px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Génération...</span>:<>✨ Générer avec l'IA</>}
      </button>
    </div>
  </div>;
}

// DEVIS LIST
function DList({devis,onV,onNew}){const[q,setQ]=useState("");const[fil,setFil]=useState("all");
  const fd=devis.filter(d=>{const mq=!q||d.clientNom.toLowerCase().includes(q.toLowerCase())||d.num.includes(q);const mf=fil==="all"||d.status===fil;return mq&&mf});
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900}}>Mes devis</h1>
      <button style={{...bp,...bsm}} onClick={onNew}>+ Nouveau</button>
    </div>
    {devis.length>0&&<div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <SearchBar value={q} onChange={setQ}/>
      <div style={{display:"flex",gap:4}}>{[{v:"all",l:"Tous"},{v:"Brouillon",l:"Brouillons"},{v:"Accepté",l:"Acceptés"}].map(o=><button key={o.v} onClick={()=>setFil(o.v)} style={{padding:"5px 12px",borderRadius:50,fontSize:"0.75rem",fontWeight:600,border:`1.5px solid ${fil===o.v?C.g500:C.x100}`,background:fil===o.v?C.g100:C.wh,color:fil===o.v?C.g700:C.x500,cursor:"pointer",fontFamily:"inherit"}}>{o.l}</button>)}</div>
    </div>}
    {fd.length===0?<div style={{...crd,textAlign:"center",padding:"32px 0"}}><p style={{color:C.x500}}>{devis.length===0?"Aucun devis":"Aucun résultat"}</p>{devis.length===0&&<button style={{...bp,marginTop:10}} onClick={onNew}>+ Créer</button>}</div>
    :<div style={crd}>{fd.map((d,i)=><div key={i} onClick={()=>onV(d)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<fd.length-1?`1px solid ${C.x100}`:"none",cursor:"pointer",gap:8}}>
      <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:"0.84rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.num} — {d.clientNom}</div><div style={{fontSize:"0.72rem",color:C.x500}}>{d.date}</div></div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}><span style={{fontWeight:700,color:C.g800,fontSize:"0.85rem"}}>{d.totalTTC}</span><SBadge s={d.status}/></div>
    </div>)}</div>}
  </div>;
}

// DOC VIEW
function DocV({doc,a,type,mob,onBack,onEdit,onFac}){
  const toast=useT();const ref=useRef();const isD=type==="devis";const T=isD?"DEVIS":"FACTURE";
  const print=()=>{const el=ref.current;if(!el)return;const w=window.open("","","width=800,height=1000");w.document.write(`<html><head><title>${T} ${doc.num}</title><style>body{font-family:-apple-system,sans-serif;padding:32px;color:#1a1a1a;font-size:13px}table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #eee}th{background:#f5f5f5;font-size:11px}@media print{body{padding:16px}}</style></head><body>${el.innerHTML}<script>setTimeout(()=>window.print(),400)<\/script></body></html>`);w.document.close()};
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      <button onClick={onBack} style={{...bs,...bsm}}>←</button>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.2rem",color:C.g900}}>{T} {doc.num}</h1>
      <div style={{display:"flex",gap:6,marginLeft:mob?0:"auto",flexWrap:"wrap"}}>
        {isD&&onEdit&&<button style={{...bs,...bsm}} onClick={onEdit}>✏️ Modifier</button>}
        {isD&&onFac&&<button style={{...bs,...bsm}} onClick={onFac}>🧾 Facture</button>}
        <button style={{...bs,...bsm}} onClick={print}>📥 PDF</button>
        <button style={{...bp,...bsm}} onClick={()=>toast("Connectez un service email","info")}>📤 Envoyer</button>
      </div>
    </div>
    <div ref={ref} style={{background:C.wh,borderRadius:16,padding:mob?20:32,boxShadow:"0 4px 20px rgba(0,0,0,0.05)",border:`1px solid ${C.g100}`,maxWidth:780,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>{a.logo&&<img src={a.logo} style={{maxHeight:48,maxWidth:140,marginBottom:6,display:"block"}}/>}<div style={{fontWeight:700,color:C.g800}}>{a.entreprise}</div><div style={{fontSize:"0.78rem",color:C.x500,lineHeight:1.6}}>{a.adresse&&<div>{a.adresse}{a.cp&&`, ${a.cp} ${a.ville||""}`}</div>}<div>{a.telephone} · {a.email}</div>{a.siret&&<div>SIRET: {a.siret}</div>}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:"1.3rem",fontWeight:800,color:isD?C.g800:C.b500,fontFamily:"'Playfair Display',Georgia,serif"}}>{T}</div><div style={{fontSize:"0.78rem",color:C.x500}}>N° {doc.num} — {doc.date}</div></div>
      </div>
      <div style={{background:C.x100,borderRadius:10,padding:14,marginBottom:16}}><div style={{fontSize:"0.7rem",fontWeight:600,color:C.x500,textTransform:"uppercase"}}>Client</div><div style={{fontWeight:600}}>{doc.clientNom}</div>{doc.clientAdresse&&<div style={{fontSize:"0.82rem",color:C.x500}}>{doc.clientAdresse}</div>}</div>
      <div style={{marginBottom:14}}><div style={{fontSize:"0.7rem",fontWeight:600,color:C.x500,textTransform:"uppercase",marginBottom:2}}>Objet</div><div style={{fontSize:"0.85rem",whiteSpace:"pre-wrap"}}>{doc.description}</div></div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",marginBottom:16,minWidth:480}}>
        <thead><tr style={{background:C.g50}}>{["Désignation","Unité","Qté","P.U. HT","Total HT"].map((h,i)=><th key={i} style={{padding:"8px",textAlign:i>1?"right":"left",fontSize:"0.72rem",fontWeight:600,color:C.g800,borderBottom:`2px solid ${C.g200}`}}>{h}</th>)}</tr></thead>
        <tbody>{doc.lignes?.map((l,i)=><tr key={i}><td style={{padding:7,fontSize:"0.82rem",borderBottom:`1px solid ${C.x100}`}}>{l.poste}</td><td style={{padding:7,fontSize:"0.82rem",color:C.x500,borderBottom:`1px solid ${C.x100}`}}>{l.unite}</td><td style={{padding:7,fontSize:"0.82rem",textAlign:"right",borderBottom:`1px solid ${C.x100}`}}>{l.quantite}</td><td style={{padding:7,fontSize:"0.82rem",textAlign:"right",borderBottom:`1px solid ${C.x100}`}}>{Number(l.prixUnitaireHT).toFixed(2)} €</td><td style={{padding:7,fontSize:"0.82rem",textAlign:"right",fontWeight:600,borderBottom:`1px solid ${C.x100}`}}>{l.totalHT} €</td></tr>)}</tbody>
      </table></div>
      <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{width:220}}>{[["Total HT",doc.totalHT],[`TVA (${doc.tvaRate||"10"}%)`,doc.tva]].map(([l,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:"0.85rem"}}><span style={{color:C.x500}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`2px solid ${C.g200}`,marginTop:4}}><span style={{fontWeight:700,color:C.g800}}>TTC</span><span style={{fontWeight:800,color:C.g700,fontSize:"1.15rem",fontFamily:"'Playfair Display',Georgia,serif"}}>{doc.totalTTC}</span></div></div></div>
      <div style={{marginTop:20,padding:14,background:C.g50,borderRadius:10,fontSize:"0.78rem",color:C.x700,lineHeight:1.6}}>
        <strong>Conditions:</strong> {doc.conditions}{isD&&<><br/><div style={{marginTop:14,borderTop:`1px dashed ${C.x300}`,paddingTop:10,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><span>Date: ___________</span><span>Signature: ___________</span></div></>}
      </div>
    </div>
  </div>;
}

// EDIT
function EditD({doc,mob,onSave,onX}){const[ls,setLs]=useState(doc.lignes?.map(l=>({...l}))||[]);const tv=parseFloat(doc.tvaRate||"10")/100;
  const uL=(i,k,v)=>setLs(p=>p.map((l,j)=>{if(j!==i)return l;const up={...l,[k]:v};if(k==="quantite"||k==="prixUnitaireHT")up.totalHT=(Number(up.quantite)*Number(up.prixUnitaireHT)).toFixed(2);return up}));
  const ht=ls.reduce((s,l)=>s+parseFloat(l.totalHT||0),0);
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}><button onClick={onX} style={{...bs,...bsm}}>← Annuler</button><h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.2rem",color:C.g900}}>Modifier</h1><button onClick={()=>onSave({...doc,lignes:ls,totalHT:ht.toFixed(2)+" €",tva:(ht*tv).toFixed(2)+" €",totalTTC:(ht+ht*tv).toFixed(2)+" €"})} style={{...bp,...bsm,marginLeft:"auto"}}>✓ Sauver</button></div>
    <div style={crd}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
      <thead><tr>{["Désignation","Unité","Qté","P.U.","Total",""].map((h,i)=><th key={i} style={{padding:6,textAlign:i>1?"right":"left",fontSize:"0.74rem",color:C.g800,borderBottom:`2px solid ${C.g200}`}}>{h}</th>)}</tr></thead>
      <tbody>{ls.map((l,i)=><tr key={i}><td style={{padding:4}}><input style={{...inp,padding:"6px"}} value={l.poste} onChange={e=>uL(i,"poste",e.target.value)}/></td><td style={{padding:4,width:65}}><select style={{...inp,padding:"6px"}} value={l.unite} onChange={e=>uL(i,"unite",e.target.value)}>{["m²","u","ml","forfait","h"].map(u=><option key={u}>{u}</option>)}</select></td><td style={{padding:4,width:55}}><input style={{...inp,padding:"6px",textAlign:"right"}} type="number" value={l.quantite} onChange={e=>uL(i,"quantite",e.target.value)}/></td><td style={{padding:4,width:75}}><input style={{...inp,padding:"6px",textAlign:"right"}} type="number" value={l.prixUnitaireHT} onChange={e=>uL(i,"prixUnitaireHT",e.target.value)}/></td><td style={{padding:4,width:75,textAlign:"right",fontWeight:600,fontSize:"0.85rem"}}>{l.totalHT} €</td><td style={{padding:4,width:28}}><button onClick={()=>setLs(p=>p.filter((_,j)=>j!==i))} style={{border:"none",background:"none",cursor:"pointer",color:C.r500}}>✕</button></td></tr>)}</tbody>
    </table></div>
    <button onClick={()=>setLs(p=>[...p,{poste:"",unite:"u",quantite:1,prixUnitaireHT:0,totalHT:"0.00"}])} style={{...bs,...bsm,marginTop:8}}>+ Ligne</button>
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><div style={{width:200,fontSize:"0.85rem"}}><div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{color:C.x500}}>HT</span><span style={{fontWeight:600}}>{ht.toFixed(2)} €</span></div><div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{color:C.x500}}>TVA</span><span style={{fontWeight:600}}>{(ht*tv).toFixed(2)} €</span></div><div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:`2px solid ${C.g200}`}}><span style={{fontWeight:700}}>TTC</span><span style={{fontWeight:800,color:C.g700}}>{(ht+ht*tv).toFixed(2)} €</span></div></div></div></div>
  </div>;
}

// FACTURES
function FList({facs,onV}){const[q,setQ]=useState("");const ff=facs.filter(f=>!q||f.clientNom.toLowerCase().includes(q.toLowerCase()));
  return <div><h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900,marginBottom:14}}>Factures</h1>
    {facs.length>0&&<div style={{marginBottom:12}}><SearchBar value={q} onChange={setQ} placeholder="Rechercher..."/></div>}
    {ff.length===0?<div style={{...crd,textAlign:"center",padding:"32px 0"}}><p style={{color:C.x500}}>{facs.length===0?"Convertissez un devis en facture":"Aucun résultat"}</p></div>
    :<div style={crd}>{ff.map((f,i)=><div key={i} onClick={()=>onV(f)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<ff.length-1?`1px solid ${C.x100}`:"none",cursor:"pointer"}}><div><div style={{fontWeight:600,fontSize:"0.84rem"}}>{f.num} — {f.clientNom}</div><div style={{fontSize:"0.72rem",color:C.x500}}>{f.date}</div></div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700,color:C.g800,fontSize:"0.85rem"}}>{f.totalTTC}</span><SBadge s={f.status}/></div></div>)}</div>}
  </div>;
}

// CLIENTS
function CliV({clis,setClis,mob}){const toast=useT();const[add,setAdd]=useState(false);const[q,setQ]=useState("");
  const[f,sF]=useState({nom:"",adresse:"",email:"",telephone:""});const u=(k,v)=>sF(p=>({...p,[k]:v}));
  const fc=clis.filter(c=>!q||c.nom.toLowerCase().includes(q.toLowerCase()));
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900}}>Clients</h1>
      <button style={{...bp,...bsm}} onClick={()=>setAdd(!add)}>+ Ajouter</button>
    </div>
    {add&&<div style={{...crd,marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
      <div><span style={lbl}>Nom *</span><input style={inp} value={f.nom} onChange={e=>u("nom",e.target.value)}/></div>
      <div><span style={lbl}>Tél</span><input style={inp} value={f.telephone} onChange={e=>u("telephone",e.target.value)}/></div>
      <div><span style={lbl}>Adresse</span><input style={inp} value={f.adresse} onChange={e=>u("adresse",e.target.value)}/></div>
      <div><span style={lbl}>Email</span><input style={inp} value={f.email} onChange={e=>u("email",e.target.value)}/></div>
    </div><div style={{display:"flex",gap:6,marginTop:8}}><button style={bp} onClick={()=>{if(!f.nom)return;setClis(p=>[...p,{...f,id:Date.now()}]);sF({nom:"",adresse:"",email:"",telephone:""});setAdd(false);toast("Client ajouté ✓")}}>Ajouter</button><button style={bs} onClick={()=>setAdd(false)}>Annuler</button></div></div>}
    {clis.length>0&&<div style={{marginBottom:12}}><SearchBar value={q} onChange={setQ} placeholder="Rechercher un client..."/></div>}
    {fc.length===0?<div style={{...crd,textAlign:"center",padding:"32px 0"}}><p style={{color:C.x500}}>{clis.length===0?"Se remplira automatiquement":"Aucun résultat"}</p></div>
    :<div style={crd}>{fc.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<fc.length-1?`1px solid ${C.x100}`:"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:32,height:32,borderRadius:"50%",background:C.g100,display:"flex",alignItems:"center",justifyContent:"center",color:C.g700,fontWeight:700,fontSize:"0.72rem"}}>{c.nom.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}</div><div><div style={{fontWeight:600,fontSize:"0.84rem"}}>{c.nom}</div><div style={{fontSize:"0.72rem",color:C.x500}}>{[c.email,c.telephone].filter(Boolean).join(" · ")||"—"}</div></div></div>
      <button onClick={()=>{setClis(p=>p.filter(x=>x.id!==c.id));toast("Supprimé")}} style={{border:"none",background:"none",cursor:"pointer",color:C.x300}}>✕</button>
    </div>)}</div>}
  </div>;
}

// SETTINGS
function SetV({art,setArt,mob}){const toast=useT();const[f,sF]=useState({...art});const u=(k,v)=>sF(p=>({...p,[k]:v}));
  return <div><h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900,marginBottom:14}}>Mon entreprise</h1>
    <div style={crd}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{width:52,height:52,borderRadius:12,border:`2px dashed ${C.x300}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:C.x100,flexShrink:0}}>{f.logo?<img src={f.logo} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{color:C.x500}}>📷</span>}</div>
        <label style={{...bs,...bsm,cursor:"pointer"}}>📷 Logo<input type="file" accept="image/*" onChange={e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=ev=>u("logo",ev.target.result);r.readAsDataURL(file)}}} style={{display:"none"}}/></label>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
        {[["entreprise","Entreprise"],["siret","SIRET"],["adresse","Adresse"],["ville","Ville"],["telephone","Tél"],["email","Email"]].map(([k,l])=><div key={k}><span style={lbl}>{l}</span><input style={inp} value={f[k]||""} onChange={e=>u(k,e.target.value)}/></div>)}
        <div><span style={lbl}>Métier</span><select style={{...inp,cursor:"pointer"}} value={f.metier||"plombier"} onChange={e=>u("metier",e.target.value)}>{["plombier","électricien","peintre","carreleur","maçon","autre"].map(m=><option key={m} value={m}>{m[0].toUpperCase()+m.slice(1)}</option>)}</select></div>
        <div><span style={lbl}>TVA</span><select style={{...inp,cursor:"pointer"}} value={f.tvaRate||"10"} onChange={e=>u("tvaRate",e.target.value)}><option value="10">10%</option><option value="20">20%</option><option value="5.5">5.5%</option><option value="0">0%</option></select></div>
      </div>
      <button style={{...bp,marginTop:12}} onClick={()=>{setArt(f);toast("Sauvegardé ✓")}}>Enregistrer</button>
    </div>
  </div>;
}

// SUBSCRIPTION
function SubV({mob}){const toast=useT();const[sel,setSel]=useState("pro");const[pay,setPay]=useState(false);
  const plans=[{id:"starter",n:"Starter",p:"14,99",f:["Devis illimités","PDF","Email","Support"]},{id:"pro",n:"Pro",p:"34,99",pop:true,f:["Tout Starter","Factures","Relances","Marges","Dashboard"]},{id:"entreprise",n:"Entreprise",p:"49,99",f:["Tout Pro","Suivi chantier","Contrats","5 users"]}];
  return <div><h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.4rem",color:C.g900,marginBottom:4}}>Abonnement</h1><p style={{color:C.x500,marginBottom:16,fontSize:"0.85rem"}}>Essai gratuit — <strong style={{color:C.g700}}>14 jours</strong></p>
    {!pay?<><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:12}}>
      {plans.map(p=><div key={p.id} onClick={()=>setSel(p.id)} style={{...crd,cursor:"pointer",border:`2px solid ${sel===p.id?C.g500:C.x100}`,position:"relative"}}>
        {p.pop&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:C.g500,color:C.wh,fontSize:"0.68rem",fontWeight:700,padding:"3px 10px",borderRadius:50}}>Recommandé</div>}
        <div style={{fontWeight:600}}>{p.n}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:2,margin:"8px 0"}}><span style={{fontSize:"1.8rem",fontWeight:800,color:C.g800,fontFamily:"'Playfair Display',Georgia,serif"}}>{p.p}</span><span style={{color:C.x500,fontSize:"0.82rem"}}>€/mois</span></div>
        {p.f.map((f,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.78rem",color:C.x700,padding:"2px 0"}}><Chk/>{f}</div>)}
      </div>)}
    </div>
    <div style={{marginTop:14,textAlign:"center"}}><button style={bp} onClick={()=>setPay(true)}>Choisir {plans.find(p=>p.id===sel)?.n} →</button></div>
    </>:<div style={{...crd,maxWidth:380}}>
      <h3 style={{fontWeight:700,marginBottom:14}}>💳 {plans.find(p=>p.id===sel)?.n}</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div><span style={lbl}>Carte</span><input style={inp} placeholder="4242 4242 4242 4242"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><div><span style={lbl}>Exp.</span><input style={inp} placeholder="12/26"/></div><div><span style={lbl}>CVC</span><input style={inp} placeholder="123"/></div></div>
        <div style={{display:"flex",gap:6}}><button style={{...bs,flex:1,justifyContent:"center"}} onClick={()=>setPay(false)}>←</button><button style={{...bp,flex:2,justifyContent:"center"}} onClick={()=>toast("Paiement simulé — Stripe requis","info")}>Confirmer</button></div>
      </div>
    </div>}
  </div>;
}

// ===================== MAIN =====================
export default function App(){
  const[p,setP]=useState("landing");const[art,setArt]=useState(null);const[em,setEm]=useState("");const[leg,setLeg]=useState(null);
  return <TP>
    <div style={{fontFamily:"'DM Sans',-apple-system,sans-serif",color:C.x900,minHeight:"100vh",background:C.w50}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet"/>
      {leg?<Legal title={leg} onBack={()=>setLeg(null)}/>:
       p==="landing"?<Landing onStart={()=>setP("auth-s")} onLogin={()=>setP("auth-l")} onLegal={setLeg}/>:
       p==="auth-s"?<Auth mode="signup" onAuth={({email})=>{setEm(email);setP("onboard")}} onBack={()=>setP("landing")}/>:
       p==="auth-l"?<Auth mode="login" onAuth={({email})=>{setEm(email);setP("onboard")}} onBack={()=>setP("landing")}/>:
       p==="onboard"?<Onboard onDone={d=>{setArt(d);setP("dash")}}/>:
       p==="dash"&&art?<Dash art={art} setArt={setArt} onOut={()=>{setP("landing");setArt(null)}} email={em}/>:null}
    </div>
  </TP>;
}
