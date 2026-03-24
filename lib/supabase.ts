import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export type Farmer = {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  document_id?: string;
  farm_name?: string;
  farm_address?: string;
  latitude?: number;
  longitude?: number;
  municipality?: string;
  department?: string;
  risk_zone_level?: number;
  created_at: string;
  updated_at: string;
};

export type Plot = {
  id: string;
  farmer_id: string;
  plot_name: string;
  hectares: number;
  crop_type: string;
  planting_date?: string;
  expected_harvest_date?: string;
  latitude?: number;
  longitude?: number;
  soil_type?: string;
  irrigation_system?: string;
  certified_seeds: boolean;
  created_at: string;
  updated_at: string;
};

export type RiskLog = {
  id: string;
  plot_id: string;
  farmer_id: string;
  log_type: 'pest_control' | 'disease_prevention' | 'climate_action';
  description: string;
  photo_url?: string;
  severity_level?: number;
  action_taken?: string;
  cost?: number;
  ndvi_index?: number;
  latitude?: number;
  longitude?: number;
  logged_at: string;
  created_at: string;
};

export type CreditScore = {
  id: string;
  farmer_id: string;
  score: number;
  risk_level: 'bajo' | 'medio' | 'alto';
  total_plots: number;
  total_hectares: number;
  prevention_actions_count: number;
  avg_ndvi?: number;
  certified_seeds_percentage?: number;
  days_since_last_report?: number;
  climate_resilience_score?: number;
  financial_commitment_score?: number;
  calculation_details?: Record<string, any>;
  calculated_at: string;
  valid_until?: string;
  created_at: string;
};

export type BankAccessToken = {
  id: string;
  farmer_id: string;
  token: string;
  bank_name?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  access_count: number;
  last_accessed_at?: string;
};
