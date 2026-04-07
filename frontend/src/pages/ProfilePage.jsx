import React from "react";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Settings, 
  Lock, 
  Bell, 
  LogOut 
} from "lucide-react";

export default function ProfilePage() {
  const { userEmail, role, logout } = useAuth();

  const infoItems = [
    { label: "Email", value: userEmail, icon: Mail },
    { label: "Rôle", value: role || "Utilisateur", icon: ShieldCheck },
    { label: "Membre depuis", value: "Janvier 2024", icon: Calendar },
  ];

  const settingsItems = [
    { label: "Sécurité", sub: "Changer le mot de passe", icon: Lock },
    { label: "Notifications", sub: "Gérer les alertes par email", icon: Bell },
    { label: "Préférences", sub: "Langue et affichage", icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-black shadow-glow">
          <User size={48} />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-text-primary">Mon Profil</h2>
          <p className="text-text-muted">Gérez vos informations personnelles et vos paramètres</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info Card */}
        <div className="glass p-8 rounded-[32px] space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">Informations personnelles</h3>
          <div className="space-y-4">
            {infoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">{item.label}</p>
                  <p className="font-medium text-text-primary">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Card */}
        <div className="glass p-8 rounded-[32px] space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">Paramètres du compte</h3>
          <div className="space-y-4">
            {settingsItems.map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 glass-hover text-left">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.sub}</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-text-dim">
                  <Settings size={14} className="rotate-0 group-hover:rotate-90 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass p-8 rounded-[32px] border-danger/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-danger">Zone de danger</h3>
            <p className="text-sm text-text-muted">Actions irréversibles sur votre compte</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white transition-all font-semibold"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
