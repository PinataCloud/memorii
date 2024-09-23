import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://pavkivnxndnzvtzptzhg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhdmtpdm54bmRuenZ0enB0emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2NDc5NDEsImV4cCI6MjAzOTIyMzk0MX0.Idj5KZMEB7mT-Z-dej_ZU5oh-6lcX4IWzkEEEjqL4jA')