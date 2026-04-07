import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { AlertTriangle, X } from "lucide-react";

export default function AlertBanner() {
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchCriticalAlerts = async () => {
      try {
        const { data } = await api.get("/alerts/critical");
        // We only care about the most recent one for the banner
        setCriticalAlerts(data);
      } catch (err) {
        console.error("Failed to fetch critical alerts:", err);
      }
    };

    fetchCriticalAlerts();
    // Refresh every 30 seconds for real-time monitoring
    const interval = setInterval(fetchCriticalAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!visible || criticalAlerts.length === 0) return null;

  const latestAlert = criticalAlerts[0];

  return (
    <div className="relative mb-8 animate-fadeIn overflow-hidden">
      <div className="flex items-center justify-between rounded-[32px] bg-danger/10 p-6 border border-danger/20 shadow-glow-lg backdrop-blur-xl relative group">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-danger/5 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-danger animate-pulse">Alerte Critique</span>
              <span className="text-[10px] text-text-muted opacity-50">•</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                {new Date(latestAlert.date_).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h4 className="font-display text-lg font-black text-white leading-tight uppercase tracking-tight">
              Incident de Sécurité Majeur Detecté
            </h4>
            <p className="mt-1 text-sm font-semibold text-text-dim max-w-2xl">
              {latestAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="relative z-10 h-10 w-10 glass rounded-xl flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-all active:scale-90"
          aria-label="Dismiss alert"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
