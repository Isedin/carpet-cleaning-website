import AppShell from "../components/layout/AppShell";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <AppShell>
      <section className="hero">
        <div className="container hero__inner">
          <h1>Jednostavno naručite pranje tepiha</h1>
          <p>
            Klijenti šalju zahtjeve online, a servisi ih odmah vide u aplikaciji.
          </p>

          <div className="hero__actions">
            <Link to="/order" className="btn btn--primary">
              Pošalji zahtjev
            </Link>
            <Link to="/invite" className="btn btn--secondary">
              Prijava radnika
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Kako funkcioniše</h2>
          <div className="steps">
            <div className="card">1. Klijent pošalje zahtjev</div>
            <div className="card">2. Servis vidi narudžbu u aplikaciji</div>
            <div className="card">3. Tepih se preuzima ili donosi</div>
            <div className="card">4. Pranje i isporuka</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default HomePage;