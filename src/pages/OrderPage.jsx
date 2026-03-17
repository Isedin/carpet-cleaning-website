import AppShell from "../components/layout/AppShell";
import OrderForm from "../components/order/OrderForm";

function OrderPage() {
  return (
    <AppShell>
      <section className="section">
        <div className="container narrow">
          <h1>Zahtjev za pranje tepiha</h1>
          <p>Odaberite servis i pošaljite osnovne podatke.</p>
          <OrderForm />
        </div>
      </section>
    </AppShell>
  );
}

export default OrderPage;