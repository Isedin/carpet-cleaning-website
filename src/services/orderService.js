import { supabase } from "../lib/supabaseClient";

export async function createOrder(payload) {
  const { data, error } = await supabase
    .from("orders")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
