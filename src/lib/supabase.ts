import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Единственный инстанс клиента для взаимодействия с БД
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
