import React, { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart,
} from "recharts";
import {
  AlertTriangle,
  ClipboardList,
  RefreshCw,
  Waves,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* ─── helpers ──────────────────────────────────────────── */
function fmtVol(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}
function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
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
function truncate(s, n) {
  return s?.length > n ? s.slice(0, n) + "…" : (s ?? "");
}

/* ─── Custom Tooltip ───────────────────────────────────── */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-4 rounded-2xl border-white/10 shadow-glow text-sm">
      <p className="font-bold text-text-primary mb-2 border-b border-white/10 pb-1">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-text-dim text-xs uppercase tracking-wider">{p.name}</span>
            </div>
            <span className="font-mono font-bold text-text-primary" style={{ color: p.color }}>
              {fmtVol(p.value)} m³
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Premium Gauge ────────────────────────────────────── */
function PremiumGauge({ value }) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  const r = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  
  return (
    <div className="relative flex items-center justify-center group" style={{ width: 160, height: 160 }}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500" />
      
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90 drop-shadow-glow">
        <circle
          cx="80" cy="80" r={r}
          strokeWidth="12"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
        />
        <circle
          cx="80" cy="80" r={r}
          strokeWidth="12"
          fill="none"
          stroke="url(#limeGradient)"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-black text-accent tracking-tighter">
          {Math.round(pct)}%
        </span>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">Total</span>
      </div>
    </div>
  );
}

/* ─── KPI Card ─────────────────────────────────────────── */
function KpiCard({ title, value, unit, icon: Icon, trend, colorClass = "accent", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`glass group p-6 rounded-[32px] glass-hover relative overflow-hidden ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-12 w-12 rounded-2xl bg-${colorClass}/10 flex items-center justify-center text-${colorClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-bold text-positive bg-positive/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} /> {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-text-primary tracking-tight">{value}</h3>
            {unit && <span className="text-sm font-medium text-text-muted">{unit}</span>}
          </div>
        </div>
      </div>
      {/* Decorative Gradient */}
      <div className={`absolute -right-4 -bottom-4 h-24 w-24 bg-${colorClass}/5 blur-3xl rounded-full`} />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [data, setData] = useState({
    stats: null,
    combinedHistory: [],
    demandesHistory: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, histRes, altRes, repRes, demRes] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get("/dashboard/history"),
        api.get("/alerts/recent"),
        api.get("/repartitions/v/detail"),
        api.get("/demandes/"),
      ]);

      // 1. Stats
      const stats = ovRes.data;

      // 2. Combine history and repartitions
      const combinedByDate = {};
      
      // Add releases
      (histRes.data ?? []).forEach(h => {
        const d = fmtDate(h.date_lacher);
        if (!combinedByDate[d]) combinedByDate[d] = { date: d, releases: 0, coops: 0 };
        combinedByDate[d].releases += h.volume_m3;
      });

      // Add cooperatve repartitions
      (repRes.data ?? []).forEach(r => {
        const d = fmtDate(r.date_lacher);
        if (!combinedByDate[d]) combinedByDate[d] = { date: d, releases: 0, coops: 0 };
        combinedByDate[d].coops += r.volume_attribue_m3;
      });

      const combinedHistory = Object.values(combinedByDate).slice(-10);

      // 3. Demandes history
      const demandsByDate = {};
      (demRes.data ?? []).forEach(d => {
        const date = fmtDate(d.date_demande);
        if (!demandsByDate[date]) demandsByDate[date] = { date, volume: 0 };
        demandsByDate[date].volume += d.volume_demande;
      });
      const demandesHistory = Object.values(demandsByDate).slice(-10);

      setData({
        stats,
        combinedHistory,
        demandesHistory,
        alerts: (altRes.data ?? []).slice(0, 5),
      });
      setLastUpdated(Date.now());
    } catch (err) {
      console.error("Dashboard data load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading && !data.stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-text-muted animate-pulse font-medium tracking-widest text-xs uppercase">Initialisation du centre de contrôle...</p>
      </div>
    );
  }

  const stats = data.stats;
  const pct = stats?.pourcentage_remplissage ?? 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent">Mode Live</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold text-text-primary tracking-tight">Tableau de Bord</h2>
          <p className="text-text-muted mt-1">Surveillance en temps réel du barrage Ibn Tachfine</p>
        </div>
        <button 
          onClick={fetchAll}
          className="glass glass-hover px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold text-text-dim hover:text-accent group"
        >
          <RefreshCw size={18} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-1 glass p-8 rounded-[32px] flex items-center justify-center">
          <PremiumGauge value={pct} />
        </div>
        
        <KpiCard 
          title="Volume Actuel"
          value={fmtVol(stats?.niveau_actuel)}
          unit="m³"
          icon={Droplets}
          trend="+1.2%"
          colorClass="accent"
        />

        <KpiCard 
          title="Alertes Actives"
          value={stats?.nb_alertes_critiques ?? 0}
          icon={AlertTriangle}
          colorClass={ (stats?.nb_alertes_critiques ?? 0) > 0 ? "danger" : "positive" }
          onClick={() => navigate("/alerts")}
        />

        <KpiCard 
          title="Demandes"
          value={stats?.nb_demandes_en_attente ?? 0}
          unit="en attente"
          icon={ClipboardList}
          colorClass="warning"
          onClick={() => navigate("/demandes")}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Combined Chart */}
        <div className="glass p-8 rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight">Activité & Coopératives</h3>
              <p className="text-sm text-text-muted">Volumes libérés vs Affectations coopératives</p>
            </div>
            <div className="h-10 w-10 glass rounded-xl flex items-center justify-center text-accent">
              <Activity size={20} />
            </div>
          </div>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.combinedHistory}>
                <defs>
                  <linearGradient id="colorRel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  hide 
                />
                <Tooltip content={<GlassTooltip />} />
                <Area 
                  name="Lâchers"
                  type="monotone" 
                  dataKey="releases" 
                  stroke="#84cc16" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRel)" 
                />
                <Line 
                  name="Coopératives"
                  type="monotone" 
                  dataKey="coops" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 4, strokeWidth: 2, stroke: "#060606" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests Chart */}
        <div className="glass p-8 rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight">Demandes d'Irrigation</h3>
              <p className="text-sm text-text-muted">Évolution des volumes demandés</p>
            </div>
            <div className="h-10 w-10 glass rounded-xl flex items-center justify-center text-warning">
              <ClipboardList size={20} />
            </div>
          </div>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.demandesHistory}>
                <defs>
                  <linearGradient id="colorDem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<GlassTooltip />} />
                <Area 
                  name="Volume"
                  type="stepAfter" 
                  dataKey="volume" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDem)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table-like list */}
      <div className="glass p-8 rounded-[40px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-text-primary tracking-tight">Incidents de Sécurité</h3>
          <button 
            onClick={() => navigate("/alerts")}
            className="flex items-center gap-2 text-sm font-bold text-accent hover:underline decoration-2 underline-offset-4"
          >
            Tout voir <ArrowRight size={16} />
          </button>
        </div>
        
        {data.alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white/5 rounded-3xl border border-white/5">
            <CheckCircle2 size={48} className="text-positive/30" />
            <p className="text-positive font-bold uppercase tracking-widest text-xs">Système Opérationnel</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.alerts.map((a, i) => (
              <div 
                key={a.id_alerte} 
                className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center ${
                  a.type === 'niveau_critique' ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary mb-0.5 truncate">{a.message}</p>
                  <p className="text-xs text-text-muted flex items-center gap-2">
                    <Clock size={12} /> {relativeTime(a.date_)}
                  </p>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-dim">
                  {a.type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
