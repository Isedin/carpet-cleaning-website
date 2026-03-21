import { supabase } from "../lib/supabaseClient";

export async function fetchBusinesses() {
  const { data, error } = await supabase.rpc("public_list_businesses");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
