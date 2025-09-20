// Supabase se connect karne ke liye zaroori cheezein
// Inhein apni asal Supabase URL aur Key se replace karna na bhoolein.
const SUPABASE_URL = 'https://wywxtmolysdhgrfctvgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5d3h0bW9seXNkaGdyZmN0dmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTY3NDcsImV4cCI6MjA3MzY5Mjc0N30.MxZzwwQJUKqmqerYa6gmlOWYFShH7vJ694rxNJ4VbDY';

// Supabase ka client banana.
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
