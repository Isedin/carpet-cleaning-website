import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

function InviteAcceptForm() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [form, setForm] = useState({
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!token) {
      setStatus({ type: "error", message: "Nedostaje invite token." });
      return;
    }

    if (!form.password || form.password.length < 6) {
      setStatus({ type: "error", message: "Lozinka mora imati najmanje 6 karaktera." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Lozinke se ne poklapaju." });
      return;
    }

    try {
      // ovdje kasnije ide stvarni poziv ka Supabase / edge function
      console.log("Accept invite", { token, ...form });

      setStatus({
        type: "success",
        message: "Račun je aktiviran. Sada se možete prijaviti u aplikaciju.",
      });
    } catch {
      setStatus({ type: "error", message: "Greška pri aktivaciji računa." });
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <div className="card soft">
        <strong>Invite token:</strong>
        <div>{token || "Nije pronađen"}</div>
      </div>

      <label>
        Nickname ili ime
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          required
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
        />
      </label>

      {status.message && (
        <div className={`alert alert--${status.type}`}>{status.message}</div>
      )}

      <button className="btn btn--primary" type="submit">
        Aktiviraj pristup
      </button>
    </form>
  );
}

export default InviteAcceptForm;