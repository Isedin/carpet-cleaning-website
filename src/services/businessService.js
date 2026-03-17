import { supabase } from "../lib/supabaseClient";

export async function searchBusinesses(search = "") {
  let query = supabase
    .from("businesses")
    .select("id, name, city, service_mode")
    .eq("is_active", true);

  if (search.trim()) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query.order("name");

  if (error) throw new Error(error.message);

  return data;
}
