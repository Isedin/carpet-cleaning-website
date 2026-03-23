import { supabase } from "../lib/supabaseClient";

export async function getInviteByToken(token) {
  const cleanToken = String(token || "").trim();

  if (!cleanToken) {
    throw new Error("Nedostaje invite token.");
  }

  const { data, error } = await supabase.rpc("get_business_invite_by_token", {
    p_token: cleanToken,
  });

  console.log("TOKEN SA WEBSITE:", cleanToken);
  console.log("RPC DATA:", data);
  console.log("RPC ERROR:", error);

  if (error) {
    throw new Error(error.message || "Greška pri dohvaćanju pozivnice.");
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("Pozivnica nije pronađena.");
  }

  return data[0];
}

export async function acceptInvite({ token, nickname, password }) {
  const invite = await getInviteByToken(token);

  if (invite.accepted_at) {
    throw new Error("Ova pozivnica je već prihvaćena.");
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    throw new Error("Pozivnica je istekla.");
  }

  const { data, error } = await supabase.functions.invoke(
    "accept-business-invite",
    {
      body: {
        token: String(token || "").trim(),
        fullName: String(nickname || "").trim(),
        password: String(password || ""),
      },
    },
  );

  console.log("ACCEPT INVITE FUNCTION DATA:", data);
  console.log("ACCEPT INVITE FUNCTION ERROR:", error);

  if (error) {
    throw new Error(error.message || "Greška pri aktivaciji računa.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.success) {
    throw new Error("Aktivacija računa nije uspjela.");
  }

  return data;
}
