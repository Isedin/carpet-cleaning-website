import { supabase } from "../lib/supabaseClient";

export async function getInviteByToken(token) {
  const { data, error } = await supabase.rpc("get_business_invite_by_token", {
    p_token: token,
  });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
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

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: invite.email,
    password,
    options: {
      data: {
        full_name: nickname,
      },
      emailRedirectTo: window.location.origin,
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error("Nalog nije kreiran.");
  }

  const { error: acceptError } = await supabase.rpc(
    "accept_business_invite_by_token_admin",
    {
      p_token: token,
      p_user_id: userId,
      p_full_name: nickname,
    },
  );

  if (acceptError) {
    throw new Error(acceptError.message);
  }

  return { success: true };
}
