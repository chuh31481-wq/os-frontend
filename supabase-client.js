// Supabase se connect karne ke liye zaroori cheezein
const SUPABASE_URL = 'https://wywxtmolysdhgrfctvgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5d3h0bW9seXNkaGdyZmN0dmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTY3NDcsImV4cCI6MjA3MzY5Mjc0N30.MxZzwwQJUKqmqerYa6gmlOWYFShH7vJ694rxNJ4VbDY';

// Supabase ka client banana
// Hum is 'supabase' object ko apni doosri JS files mein istemal karenge
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
