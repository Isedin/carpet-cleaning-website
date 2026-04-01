import { supabase } from "../lib/supabaseClient";

export async function createOrder(payload) {
  const { data, error } = await supabase.rpc("create_public_order", {
    p_business_id: payload.business_id,
    p_customer_name: payload.customer_name,
    p_customer_phone: payload.customer_phone,
    p_customer_address: payload.customer_address || null,
    p_planned_carpet_count: Number(payload.carpet_count || 0),
    p_note: payload.note || null,
    p_preferred_time_slot: payload.preferred_time_slot || null,
  });

  if (error) {
    throw new Error(error.message || "Greška pri slanju zahtjeva.");
  }

  return data;
}
