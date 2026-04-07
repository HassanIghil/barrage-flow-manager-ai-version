import React, { useEffect, useState, useMemo } from "react";
import {
  AlertOctagon,
  TrendingDown,
  Wrench,
  Info,
  CheckCircle2,
  Zap,
} from "lucide-react";
import api from "../api/axios";

/* ─── config par type ─────────────────────────────────── */
const TYPE_CONFIG = {
  niveau_critique: {
    color: "#ef4444", // danger
    bg: "bg-danger/20",
    text: "text-danger",
    border: "bg-danger",
    label: "Niveau critique",
    icon: AlertOctagon,
  },
  seuil_bas: {
    color: "#f59e0b", // warning
    bg: "bg-warning/20",
    text: "text-warning",
    border: "bg-warning",
    label: "Seuil bas",
    icon: TrendingDown,
  },
  maintenance: {
    color: "#a855f7", // purple-500
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "bg-purple-500",
    label: "Maintenance",
    icon: Wrench,
  },
  systeme: {
    color: "#71717a", // text-muted
    bg: "bg-white/5",
    text: "text-dim",
    border: "bg-white/10",
    label: "Système",
    icon: Info,
  },
  inondation_risque: {
    color: "#f97316", // orange-500
    bg: "bg-orange-500/20",
    text: "text-orange-500",
    border: "bg-orange-500",
    label: "Risque inondation",
    icon: Zap,
  },
};

const FILTER_TABS = [
  { id: "all", label: "Toutes" },
  { id: "niveau_critique", label: "Critiques" },
  { id: "seuil_bas", label: "Seuil bas" },
  { id: "maintenance", label: "Maintenance" },
  { id: "systeme", label: "Système" },
];

/* ─── helpers ─────────────────────────────────────────── */
function fmtDateFull(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function relativeTime(str) {
  if (!str) return "—";
  const diff = Math.floor((Date.now() - new Date(str).getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

/* ─── sub-components ──────────────────────────────────── */
function StatPill({ label, value, className = "" }) {
  return (
    <div className={`flex items-center gap-2 rounded-full border border-border-dark bg-bg-card px-4 py-2 text-sm font-medium ${className}`}>
      <span className="font-bold">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function SkeletonAlertCard() {
  return (
    <div className="flex h-24 gap-4 rounded-[20px] bg-border-dark/30 animate-pulse" />
  );
}

function AlertCard({ alert, index }) {
  const cfg = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.systeme;
  const Icon = cfg.icon;

  return (
    <div
      className="animate-fadeIn relative flex items-start gap-4 overflow-hidden rounded-[24px] glass glass-hover p-6 pl-5 transition duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Accent bar gauche */}
      <div className={`absolute inset-y-0 left-0 w-1 rounded-l-[20px] ${cfg.border}`} />

      {/* Icône */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
        <Icon size={18} style={{ color: cfg.color }} />
      </div>

      {/* Corps */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <span className={`text-xs uppercase tracking-wide font-semibold ${cfg.text}`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{relativeTime(alert.date_)}</span>
            {alert.id_barrage && (
              <>
                <span>·</span>
                <span>Barrage YIT</span>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-text-dim leading-relaxed line-clamp-3">
          {alert.message}
        </p>
      </div>
    </div>
  );
}

/* ─── main ────────────────────────────────────────────── */
export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/alerts/recent");
      setAlerts(data || []);
    } catch {
      setError("Impossible de charger les alertes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return alerts;
    return alerts.filter((a) => a.type === activeFilter);
  }, [alerts, activeFilter]);

  const critiques = useMemo(
    () => alerts.filter((a) => a.type === "niveau_critique").length,
    [alerts]
  );
  const lastAlert = alerts[0];

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-bold text-text-primary">Alertes & Incidents</h2>
        <p className="text-text-muted">Surveillance en temps réel du barrage</p>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3">
        <StatPill
          value={alerts.length}
          label="alertes totales"
          className="text-text-dim"
        />
        {critiques > 0 ? (
          <div className="flex items-center gap-2 rounded-full border border-border-dark bg-bg-card px-4 py-2 text-sm font-medium animate-pulse text-danger">
            <span className="font-bold">{critiques}</span>
            <span>critiques</span>
          </div>
        ) : (
          <StatPill
            value="0"
            label="critiques"
            className="text-positive"
          />
        )}
        {lastAlert && (
          <StatPill
            value={fmtDateFull(lastAlert.date_)}
            label=""
            className="text-text-muted font-normal"
          />
        )}
      </div>

      {/* Filter tabs */}
      <div className="mt-6 mb-4 inline-flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-2xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
              activeFilter === tab.id
                ? "bg-accent text-black shadow-glow"
                : "glass glass-hover text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => <SkeletonAlertCard key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-bg-card border border-border-dark rounded-[24px]">
          <AlertOctagon size={40} className="text-danger" />
          <p className="text-danger font-semibold">{error}</p>
          <button
            onClick={fetchAlerts}
            className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-light transition"
          >
            Réessayer
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CheckCircle2 size={48} className="text-positive/40" />
          <p className="font-display text-lg font-bold text-text-primary">Aucune alerte</p>
          <p className="text-sm text-text-muted">Le système fonctionne normalement.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((alert, i) => (
            <AlertCard key={alert.id_alerte} alert={alert} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
