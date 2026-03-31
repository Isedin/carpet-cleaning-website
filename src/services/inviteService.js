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

  // 1. signup
  const { error: signUpError } = await supabase.auth.signUp({
    email: invite.email,
    password,
    options: {
      data: {
        full_name: nickname,
      },
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  // 2. OBAVEZNO login (ovo rješava tvoj FK problem)
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: invite.email,
      password,
    });

  if (loginError) {
    throw new Error(loginError.message);
  }

  if (!loginData?.user) {
    throw new Error("Login nije uspio.");
  }

  // 3. accept invite
  const { error: acceptError } = await supabase.rpc(
    "accept_business_invite_by_token",
    {
      p_token: token,
    },
  );

  if (acceptError) {
    throw new Error(acceptError.message);
  }

  return { success: true, role: invite.role, jobType: invite.job_type };
}
