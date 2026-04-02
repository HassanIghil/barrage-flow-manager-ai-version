import React, { useState } from "react";
import api from "../api/axios";

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
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="font-display text-2xl text-ink">Nouveau lâcher d'eau</h3>
      <p className="mt-2 text-slate-500">Saisie des paramètres opérationnels</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Barrage</label>
          <select
            name="id_barrage"
            value={formData.id_barrage}
            onChange={handleChange}
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-ink focus:border-lagoon focus:ring-lagoon"
          >
            <option value={1}>Youssef Ibn Tachfine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Volume (m³)</label>
          <input
            type="number"
            name="volume_m3"
            value={formData.volume_m3}
            onChange={handleChange}
            placeholder="Ex: 50000"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-ink focus:border-lagoon focus:ring-lagoon"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Motif (Optionnel)</label>
          <textarea
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            rows={3}
            placeholder="Précisez la raison du lâcher..."
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-ink focus:border-lagoon focus:ring-lagoon"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-lagoon py-4 font-semibold text-white transition-all hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Confirmer le lâcher"}
        </button>
      </form>
    </div>
  );
}
