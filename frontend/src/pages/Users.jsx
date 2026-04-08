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
    RefreshCw,
    Search
} from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
    { value: "Gestionnaire", label: "Gestionnaire" },
    { value: "Technicien", label: "Technicien" },
    { value: "Directeur", label: "Directeur" },
];

const ROLE_COLORS = {
    Directeur: "bg-accent/10 text-accent-light border-accent/20",
    Gestionnaire: "bg-warning/10 text-orange-400 border-warning/20",
    Technicien: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Admin: "bg-danger/10 text-danger border-danger/20",
};

function RoleBadge({ role }) {
    const cls = ROLE_COLORS[role] ?? "bg-white/5 text-text-muted border-border-dark";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
            {role}
        </span>
    );
}

function FieldWrapper({ label, icon: Icon, children, error }) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider ml-1">
                <Icon size={14} className="text-text-dim" />
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-danger font-medium ml-1 animate-fadeIn">
                    <AlertTriangle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
}

const EMPTY_FORM = { nom: "", email: "", password: "", role: "Gestionnaire" };

export default function UsersPage() {
    const { role: currentUserRole } = useAuth();

    // Redirect non-directors/admins immediately
    const isAllowed = currentUserRole?.toLowerCase() === "directeur" || currentUserRole?.toLowerCase() === "admin";
    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const res = await api.get("/users/");
            setUsers(res.data);
        } catch {
            setUsers([]);
            toast.error("Impossible de charger les agents.");
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
            toast.success(`Agent "${form.nom}" créé avec succès.`);
            setForm(EMPTY_FORM);
            fetchUsers();
        } catch (err) {
            const detail = err.response?.data?.detail ?? "Erreur lors de la création.";
            toast.error(detail);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter((u) => 
        u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* ── HEADER ── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-bold text-text-primary">Gestion des agents</h2>
                        <p className="text-sm text-text-muted">Gérez les comptes des opérateurs et techniciens du barrage.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Rechercher un agent..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-border-dark rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent outline-none w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-2 rounded-xl bg-white/5 border border-border-dark text-text-muted hover:text-accent hover:border-accent/50 transition-all"
                        title="Actualiser la liste"
                    >
                        <RefreshCw size={18} className={loadingUsers ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                {/* ── FORM COLUMN ── */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[32px] border border-border-dark shadow-xl relative overflow-hidden">
                        {/* Motif décoratif en arrière-plan */}
                        <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-accent text-black flex items-center justify-center shadow-glow">
                                    <UserPlus size={20} />
                                </div>
                                <h3 className="font-display text-xl font-bold text-text-primary">Nouvel agent</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <FieldWrapper label="Nom complet" icon={User} error={errors.nom}>
                                    <input
                                        name="nom"
                                        type="text"
                                        value={form.nom}
                                        onChange={handleChange}
                                        placeholder="Ex : Fatima El Amrani"
                                        className="w-full bg-white/5 border border-border-dark rounded-2xl p-4 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-text-muted/50"
                                    />
                                </FieldWrapper>

                                <FieldWrapper label="Adresse email" icon={Mail} error={errors.email}>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="agent@barrage.ma"
                                        className="w-full bg-white/5 border border-border-dark rounded-2xl p-4 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-text-muted/50"
                                    />
                                </FieldWrapper>

                                <FieldWrapper label="Mot de passe" icon={Lock} error={errors.password}>
                                    <input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Min. 6 caractères"
                                        className="w-full bg-white/5 border border-border-dark rounded-2xl p-4 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-text-muted/50"
                                    />
                                </FieldWrapper>

                                <FieldWrapper label="Rôle" icon={Briefcase}>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-border-dark rounded-2xl p-4 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r.value} value={r.value} className="bg-bg-sidebar">
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </FieldWrapper>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-black shadow-glow transition hover:shadow-glow-lg disabled:opacity-50 mt-4 group"
                                >
                                    {submitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                                    )}
                                    {submitting ? "Création..." : "Créer le compte agent"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ── USERS LIST COLUMN ── */}
                <div className="glass rounded-[32px] border border-border-dark overflow-hidden flex flex-col shadow-xl">
                    <div className="p-8 border-b border-border-dark flex items-center justify-between">
                        <h3 className="font-display text-xl font-bold text-text-primary">Agents enregistrés</h3>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-text-muted border border-border-dark">
                            {users.length} total
                        </span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        {loadingUsers ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 size={32} className="animate-spin text-accent" />
                                <p className="text-sm text-text-muted">Chargement des comptes...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-text-muted mb-4 border border-border-dark">
                                    <User size={32} />
                                </div>
                                <p className="text-text-primary font-bold">Aucun agent trouvé</p>
                                <p className="text-sm text-text-muted max-w-xs mt-1">
                                    Aucun résultat ne correspond à votre recherche ou aucun compte n'a encore été créé.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-dark">
                                        <th className="py-4 px-8">Agent</th>
                                        <th className="py-4 px-8">Coordonnées</th>
                                        <th className="py-4 px-8">Rôle assigné</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark">
                                    {filteredUsers.map((u) => (
                                        <tr
                                            key={u.id_user ?? u.email}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-light/10 flex items-center justify-center text-accent-light font-bold shadow-panel">
                                                        {u.nom?.charAt(0).toUpperCase() ?? "?"}
                                                    </div>
                                                    <span className="text-sm font-bold text-text-primary group-hover:text-accent-light transition-colors">
                                                        {u.nom}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                                    <Mail size={14} className="text-text-dim" />
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <RoleBadge role={u.role} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}