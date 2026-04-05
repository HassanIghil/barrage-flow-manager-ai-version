import { Mail, Shield, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-spray p-3 text-lagoon">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-base font-semibold text-ink">{value || "-"}</p>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-6">
        <p className="text-slate-500">Chargement du profil...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-br from-lagoon to-cyan-700 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-white/70">
          Profil
        </p>
        <h2 className="mt-3 font-display text-4xl">
          {user?.nom || "Agent connecte"}
        </h2>
        <p className="mt-3 max-w-2xl text-white/85">
          Consultez ici les informations du compte actuellement connecte.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={User} label="Nom" value={user?.nom} />
        <InfoCard icon={Mail} label="Email" value={user?.email} />
        <InfoCard icon={Shield} label="Role" value={user?.role} />
      </div>
    </section>
  );
}
