import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Droplets } from "lucide-react";
import api from "../api/axios";
import AlertBanner from "../components/AlertBanner";
import Gauges from "../components/Gauges";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await api.get("/dashboard/overview");
        setStats(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session invalide. Reconnectez-vous pour voir les donnees du barrage.");
        } else {
          setError("Impossible de charger les donnees du barrage.");
        }
        console.error(err);
      }
    }

    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="p-10 text-blue-600">Initialisation du systeme SIBD...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <AlertBanner />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Tableau de Bord - Barrage Flow Manager
        </h1>
        <p className="text-slate-500">Donnees en temps reel de la base de donnees</p>
      </header>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Droplets />
          </div>
          <div>
            <p className="text-sm text-slate-500">Volume Actuel</p>
            <p className="text-xl font-bold">{stats.niveau_actuel.toLocaleString()} m3</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-red-100 p-3 text-red-600">
            <AlertCircle />
          </div>
          <div>
            <p className="text-sm text-slate-500">Alertes Actives</p>
            <p className="text-xl font-bold">{stats.nb_alertes_critiques}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="rounded-lg bg-green-100 p-3 text-green-600">
            <Calendar />
          </div>
          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md">
        <Gauges
          value={stats.pourcentage_remplissage}
          title="Taux de Remplissage Global"
        />
      </div>
    </div>
  );
}
