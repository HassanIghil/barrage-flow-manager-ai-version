import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Gauges from '../components/Gauges';
import { Droplets, AlertCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Remplace par ton URL si différente
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard/overview');
        setStats(response.data);
      } catch (err) {
        setError("Impossible de charger les données du barrage.");
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!stats) return <div className="p-10 text-blue-600">Initialisation du système SIBD...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Tableau de Bord - Barrage Flow Manager</h1>
        <p className="text-slate-500">Données en temps réel de la base de données</p>
      </header>

      {/* GRILLE DE STATS (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Droplets /></div>
          <div>
            <p className="text-sm text-slate-500">Volume Actuel</p>
            <p className="text-xl font-bold">{stats.niveau_actuel.toLocaleString()} m³</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertCircle /></div>
          <div>
            <p className="text-sm text-slate-500">Alertes Actives</p>
            <p className="text-xl font-bold">{stats.nb_alertes_critiques}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600"><Calendar /></div>
          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* SECTION JAUGE */}
      <div className="max-w-md mx-auto">
        <Gauges 
          value={stats.pourcentage_remplissage} 
          title="Taux de Remplissage Global" 
        />
      </div>
    </div>
  );
};

export default Dashboard;