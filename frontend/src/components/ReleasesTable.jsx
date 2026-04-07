import React, { useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle2,
  Loader2,
  Waves,
  AlertTriangle,
  X,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── Status config ───────────────────────────────────── */
const STATUS_CONFIG = {
  termine: {
    label: "Exécuté",
    className: "bg-positive/10 text-positive border border-positive/20",
  },
  planifie: {
    label: "Planifié",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  en_cours: {
    label: "En cours",
    className: "bg-accent/10 text-accent border border-accent/20",
  },
  annule: {
    label: "Annulé",
    className: "bg-white/5 text-text-muted border border-white/5",
  },
};

const FILTER_TABS = [
  { id: "all", label: "Tous" },
  { id: "planifie", label: "Planifiés" },
  { id: "termine", label: "Exécutés" },
  { id: "annule", label: "Annulés" },
];

const PAGE_SIZE = 15;

/* ─── sub-components ──────────────────────────────────── */
function StatusBadge({ statut }) {
  const cfg = STATUS_CONFIG[statut] ?? {
    label: statut,
    className: "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-600/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function ConfirmModal({ release, actionType, onConfirm, onCancel, loading }) {
  const isCancel = actionType === "cancel";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl animate-fadeIn">
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />

      <div className="w-full max-w-lg glass p-10 rounded-[48px] border-white/10 relative overflow-hidden animate-slideIn shadow-glow-lg">
        <div className={`absolute -top-32 -right-32 h-64 w-64 ${isCancel ? "bg-danger/20" : "bg-accent/20"} blur-[100px] rounded-full`} />

        <button
          onClick={onCancel}
          className="absolute top-8 right-8 h-10 w-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition backdrop-blur-xl"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-10">
          <div className={`inline-flex h-12 w-12 ${isCancel ? "bg-danger/10 text-danger" : "bg-accent/10 text-accent"} rounded-2xl items-center justify-center mb-4`}>
            {isCancel ? <Ban size={24} /> : <AlertTriangle size={24} />}
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
            {isCancel ? "Annulation" : "Confirmation"}
          </h3>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
            {isCancel ? "Révision de l'ordre opérationnel" : "Validation de l'opération"}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted opacity-50">Volume à libérer</p>
            <h4 className="text-4xl font-black text-white tracking-tight">
              {Number(release.volume_m3 ?? release.volume).toLocaleString("fr-FR")} <span className="text-lg text-accent">m³</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-text-muted opacity-50">Ordre Numéro</p>
              <p className="text-sm font-bold text-white">#00{release.id_lacher ?? release.id}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-text-muted opacity-50">Responsable</p>
              <p className="text-sm font-bold text-white">{release.nom_utilisateur ?? "Système"}</p>
            </div>
          </div>
        </div>

        <p className="mt-8 px-4 text-xs text-center text-text-muted font-medium leading-relaxed">
          {isCancel 
            ? "Cette action annulera définitivement l'ordre de lâcher programmé. L'incident sera enregistré dans le journal d'audit."
            : "L'exécution de cet ordre déclenchera l'ouverture des vannes. Assurez-vous que toutes les conditions de sécurité sont réunies."}
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-16 rounded-2xl glass glass-hover text-white font-black uppercase tracking-widest text-xs transition active:scale-95 disabled:opacity-50"
          >
            Retour
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-[2] h-16 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition active:scale-95 shadow-glow disabled:opacity-50 ${
              isCancel ? "bg-danger text-white hover:bg-red-600" : "bg-accent text-black hover:bg-accent-light"
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isCancel ? <Ban size={18} /> : <Waves size={18} />)}
            {loading ? "Chargement..." : (isCancel ? "Confirmer l'Annulation" : "Exécuter l'Ordre")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── main ────────────────────────────────────────────── */
export default function ReleaseTable({ data, loading, onRefresh }) {
  const { role } = useAuth();
  const isDirecteur =
    role?.toLowerCase() === "directeur" || role?.toLowerCase() === "admin";

  const [executing, setExecuting] = useState(null);
  const [confirm, setConfirm] = useState(null); // { row, actionType }
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);

  /* filter + paginate */
  const filtered = useMemo(() => {
    const base = activeFilter === "all" ? data : (data || []).filter((r) => {
      const statut = r.status ?? r.statut;
      return statut === activeFilter;
    });
    return base || [];
  }, [data, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setPage(1);
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    const { row, actionType } = confirm;
    const id = row.id_lacher ?? row.id;
    setExecuting(id + actionType);

    try {
      if (actionType === "execute") {
        await api.put(`/releases/${id}/execute`);
        toast.success(`Lâcher #${id} exécuté avec succès.`);
      } else {
        await api.put(`/releases/${id}/cancel`);
        toast(`Lâcher #${id} annulé.`, { icon: "⚠️" });
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail ?? "Une erreur est survenue.";
      toast.error(detail);
    } finally {
      setExecuting(null);
      setConfirm(null);
    }
  };

  const canExecute = (row) => {
    const statut = row.status ?? row.statut;
    return isDirecteur && (statut === "planifie" || statut === "en_cours");
  };
  const canCancel = (row) => {
    const statut = row.status ?? row.statut;
    return isDirecteur && (statut === "planifie" || statut === "en_cours");
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
              activeFilter === tab.id
                ? "bg-accent text-black shadow-glow"
                : "glass text-text-muted hover:text-text-primary glass-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
              <th className="px-6 pb-4">Chronologie</th>
              <th className="px-6 pb-4">Infrastructure</th>
              <th className="px-6 pb-4 text-right">Volume</th>
              <th className="px-6 pb-4">Opérateur</th>
              <th className="px-6 pb-4">État</th>
              {isDirecteur && <th className="px-6 pb-4 text-right">Contrôle</th>}
            </tr>
          </thead>
          <tbody className="">
            {loading ? (
              <tr>
                <td colSpan={isDirecteur ? 6 : 5} className="py-10 text-center text-slate-400">
                  <Loader2 size={20} className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={isDirecteur ? 6 : 5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Waves size={28} className="text-slate-200" />
                    <p className="text-sm text-slate-400">Aucun lâcher enregistré</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => {
                const id = row.id_lacher ?? row.id ?? idx;
                const volume = row.volume_m3 ?? row.volume;
                const statut = row.status ?? row.statut;
                const responsable = row.nom_utilisateur ?? row.nom_responsable ?? "—";
                const dateStr = row.date_lacher;
                const isActive = executing === id + "execute" || executing === id + "cancel";

                return (
                  <tr key={id} className="group transition-all duration-300 relative">
                    <td className="px-6 py-5 rounded-l-2xl bg-white/[0.02] border-y border-l border-white/5 text-sm font-bold text-text-primary">
                      <div className="flex flex-col">
                        <span className="text-white">
                          {dateStr ? new Date(dateStr).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' }) : "—"}
                        </span>
                        <span className="text-[10px] text-text-muted font-medium mt-1">
                          {dateStr ? new Date(dateStr).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/[0.02] border-y border-white/5 text-sm font-semibold text-text-dim">
                      {row.nom_barrage ?? "Youssef Ibn Tachfine"}
                    </td>
                    <td className="px-6 py-5 bg-white/[0.02] border-y border-white/5 text-right">
                      <span className="font-display text-lg font-black text-white">
                        {volume != null ? Number(volume).toLocaleString("fr-FR") : "—"}
                      </span>
                      <span className="ml-1 text-[10px] text-accent font-bold">m³</span>
                    </td>
                    <td className="px-6 py-5 bg-white/[0.02] border-y border-white/5 text-sm font-medium text-text-dim">{responsable}</td>
                    <td className="px-6 py-5 bg-white/[0.02] border-y border-white/5"><StatusBadge statut={statut} /></td>
                    {isDirecteur && (
                      <td className="px-6 py-5 rounded-r-2xl bg-white/[0.02] border-y border-r border-white/5 text-right">
                        {statut === "termine" ? (
                          <div className="flex items-center justify-end gap-2 text-positive">
                             <div className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Validé</span>
                          </div>
                        ) : statut === "annule" ? (
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/30">Archives</span>
                        ) : canExecute(row) ? (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setConfirm({ row, actionType: "execute" })}
                              disabled={isActive}
                              className="h-10 px-4 rounded-xl bg-accent text-black text-[10px] font-black uppercase tracking-widest shadow-panel hover:bg-accent-light hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                              {executing === id + "execute"
                                ? <Loader2 size={12} className="animate-spin" />
                                : <Waves size={12} />}
                              Actionner
                            </button>
                            {canCancel(row) && (
                              <button
                                onClick={() => setConfirm({ row, actionType: "cancel" })}
                                disabled={isActive}
                                className="h-10 px-4 rounded-xl glass text-danger text-[10px] font-black uppercase tracking-widest hover:bg-danger/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                              >
                                <X size={12} />
                                Révoquer
                              </button>
                            )}
                          </div>
                        ) : null}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            ← Précédent
          </button>
          <span className="text-xs text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          release={confirm.row}
          actionType={confirm.actionType}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          loading={executing !== null}
        />
      )}
    </>
  );
}