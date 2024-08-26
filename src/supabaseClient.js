import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcoynzqmscexlrtfjhfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb3luenFtc2NleGxydGZqaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NzMyNDUsImV4cCI6MjA0MDI0OTI0NX0.GX7AP6Mpk9W0RD4T8me2ZXi_AKljRfbyha1M7jN1YG4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);