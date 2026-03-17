import { useState } from "react";
import { createOrder } from "../../services/orderService";

const initialState = {
  businessId: "",
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  carpetCount: "",
  serviceMode: "pickup_delivery",
  preferredTimeSlot: "08_12",
  note: "",
};

function OrderForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.businessId || !form.customerName || !form.customerPhone) {
      setStatus({ type: "error", message: "Popunite obavezna polja." });
      return;
    }

    setLoading(true);

    try {
      await createOrder({
        business_id: form.businessId,
        customer_name: form.customerName,
        customer_phone: form.customerPhone,
        customer_address: form.customerAddress,
        carpet_count: form.carpetCount ? Number(form.carpetCount) : null,
        service_mode: form.serviceMode,
        preferred_time_slot: form.preferredTimeSlot,
        note: form.note,
      });

      setStatus({ type: "success", message: "Zahtjev je uspješno poslan." });
      setForm(initialState);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Greška pri slanju." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <label>
        Servis
        <select
          name="businessId"
          value={form.businessId}
          onChange={handleChange}
          required
        >
          <option value="">Odaberite servis</option>
          <option value="11111111-1111-1111-1111-111111111111">Mošus</option>
          <option value="22222222-2222-2222-2222-222222222222">Tip Top</option>
        </select>
      </label>

      <label>
        Ime i prezime
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Broj telefona
        <input
          type="tel"
          name="customerPhone"
          value={form.customerPhone}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Adresa
        <input
          type="text"
          name="customerAddress"
          value={form.customerAddress}
          onChange={handleChange}
        />
      </label>

      <label>
        Broj tepiha
        <input
          type="number"
          min="1"
          name="carpetCount"
          value={form.carpetCount}
          onChange={handleChange}
        />
      </label>

      <label>
        Način usluge
        <select
          name="serviceMode"
          value={form.serviceMode}
          onChange={handleChange}
        >
          <option value="pickup_delivery">Preuzimanje i dostava</option>
          <option value="drop_off">Klijent donosi tepih</option>
        </select>
      </label>

      <label>
        Vremenski interval
        <select
          name="preferredTimeSlot"
          value={form.preferredTimeSlot}
          onChange={handleChange}
        >
          <option value="08_12">08:00 – 12:00</option>
          <option value="14_18">14:00 – 18:00</option>
        </select>
      </label>

      <label>
        Napomena
        <textarea
          name="note"
          rows="4"
          value={form.note}
          onChange={handleChange}
        />
      </label>

      {status.message && (
        <div className={`alert alert--${status.type}`}>{status.message}</div>
      )}

      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Slanje..." : "Pošalji zahtjev"}
      </button>
    </form>
  );
}

export default OrderForm;