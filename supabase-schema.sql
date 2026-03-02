-- ================================================
-- BATIFLOW — Schema de base de donnees Supabase
-- ================================================
-- Executez ce SQL dans Supabase > SQL Editor

-- Table des profils artisans (liee a auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  entreprise TEXT NOT NULL,
  siret TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  telephone TEXT,
  metier TEXT DEFAULT 'plombier',
  assurance TEXT,
  tva_rate DECIMAL(4,2) DEFAULT 10.00,
  logo_url TEXT,
  plan TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  adresse TEXT,
  email TEXT,
  telephone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des devis
CREATE TABLE IF NOT EXISTS devis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id),
  numero TEXT NOT NULL,
  client_nom TEXT NOT NULL,
  client_adresse TEXT,
  client_email TEXT,
  client_tel TEXT,
  description TEXT NOT NULL,
  lignes JSONB NOT NULL DEFAULT '[]',
  total_ht DECIMAL(10,2) NOT NULL DEFAULT 0,
  tva DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
  tva_rate DECIMAL(4,2) DEFAULT 10.00,
  conditions TEXT DEFAULT 'Paiement a 30 jours',
  status TEXT DEFAULT 'Brouillon',
  urgence TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des factures
CREATE TABLE IF NOT EXISTS factures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  devis_id UUID REFERENCES devis(id),
  numero TEXT NOT NULL,
  client_nom TEXT NOT NULL,
  client_adresse TEXT,
  client_email TEXT,
  description TEXT,
  lignes JSONB NOT NULL DEFAULT '[]',
  total_ht DECIMAL(10,2) NOT NULL DEFAULT 0,
  tva DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
  tva_rate DECIMAL(4,2) DEFAULT 10.00,
  conditions TEXT,
  status TEXT DEFAULT 'Emise',
  echeance DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_devis_user ON devis(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_status ON devis(status);
CREATE INDEX IF NOT EXISTS idx_factures_user ON factures(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);

-- Row Level Security (chaque user ne voit que ses donnees)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own devis" ON devis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own factures" ON factures
  FOR ALL USING (auth.uid() = user_id);

-- Trigger pour creer un profil automatiquement a l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
