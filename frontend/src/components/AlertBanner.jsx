import React, { useState, useEffect } from "react";
import { AlertTriangle, X, ChevronRight, Bell } from "lucide-react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/alerts/recent");
      const latestFive = response.data.slice(0, 5);
      setAlerts(latestFive);
    } catch (err) {
      console.error("Erreur alertes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const hasCritical = alerts.some((alert) => alert.type_alerte === "niveau_critique");

  if (!isVisible || loading || alerts.length === 0 || !hasCritical) return null;

  return (
    <div
      className={`mb-8 animate-in fade-in slide-in-from-top duration-700 rounded-[24px] border p-5 shadow-sm transition-all ${
        hasCritical
          ? "border-ember/30 bg-ember/5 text-ember"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      <div className="flex items-start gap-5">
        <div
          className={`shrink-0 rounded-2xl p-3 ${
            hasCritical ? "bg-ember text-white animate-pulse" : "bg-amber-500 text-white"
          }`}
        >
          {hasCritical ? <AlertTriangle size={22} /> : <Bell size={22} />}
        </div>

        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-sm font-black uppercase tracking-[0.15em]">
              {hasCritical ? "Alertes Systeme Critiques" : "Flux d'alertes recentes"}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                hasCritical ? "bg-ember text-white" : "bg-amber-200 text-amber-900"
              }`}
            >
              {alerts.length} Messages
            </span>
          </div>

          <div className="grid gap-2">
            {alerts.map((alert) => (
              <div
                key={alert.id_alerte}
                className={`flex items-center gap-3 rounded-xl p-2 text-sm font-medium transition-colors ${
                  alert.type_alerte === "niveau_critique" ? "bg-ember/10" : "hover:bg-black/5"
                }`}
              >
                <span className="shrink-0 font-mono text-xs opacity-50">
                  {new Date(alert.date_alerte).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <p className="line-clamp-1">{alert.message}</p>
                {alert.type_alerte === "niveau_critique" && (
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-ember animate-ping"></span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-current/10 pt-3">
            <Link
              to="/alerts"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase hover:underline"
            >
              Gerer toutes les alertes dans l'historique <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 rounded-xl p-2 transition hover:bg-black/10"
        >
          <X size={20} className="opacity-50" />
        </button>
      </div>
    </div>
  );
}
