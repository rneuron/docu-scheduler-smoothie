// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eangwqvawqqpoxwnphgg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbmd3cXZhd3FxcG94d25waGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzYxNzQsImV4cCI6MjA1ODM1MjE3NH0.K0pUTQsrP9TNJB0U5j4pec7qTIbT1Utf635o5YPZzCo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);