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
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Detail */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent">Contrôle des Lâchers</span>
        </div>
        <h2 className="font-display text-4xl font-extrabold text-text-primary tracking-tight">Gestion des Débits</h2>
        <p className="text-text-muted">Planification et suivi des opérations hydrauliques en temps réel.</p>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_2.8fr]">
        {/* Colonne Formulaire */}
        <div className="space-y-6">
          <ReleaseForm onSuccess={fetchHistory} />
        </div>

        {/* Colonne Historique */}
        <div className="glass p-8 rounded-[40px] flex flex-col relative overflow-hidden group">
          <div className="absolute -right-24 -top-24 h-48 w-48 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-all duration-700" />
          
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight">
                Historique des Lâchers
              </h3>
              <p className="mt-1 text-sm text-text-muted font-medium">Suivi exhaustif des opérations récentes</p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="glass glass-hover px-5 py-2.5 rounded-2xl flex items-center gap-3 text-sm font-bold text-text-dim hover:text-accent transition-all group/btn"
            >
              <div className={loading ? "animate-spin" : "group-hover/btn:rotate-180 transition-transform duration-500"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </div>
              <span>Actualiser</span>
            </button>
          </div>

          <div className="relative z-10 flex-1">
            <ReleaseTable
              data={history}
              loading={loading}
              onRefresh={fetchHistory}
            />
          </div>
        </div>
      </section>
    </div>
  );
}