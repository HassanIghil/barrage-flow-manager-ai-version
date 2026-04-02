import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ReleaseForm from "../components/ReleaseForm";

export default function ReleasesPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/dashboard/history");
      setHistory(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "termine":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Exécuté
          </span>
        );
      case "planifie":
      case "en_cours":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            En attente
          </span>
        );
      case "annule":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
            {statut}
          </span>
        );
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_2fr]">
      {/* Colonne Formulaire */}
      <div className="space-y-6">
        <ReleaseForm onSuccess={fetchHistory} />
      </div>

      {/* Colonne Historique */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-ink">Historique des lâchers</h3>
            <p className="mt-2 text-slate-500">Suivi des opérations récentes</p>
          </div>
          <button 
            onClick={fetchHistory}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Actualiser
          </button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-4 pr-4">Date</th>
                <th className="pb-4 pr-4 text-right">Volume (m³)</th>
                <th className="pb-4 pr-4">Responsable</th>
                <th className="pb-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Chargement des données...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Aucun lâcher enregistré
                  </td>
                </tr>
              ) : (
                history.map((row, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4 text-sm font-medium text-ink">
                      {new Date(row.date_lacher).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="font-display text-sm text-ink">
                        {Number(row.volume).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-600">
                      {row.nom_responsable || "N/A"}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(row.statut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
