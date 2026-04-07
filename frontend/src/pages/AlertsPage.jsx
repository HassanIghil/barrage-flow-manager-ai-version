import { useEffect, useState } from "react";
import api from "../api/axios";
import AlertTable from "../components/AlertTable";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentAlerts() {
      try {
        const response = await api.get("/alerts/recent");
        setAlerts(response.data.slice(0, 5));
      } catch (error) {
        console.error("Erreur alertes:", error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentAlerts();
  }, []);

  return (
    <section className="rounded-[28px] border border-ember/20 bg-white p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-ember">Alerts</p>
      <h2 className="mt-3 font-display text-3xl text-ink">Critical events</h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Suivi des 5 dernieres alertes urgentes issues du registre d'incidents.
      </p>

      <div className="mt-8">
        <AlertTable alerts={alerts} loading={loading} />
      </div>
    </section>
  );
}
