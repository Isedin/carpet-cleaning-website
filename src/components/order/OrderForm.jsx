import { useEffect, useState } from "react";
import { createOrder } from "../../services/orderService";
import { fetchBusinesses } from "../../services/businessService";

const initialState = {
  businessId: "",
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  carpetCount: "",
  preferredTimeSlot: "08_12",
  note: "",
};

function OrderForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBusinesses() {
      try {
        const data = await fetchBusinesses();
        if (!mounted) return;
        setBusinesses(data);
      } catch (error) {
        if (!mounted) return;
        setStatus({
          type: "error",
          message: error.message || "Greška pri učitavanju servisa.",
        });
      } finally {
        if (mounted) setLoadingBusinesses(false);
      }
    }

    loadBusinesses();

    return () => {
      mounted = false;
    };
  }, []);

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
          disabled={loadingBusinesses}
        >
          <option value="">
            {loadingBusinesses ? "Učitavanje servisa..." : "Odaberite servis"}
          </option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
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
          placeholder="npr. Nemojte previše mirisati tepihe, vuna - obratite pažnju..."
        />
      </label>

      {status.message && (
        <div className={`alert alert--${status.type}`}>{status.message}</div>
      )}

      <button className="btn btn--primary" type="submit" disabled={loading || loadingBusinesses}>
        {loading ? "Slanje..." : "Pošalji zahtjev"}
      </button>
    </form>
  );
}

export default OrderForm;