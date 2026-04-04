import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    UserPlus,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    User,
    Mail,
    Lock,
    Briefcase,
} from "lucide-react";

const ROLES = [
    { value: "Gestionnaire", label: "Gestionnaire" },
    { value: "Technicien", label: "Technicien" },
    { value: "Agriculteur", label: "Agriculteur" },
    { value: "Directeur", label: "Directeur" },
];

const ROLE_COLORS = {
    Directeur:
        "bg-lagoon/10 text-lagoon ring-1 ring-inset ring-lagoon/20",
    Gestionnaire:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    Technicien:
        "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20",
    Agriculteur:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    Admin:
        "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
};

function RoleBadge({ role }) {
    const cls =
        ROLE_COLORS[role] ??
        "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-600/20";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
            {role}
        </span>
    );
}

function FieldWrapper({ label, icon: Icon, children, error }) {
    return (
        <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Icon size={14} className="text-slate-400" />
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

const EMPTY_FORM = { nom: "", email: "", password: "", role: "Gestionnaire" };

export default function UsersPage() {
    const { role } = useAuth();

    // Redirect non-directors/admins immediately
    const isAllowed = role?.toLowerCase() === "directeur" || role?.toLowerCase() === "admin";
    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const res = await api.get("/users/");
            setUsers(res.data);
        } catch {
            // endpoint may not exist yet; fail silently
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const validate = () => {
        const e = {};
        if (!form.nom.trim()) e.nom = "Le nom est requis.";
        if (!form.email.trim()) e.email = "L'email est requis.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Format d'email invalide.";
        if (!form.password) e.password = "Le mot de passe est requis.";
        else if (form.password.length < 6)
            e.password = "Minimum 6 caractères.";
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/users/register", form);
            setFeedback({
                type: "success",
                message: `Agent "${form.nom}" créé avec le rôle ${form.role}.`,
            });
            setForm(EMPTY_FORM);
            fetchUsers();
        } catch (err) {
            const detail = err.response?.data?.detail ?? "Erreur lors de la création.";
            setFeedback({ type: "error", message: detail });
        } finally {
            setSubmitting(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    return (
        <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
            {/* ── FORM COLUMN ── */}
            <div className="space-y-4">
                {/* Header card */}
                <div className="rounded-[28px] bg-gradient-to-br from-lagoon to-cyan-700 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                            <ShieldCheck size={20} />
                        </span>
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                                Accès {role?.toLowerCase() === "admin" ? "Admin" : "Directeur"}
                            </p>
                            <h2 className="font-display text-xl">Gestion des agents</h2>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-white/80">
                        Créez des comptes opérateurs, ingénieurs ou techniciens.
                        Seul le Directeur ou l'Admin peut accéder à cette section.
                    </p>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div
                        className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === "success"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                            }`}
                    >
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                        ) : (
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        )}
                        {feedback.message}
                    </div>
                )}

                {/* Create form */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <UserPlus size={18} className="text-lagoon" />
                        <h3 className="font-display text-xl text-ink">Nouvel agent</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <FieldWrapper label="Nom complet" icon={User} error={errors.nom}>
                            <input
                                name="nom"
                                type="text"
                                value={form.nom}
                                onChange={handleChange}
                                placeholder="Ex : Fatima El Amrani"
                                className={`mt-0 block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-ink transition focus:bg-white focus:outline-none focus:ring-1 ${errors.nom
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-slate-200 focus:border-lagoon focus:ring-lagoon"
                                    }`}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="Adresse email" icon={Mail} error={errors.email}>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="agent@barrage.ma"
                                className={`block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-ink transition focus:bg-white focus:outline-none focus:ring-1 ${errors.email
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-slate-200 focus:border-lagoon focus:ring-lagoon"
                                    }`}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="Mot de passe" icon={Lock} error={errors.password}>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 caractères"
                                className={`block w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-ink transition focus:bg-white focus:outline-none focus:ring-1 ${errors.password
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-slate-200 focus:border-lagoon focus:ring-lagoon"
                                    }`}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="Rôle" icon={Briefcase}>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink transition focus:border-lagoon focus:bg-white focus:outline-none focus:ring-1 focus:ring-lagoon"
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </FieldWrapper>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lagoon py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
                        >
                            {submitting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <UserPlus size={16} />
                            )}
                            {submitting ? "Création en cours…" : "Créer le compte"}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── USERS LIST COLUMN ── */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="font-display text-2xl text-ink">Agents enregistrés</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {loadingUsers
                                ? "Chargement…"
                                : `${users.length} compte${users.length !== 1 ? "s" : ""} actif${users.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        Actualiser
                    </button>
                </div>

                {loadingUsers ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-slate-300" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                            <User size={24} className="text-slate-300" />
                        </div>
                        <p className="mt-4 text-slate-400">Aucun agent enregistré</p>
                        <p className="mt-1 text-xs text-slate-300">
                            Utilisez le formulaire pour créer un premier compte.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="pb-4 pr-4">Nom</th>
                                    <th className="pb-4 pr-4">Email</th>
                                    <th className="pb-4">Rôle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((u) => (
                                    <tr
                                        key={u.id_user ?? u.email}
                                        className="group transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-spray text-xs font-semibold text-lagoon">
                                                    {u.nom?.charAt(0).toUpperCase() ?? "?"}
                                                </span>
                                                <span className="text-sm font-medium text-ink">
                                                    {u.nom}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-slate-500">
                                            {u.email}
                                        </td>
                                        <td className="py-4">
                                            <RoleBadge role={u.role} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}