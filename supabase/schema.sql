-- =====================================================
-- AGRO CREDIT MVP - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. FARMERS TABLE (Perfil y ubicación del predio)
-- =====================================================
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  document_id VARCHAR(50) UNIQUE, -- Cédula o ID
  farm_name VARCHAR(255),
  farm_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  municipality VARCHAR(100),
  department VARCHAR(100), -- Estado/Departamento
  risk_zone_level INTEGER DEFAULT 1 CHECK (risk_zone_level BETWEEN 1 AND 5), -- 1=bajo, 5=alto
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. PLOTS TABLE (Parcelas/Lotes de cultivo)
-- =====================================================
CREATE TABLE plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  plot_name VARCHAR(255) NOT NULL,
  hectares DECIMAL(10, 2) NOT NULL,
  crop_type VARCHAR(100) NOT NULL, -- 'arroz', 'maíz', 'café', etc.
  planting_date DATE,
  expected_harvest_date DATE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  soil_type VARCHAR(100),
  irrigation_system VARCHAR(100), -- 'riego por goteo', 'aspersión', 'lluvia'
  certified_seeds BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. RISK_LOGS TABLE (Registro de mitigación)
-- =====================================================
CREATE TABLE risk_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  log_type VARCHAR(50) NOT NULL, -- 'pest_control', 'disease_prevention', 'climate_action'
  description TEXT NOT NULL,
  photo_url TEXT, -- URL de Supabase Storage
  severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5), -- 1=leve, 5=crítico
  action_taken TEXT,
  cost DECIMAL(10, 2), -- Costo de la acción preventiva
  ndvi_index DECIMAL(4, 3), -- Índice de salud del cultivo (0.0 a 1.0)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREDIT_SCORES TABLE (Puntaje de crédito verde)
-- =====================================================
CREATE TABLE credit_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) NOT NULL, -- 'bajo', 'medio', 'alto'
  total_plots INTEGER DEFAULT 0,
  total_hectares DECIMAL(10, 2) DEFAULT 0,
  prevention_actions_count INTEGER DEFAULT 0,
  avg_ndvi DECIMAL(4, 3), -- Promedio NDVI de todos los reportes
  certified_seeds_percentage DECIMAL(5, 2),
  days_since_last_report INTEGER,
  climate_resilience_score DECIMAL(5, 2), -- Componente específico de resiliencia
  financial_commitment_score DECIMAL(5, 2), -- Inversión en prevención
  calculation_details JSONB, -- Metadata del cálculo
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. BANK_ACCESS_TOKENS (Tokens compartibles con bancos)
-- =====================================================
CREATE TABLE bank_access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  bank_name VARCHAR(255),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_farmers_user_id ON farmers(user_id);
CREATE INDEX idx_plots_farmer_id ON plots(farmer_id);
CREATE INDEX idx_risk_logs_plot_id ON risk_logs(plot_id);
CREATE INDEX idx_risk_logs_farmer_id ON risk_logs(farmer_id);
CREATE INDEX idx_credit_scores_farmer_id ON credit_scores(farmer_id);
CREATE INDEX idx_bank_tokens_farmer_id ON bank_access_tokens(farmer_id);
CREATE INDEX idx_bank_tokens_token ON bank_access_tokens(token);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_access_tokens ENABLE ROW LEVEL SECURITY;

-- FARMERS: Users can only see their own data
CREATE POLICY "Users can view own farmer profile"
  ON farmers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farmer profile"
  ON farmers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farmer profile"
  ON farmers FOR UPDATE
  USING (auth.uid() = user_id);

-- PLOTS: Users can only manage their own plots
CREATE POLICY "Users can view own plots"
  ON plots FOR SELECT
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own plots"
  ON plots FOR INSERT
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own plots"
  ON plots FOR UPDATE
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own plots"
  ON plots FOR DELETE
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- RISK_LOGS: Users can only manage their own logs
CREATE POLICY "Users can view own risk logs"
  ON risk_logs FOR SELECT
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own risk logs"
  ON risk_logs FOR INSERT
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own risk logs"
  ON risk_logs FOR UPDATE
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- CREDIT_SCORES: Users can view their own scores
CREATE POLICY "Users can view own credit scores"
  ON credit_scores FOR SELECT
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- BANK_ACCESS_TOKENS: Users can manage their own tokens
CREATE POLICY "Users can view own bank tokens"
  ON bank_access_tokens FOR SELECT
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own bank tokens"
  ON bank_access_tokens FOR INSERT
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Bank access via token (public read for valid tokens)
CREATE POLICY "Banks can view farmer data with valid token"
  ON farmers FOR SELECT
  USING (
    id IN (
      SELECT farmer_id FROM bank_access_tokens 
      WHERE is_active = TRUE 
      AND expires_at > NOW()
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farmers_updated_at BEFORE UPDATE ON farmers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plots_updated_at BEFORE UPDATE ON plots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate random token for bank access
CREATE OR REPLACE FUNCTION generate_bank_token()
RETURNS VARCHAR AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (para testing)
-- =====================================================
-- Comentar en producción
/*
INSERT INTO farmers (user_id, full_name, phone, email, farm_name, municipality, department, risk_zone_level)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Juan Pérez', '+57 300 1234567', 'juan@example.com', 'Finca El Progreso', 'Montería', 'Córdoba', 2);
*/
