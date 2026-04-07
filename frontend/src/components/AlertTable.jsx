import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { AlertCircle, Clock, Info, CheckCircle2, Loader2 } from "lucide-react";

export default function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const { data } = await api.get("/alerts/recent");
        // Only show the 5 most recent alerts as requested
        setAlerts(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch recent alerts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentAlerts();
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case "niveau_critique":
        return <AlertCircle className="text-danger" size={18} />;
      case "niveau_bas":
        return <Info className="text-warning" size={18} />;
      case "securite":
        return <CheckCircle2 className="text-positive" size={18} />;
      default:
        return <Clock className="text-text-muted" size={18} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-[32px] border-white/5 relative group transition-all duration-500">
      <div className="absolute -right-16 -top-16 h-32 w-32 bg-accent/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-all duration-700" />

      <div className="px-8 py-6 border-b border-white/5 relative z-10 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-text-primary tracking-tight uppercase">Incidents récents</h3>
        <div className="flex h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted bg-white/[0.02]">
              <th className="px-8 py-5">Catégorie</th>
              <th className="px-8 py-5">Observation Technique</th>
              <th className="px-8 py-5 text-right">Chronologie</th>
            </tr>
          </thead>
          <tbody className="">
            {alerts.length > 0 ? (
              alerts.map((alert, i) => (
                <tr
                  key={alert.id_alerte}
                  className="group/row hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0"
                >
                  <td className="whitespace-nowrap px-8 py-5">
                    <div className="flex items-center gap-3 font-bold text-text-primary text-xs uppercase tracking-widest">
                      <div className="group-hover/row:scale-110 transition-transform">
                        {getAlertIcon(alert.type)}
                      </div>
                      {alert.type?.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-text-dim max-w-md">
                    {alert.message}
                  </td>
                  <td className="whitespace-nowrap px-8 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-text-primary">
                        {new Date(alert.date_).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-[10px] font-medium text-text-muted mt-0.5">
                        {new Date(alert.date_).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <CheckCircle2 size={40} className="text-positive" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Système Nominal • Aucun Incident</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
