export const metadata = {
  title: 'QUOTY - Vos devis, générés par l\'IA',
  description: 'Le premier outil de devis pour artisans avec intelligence artificielle. Décrivez votre chantier, l\'IA génère un devis complet en 30 secondes.',
  manifest: '/manifest.json',
  themeColor: '#145A3E',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QUOTY',
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
        <meta name="apple-mobile-web-app-title" content="QUOTY" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
