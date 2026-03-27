import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { acceptInvite, getInviteByToken } from "../../services/inviteService";

function InviteAcceptForm() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [invite, setInvite] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(true);

  const [form, setForm] = useState({
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let mounted = true;

    async function loadInvite() {
      if (!token) {
        setStatus({ type: "error", message: "Nedostaje invite token." });
        setLoadingInvite(false);
        return;
      }

      try {
        const data = await getInviteByToken(token);

        if (!mounted) return;

        setInvite(data);
        setForm((prev) => ({
          ...prev,
          nickname: data.full_name || "",
        }));

        if (data.accepted_at) {
          setStatus({
            type: "error",
            message: "Ova pozivnica je već prihvaćena.",
          });
        } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setStatus({
            type: "error",
            message: "Ova pozivnica je istekla.",
          });
        }
      } catch (error) {
        if (!mounted) return;
        setStatus({
          type: "error",
          message: error.message || "Pozivnica nije pronađena.",
        });
      } finally {
        if (mounted) setLoadingInvite(false);
      }
    }

    loadInvite();

    return () => {
      mounted = false;
    };
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!invite) {
      setStatus({ type: "error", message: "Pozivnica nije učitana." });
      return;
    }

    if (!form.nickname.trim()) {
      setStatus({ type: "error", message: "Unesite ime ili nickname." });
      return;
    }

    if (!form.password || form.password.length < 6) {
      setStatus({
        type: "error",
        message: "Lozinka mora imati najmanje 6 karaktera.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Lozinke se ne poklapaju." });
      return;
    }

    setSubmitting(true);

    try {
      await acceptInvite({
        token,
        nickname: form.nickname.trim(),
        password: form.password,
      });

      setStatus({
        type: "success",
        message:
          invite.role === "owner"
            ? "Owner račun je aktiviran. Sada se možete prijaviti u aplikaciju."
            : "Račun je aktiviran. Sada se možete prijaviti u aplikaciju.",
      });

      setStatus({
        type: "success",
        message: "Račun je aktiviran. Sada se možete prijaviti u aplikaciju.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Greška pri aktivaciji računa.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInvite) {
    return (
      <div className="card">
        <p>Učitavanje pozivnice...</p>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="alert alert--error">
        {status.message || "Pozivnica nije pronađena."}
      </div>
    );
  }

  const blocked =
    !!invite.accepted_at ||
    (invite.expires_at && new Date(invite.expires_at) < new Date());

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <div className="card soft">
        <div><strong>Servis:</strong> {invite.business_name}</div>
        <div><strong>Email:</strong> {invite.email}</div>
        <div><strong>Uloga:</strong> {invite.role}</div>
      </div>

      <label>
        Nickname ili ime
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          required
          disabled={blocked || submitting}
        />
      </label>

      <label>
        Lozinka
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          disabled={blocked || submitting}
        />
      </label>

      <label>
        Potvrda lozinke
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          disabled={blocked || submitting}
        />
      </label>

      {status.message && (
        <div className={`alert alert--${status.type}`}>{status.message}</div>
      )}

      {!blocked && (
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Aktivacija..." : "Aktiviraj pristup"}
        </button>
      )}
    </form>
  );
}

export default InviteAcceptForm;