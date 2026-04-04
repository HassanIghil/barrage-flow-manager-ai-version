import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ReleaseForm from "../components/ReleaseForm";
import ReleaseTable from "../components/ReleasesTable";

export default function ReleasesPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Try the new enriched endpoint first, fall back to dashboard/history
      const response = await api.get("/releases/").catch(() =>
        api.get("/dashboard/history")
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Colonne Formulaire */}
      <div className="space-y-6">
        <ReleaseForm onSuccess={fetchHistory} />
      </div>

      {/* Colonne Historique */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-ink">
              Historique des lâchers
            </h3>
            <p className="mt-2 text-slate-500">Suivi des opérations récentes</p>
          </div>
          <button
            onClick={fetchHistory}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Actualiser
          </button>
        </div>

        <ReleaseTable
          data={history}
          loading={loading}
          onRefresh={fetchHistory}
        />
      </div>
    </section>
  );
}