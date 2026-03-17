import AppShell from "../components/layout/AppShell";
import InviteAcceptForm from "../components/invite/InviteAcceptForm";

function InvitePage() {
  return (
    <AppShell>
      <section className="section">
        <div className="container narrow">
          <h1>Prihvati pozivnicu</h1>
          <p>Dovršite aktivaciju računa za pristup aplikaciji.</p>
          <InviteAcceptForm />
        </div>
      </section>
    </AppShell>
  );
}

export default InvitePage;