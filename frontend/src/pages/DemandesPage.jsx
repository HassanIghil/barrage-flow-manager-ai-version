import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Droplets,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* ─── status config ───────────────────────────────────── */
const STATUS_CONFIG = {
  en_attente: { label: "En attente", cls: "bg-warning/20 text-warning border-warning/30" },
  approuvee: { label: "Approuvée", cls: "bg-positive/20 text-positive border-positive/30" },
  refusee: { label: "Refusée", cls: "bg-danger/20 text-danger border-danger/30" },
  en_cours: { label: "En cours", cls: "bg-accent/20 text-accent border-accent/30" },
  terminee: { label: "Terminée", cls: "bg-white/10 text-text-dim border-white/10" },
};

const FILTER_TABS = [
  { id: "all", label: "Toutes" },
  { id: "en_attente", label: "En attente" },
  { id: "approuvee", label: "Approuvées" },
  { id: "refusee", label: "Refusées" },
];

/* ─── helpers ─────────────────────────────────────────── */
function fmtVol(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }
function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ statut }) {
  const cfg = STATUS_CONFIG[statut] ?? { label: statut, cls: "bg-white/10 text-text-dim border-white/10" };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

/* ─── New Demande Modal ───────────────────────────────── */
function NewDemandeModal({ onClose, onSuccess }) {
  const [coops, setCoops] = useState([]);
  const [form, setForm] = useState({ volume_demande: "", id_coop: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/cooperatives/").then((r) => setCoops(r.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.volume_demande || Number(form.volume_demande) <= 0) {
      toast.error("Le volume doit être supérieur à 0.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/demandes/", {
        volume_demande: Number(form.volume_demande),
        id_coop: Number(form.id_coop),
      });
      toast.success("Demande transmise avec succès.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass p-8 rounded-[40px] shadow-glow-lg border-white/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-accent/10 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight">Nouvelle Demande</h3>
          <button onClick={onClose} className="rounded-full p-2 text-text-muted hover:bg-white/10 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Coopérative cible</label>
            <select
              value={form.id_coop}
              onChange={(e) => setForm((f) => ({ ...f, id_coop: e.target.value }))}
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/5 px-4 text-sm text-text-primary focus:border-accent/40 focus:outline-none transition-colors appearance-none"
              required
            >
              <option value="" className="bg-bg-primary">Choisir une coopérative…</option>
              {coops.map((c) => (
                <option key={c.id_coop} value={c.id_coop} className="bg-bg-primary">{c.nom}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Volume d'eau (m³)</label>
            <input
              type="number"
              value={form.volume_demande}
              onChange={(e) => setForm((f) => ({ ...f, volume_demande: e.target.value }))}
              placeholder="Ex: 50 000"
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/5 px-4 text-sm text-text-primary focus:border-accent/40 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-2xl bg-accent text-black font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-accent-light active:scale-[0.98] transition-all disabled:opacity-50 shadow-glow"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <TrendingUp size={20} />}
            {submitting ? "Traitement..." : "Confirmer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DemandesPage() {
  const { role } = useAuth();
  const isPrivileged = role?.toLowerCase() === "directeur" || role?.toLowerCase() === "admin";
  const canCreate = ["directeur", "admin", "agriculteur"].includes(role?.toLowerCase());

  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/demandes/");
      setDemandes(data || []);
    } catch (err) {
      toast.error("Échec du chargement des demandes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDemandes(); }, [fetchDemandes]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return demandes;
    return demandes.filter((d) => d.statut === activeFilter);
  }, [demandes, activeFilter]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-text-primary tracking-tight">Demandes d'Irrigation</h2>
          <p className="text-text-muted mt-1">Gestion et arbitrage des distributions d'eau</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="h-14 px-8 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-accent-light transition-all shadow-glow"
          >
            <Plus size={18} /> Nouvelle Demande
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeFilter === tab.id
                ? "bg-accent text-black shadow-glow"
                : "glass glass-hover text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List / Table */}
      <div className="glass rounded-[40px] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-accent" />
            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">Synchronisation des demandes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <ClipboardList size={64} className="text-white/5" />
            <p className="text-text-muted font-bold text-sm tracking-widest uppercase">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Coopérative</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted text-right">Volume</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Statut</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filtered.map((d, i) => (
                  <tr key={d.id_demande} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-text-primary">{fmtDate(d.date_demande)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          <Droplets size={14} />
                        </div>
                        <span className="text-sm font-bold text-text-primary uppercase tracking-tight">{d.nom_coop}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-accent">{fmtVol(d.volume_demande)} m³</td>
                    <td className="px-8 py-6"><StatusBadge statut={d.statut} /></td>
                    <td className="px-8 py-6 text-right">
                      <button className="h-10 w-10 glass rounded-xl inline-flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <NewDemandeModal onClose={() => setShowModal(false)} onSuccess={fetchDemandes} />
      )}
    </div>
  );
}
