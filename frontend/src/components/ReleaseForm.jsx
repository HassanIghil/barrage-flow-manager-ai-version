import React, { useState } from "react";
import api from "../api/axios";
import { Waves, Droplets, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";

export default function ReleaseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    volume_m3: "",
    id_barrage: 1, // Default to 1 (Youssef Ibn Tachfine)
    motif: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "id_barrage" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    const vol = parseFloat(formData.volume_m3);
    if (isNaN(vol) || vol <= 0) {
      setError("Le volume doit être supérieur à 0 m³.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/releases/", {
        ...formData,
        volume_m3: vol,
      });
      setFormData({ volume_m3: "", id_barrage: 1, motif: "" });
      if (onSuccess) onSuccess();
      alert("Lâcher d'eau enregistré avec succès !");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[40px] relative overflow-hidden group border-white/5 shadow-glow-lg transition-all duration-500">
      <div className="absolute -left-16 -top-16 h-32 w-32 bg-accent/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight">Nouveau Lâcher</h3>
        <p className="mt-1 text-sm text-text-muted font-medium">Saisie des paramètres opérationnels</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">
            <Droplets size={12} className="text-accent" /> Barrage Cible
          </label>
          <select
            name="id_barrage"
            value={formData.id_barrage}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value={1} className="bg-bg-sidebar">Youssef Ibn Tachfine</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">
            <Waves size={12} className="text-accent" /> Volume de Sortie (m³)
          </label>
          <input
            type="number"
            name="volume_m3"
            value={formData.volume_m3}
            onChange={handleChange}
            placeholder="Ex: 50000"
            className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/10"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">
            <MessageSquare size={12} className="text-accent" /> Justification / Motif
          </label>
          <textarea
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            rows={3}
            placeholder="Précisez la raison opérationnelle..."
            className="w-full rounded-2xl bg-white/5 border border-white/5 px-6 py-4 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/10 resize-none"
          />
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-[10px] font-black uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-light hover:shadow-glow transition-all disabled:opacity-50 active:scale-95 shadow-panel"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
          {loading ? "Traitement..." : "Confirmer l'Ordre"}
        </button>
      </form>
    </div>
  );
}
