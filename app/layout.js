import './globals.css'

export const metadata = {
  title: 'Batiflow — Gestion automatique pour artisans',
  description:
    'Devis, factures, relances... Batiflow automatise la gestion administrative des artisans du batiment grace a l\'IA.',
  keywords: 'devis artisan, facture artisan, gestion batiment, IA artisan, logiciel artisan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
