import React from "react";
import { AlertTriangle, Bell, Clock, Database } from "lucide-react";

export default function AlertTable({ alerts, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-lagoon mb-4"></div>
        <p className="text-sm font-medium">Récupération des logs système...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-[24px]">
        <Database size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">Aucune alerte enregistrée dans la base SIBD.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-slate-400">
            <th className="px-6 pb-2 font-black">Statut</th>
            <th className="px-6 pb-2 font-black">Message d'alerte</th>
            <th className="px-6 pb-2 font-black text-right">Horodatage</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const isCritical = alert.type_alerte === "niveau_critique";
            
            return (
              <tr 
                key={alert.id_alerte} 
                className="group transition-all hover:translate-x-1"
              >
                {/* Badge de Type */}
                <td className="bg-white px-6 py-4 rounded-l-[20px] border-y border-l border-slate-100">
                  <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-tight ${
                    isCritical 
                      ? "bg-ember/10 text-ember ring-1 ring-ember/20" 
                      : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  }`}>
                    {isCritical ? <AlertTriangle size={12} /> : <Bell size={12} />}
                    {isCritical ? "Critique" : "Avertissement"}
                  </div>
                </td>

                {/* Message */}
                <td className="bg-white px-6 py-4 border-y border-slate-100">
                  <p className={`text-sm font-semibold ${isCritical ? "text-ink" : "text-slate-600"}`}>
                    {alert.message}
                  </p>
                </td>

                {/* Date et Heure */}
                <td className="bg-white px-6 py-4 rounded-r-[20px] border-y border-r border-slate-100 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-mono">
                      {new Date(alert.date_alerte).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}