export const metadata = {
  title: 'Invoxa - Devis artisan par IA en 30 secondes | Factures, relances automatiques',
  description: 'Invoxa génère vos devis artisan par intelligence artificielle en 30 secondes. Factures en 1 clic, signature électronique, relance automatique, suivi de paiement. 14 jours gratuits.',
  keywords: 'devis artisan, logiciel devis batiment, devis IA, facture artisan, devis plombier, devis electricien, devis peintre, logiciel facturation artisan, devis automatique, generateur devis',
  manifest: '/manifest.json',
  themeColor: '#145A3E',
  openGraph: {
    title: 'Invoxa - Vos devis, générés par l\'IA',
    description: 'Le premier outil de devis pour artisans avec intelligence artificielle. Décrivez votre chantier, l\'IA génère un devis complet en 30 secondes.',
    url: 'https://invoxa.tech',
    siteName: 'Invoxa',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invoxa - Devis artisan par IA en 30 secondes',
    description: 'Décrivez votre chantier en 2 lignes, l\'IA génère un devis complet. Factures, relances auto, signature électronique.',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Invoxa',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Invoxa" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{margin:0,padding:0,background:'#145A3E'}}>{children}</body>
    </html>
  )
}
