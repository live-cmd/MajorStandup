import { createClient } from '@supabase/supabase-js';

// Reuses the shared CJP/AfterDARK Supabase project, scoped to
// major_-prefixed tables to keep Major's data clearly separated.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
