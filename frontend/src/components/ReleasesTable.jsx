import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Loader2, Waves, AlertTriangle } from "lucide-react";

const STATUS_CONFIG = {
    termine: {
        label: "Exécuté",
        className:
            "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    },
    planifie: {
        label: "Planifié",
        className:
            "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    },
    en_cours: {
        label: "En cours",
        className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
    },
    annule: {
        label: "Annulé",
        className:
            "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-600/20",
    },
};

function StatusBadge({ statut }) {
    const cfg = STATUS_CONFIG[statut] ?? {
        label: statut,
        className: "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-600/20",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
        >
            {cfg.label}
        </span>
    );
}

function ConfirmModal({ release, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50">
                        <AlertTriangle size={20} className="text-amber-600" />
                    </span>
                    <h3 className="font-display text-xl text-ink">Confirmer l'exécution</h3>
                </div>

                <p className="mt-4 text-slate-600">
                    Vous êtes sur le point de libérer{" "}
                    <span className="font-semibold text-ink">
                        {Number(release.volume_m3 ?? release.volume).toLocaleString("fr-FR")} m³
                    </span>{" "}
                    depuis le barrage. Cette action est irréversible.
                </p>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    <p>
                        <span className="font-medium text-slate-700">Lâcher n°{release.id_lacher ?? release.id}</span>
                    </p>
                    <p className="mt-1">
                        Responsable :{" "}
                        <span className="text-slate-700">
                            {release.nom_utilisateur ?? release.nom_responsable ?? "—"}
                        </span>
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lagoon py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Waves size={16} />
                        )}
                        {loading ? "Exécution…" : "Confirmer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ReleaseTable({ data, loading, onRefresh }) {
    const { role } = useAuth();
    const isDirecteur =
        role?.toLowerCase() === "directeur" || role?.toLowerCase() === "admin";

    const [executing, setExecuting] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const handleExecuteClick = (row) => {
        setConfirm(row);
    };

    const handleConfirm = async () => {
        const id = confirm.id_lacher ?? confirm.id;
        setExecuting(id);
        try {
            await api.put(`/releases/${id}/execute`);
            setFeedback({ type: "success", message: `Lâcher #${id} exécuté avec succès.` });
            if (onRefresh) onRefresh();
        } catch (err) {
            const detail =
                err.response?.data?.detail ?? "Une erreur est survenue.";
            setFeedback({ type: "error", message: detail });
        } finally {
            setExecuting(null);
            setConfirm(null);
            setTimeout(() => setFeedback(null), 4000);
        }
    };

    const canExecute = (row) => {
        const statut = row.status ?? row.statut;
        return isDirecteur && (statut === "planifie" || statut === "en_cours");
    };

    return (
        <>
            {/* Feedback banner */}
            {feedback && (
                <div
                    className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${feedback.type === "success"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                        : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                        }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <AlertTriangle size={16} />
                    )}
                    {feedback.message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <th className="pb-4 pr-4">Date</th>
                            <th className="pb-4 pr-4 text-right">Volume (m³)</th>
                            <th className="pb-4 pr-4">Responsable</th>
                            <th className="pb-4 pr-4">Statut</th>
                            {isDirecteur && <th className="pb-4 text-right">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={isDirecteur ? 5 : 4}
                                    className="py-10 text-center text-slate-400"
                                >
                                    <Loader2 size={20} className="mx-auto animate-spin" />
                                </td>
                            </tr>
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={isDirecteur ? 5 : 4}
                                    className="py-10 text-center text-slate-400"
                                >
                                    Aucun lâcher enregistré
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => {
                                const id = row.id_lacher ?? row.id ?? idx;
                                const volume = row.volume_m3 ?? row.volume;
                                const statut = row.status ?? row.statut;
                                const responsable =
                                    row.nom_utilisateur ?? row.nom_responsable ?? "—";
                                const dateStr = row.date_lacher;
                                const isBeingExecuted = executing === id;

                                return (
                                    <tr
                                        key={id}
                                        className="group transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="py-4 pr-4 text-sm font-medium text-ink">
                                            {dateStr
                                                ? new Date(dateStr).toLocaleString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="py-4 pr-4 text-right">
                                            <span className="font-display text-sm text-ink">
                                                {volume != null
                                                    ? Number(volume).toLocaleString("fr-FR")
                                                    : "—"}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-slate-600">
                                            {responsable}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge statut={statut} />
                                        </td>
                                        {isDirecteur && (
                                            <td className="py-4 text-right">
                                                {canExecute(row) ? (
                                                    <button
                                                        onClick={() => handleExecuteClick(row)}
                                                        disabled={isBeingExecuted}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-lagoon px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-50"
                                                    >
                                                        {isBeingExecuted ? (
                                                            <Loader2 size={13} className="animate-spin" />
                                                        ) : (
                                                            <Waves size={13} />
                                                        )}
                                                        Exécuter
                                                    </button>
                                                ) : statut === "termine" ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
                                                        <CheckCircle2 size={13} />
                                                        Fait
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Confirm modal */}
            {confirm && (
                <ConfirmModal
                    release={confirm}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                    loading={executing !== null}
                />
            )}
        </>
    );
}