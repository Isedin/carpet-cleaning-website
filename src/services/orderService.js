import { supabase } from "../lib/supabaseClient";

export async function createOrder(payload) {
  const { data, error } = await supabase.functions.invoke(
    "create-public-order",
    {
      body: payload,
    },
  );

  if (error) {
    throw new Error(error.message || "Greška pri slanju zahtjeva.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
