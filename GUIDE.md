# BATIFLOW - Guide de Deploiement

## Structure du projet

batiflow-app/
  app/
    api/generate-devis/route.js  -- API securisee (cle Claude cachee)
    globals.css                  -- Styles + Tailwind
    layout.js                    -- Layout racine SEO
    page.js                      -- Page principale
  lib/supabase.js                -- Client Supabase
  env.example                    -- Template variables
  supabase-schema.sql            -- Schema base de donnees
  package.json
  next.config.js
  tailwind.config.js

---

## ETAPE 1 : Creer les comptes (10 min)

### GitHub (gratuit)
- https://github.com
- Creer un repository "batiflow"

### Supabase (gratuit)
- https://supabase.com
- Nouveau projet "batiflow", region West EU (Paris)
- Settings > API : noter Project URL et anon key

### Anthropic (paiement a l'usage)
- https://console.anthropic.com
- Creer une API key
- Cout : environ 0.01 EUR par devis genere

### Vercel (gratuit)
- https://vercel.com
- Se connecter avec GitHub

### Domaine (~10 EUR/an)
- https://www.namecheap.com ou https://www.ovh.com
- Acheter batiflow.fr

---

## ETAPE 2 : Base de donnees (5 min)

Dans Supabase > SQL Editor, coller le contenu de supabase-schema.sql et cliquer Run.

Cela cree : profiles, clients, devis, factures + securite Row Level.

Activer Authentication > Providers > Email.
Mettre le Site URL sur https://batiflow.fr

---

## ETAPE 3 : Preparer le code (15 min)

Sur votre ordinateur :

  mkdir batiflow-app
  cd batiflow-app
  (copier tous les fichiers)
  cp env.example .env.local
  (editer .env.local avec vos cles)
  npm install
  npm run dev

IMPORTANT : Dans app/page.js, remplacer le contenu par batiflow-v4-fixed.jsx
Et remplacer l'appel API direct par /api/generate-devis

---

## ETAPE 4 : Deployer (5 min)

  git init
  git add .
  git commit -m "Batiflow v1"
  git remote add origin https://github.com/VOTRE-USER/batiflow.git
  git push -u origin main

Sur Vercel : importer le repo, ajouter les variables d'environnement, Deploy.

---

## ETAPE 5 : Domaine (5 min)

Sur Vercel > Settings > Domains, ajouter batiflow.fr
Sur le registrar DNS : A record 76.76.21.21, CNAME www cname.vercel-dns.com

---

## Couts mensuels

Vercel : gratuit (100k visites)
Supabase : gratuit (50k users)
Domaine : 0.83 EUR/mois
Claude API : 0.01 EUR/devis
TOTAL : moins de 2 EUR/mois
