import {
  Bell,
  ClipboardList,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  Users,
  Waves,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AlertBanner from "./AlertBanner";

function buildLinks(role) {
  const r = role?.toLowerCase();
  const isPrivileged = r === "directeur" || r === "admin";

  const links = [
    { to: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { to: "/releases",  label: "Lâchers",    icon: Waves },
    { to: "/alerts",    label: "Alertes",    icon: Bell },
    { to: "/demandes",  label: "Demandes",   icon: ClipboardList },
    { to: "/profile",   label: "Mon Profil", icon: User },
  ];

  if (isPrivileged) {
    links.push({ to: "/users", label: "Agents", icon: Users });
  }

  return links;
}

function getRoleInfo(role) {
  const r = role?.toLowerCase();
  if (r === "admin")
    return { label: "Admin", sub: "Accès complet", iconColor: "text-danger", bg: "bg-danger/10" };
  if (r === "directeur")
    return { label: "Directeur", sub: "Accès complet", iconColor: "text-accent-light", bg: "bg-accent/10" };
  if (r === "gestionnaire")
    return { label: "Gestionnaire", sub: "Gestion opérationnelle", iconColor: "text-warning", bg: "bg-warning/10" };
  if (r === "technicien")
    return { label: "Technicien", sub: "Lecture & supervision", iconColor: "text-purple-400", bg: "bg-purple-500/10" };
  return { label: role ?? "Utilisateur", sub: "Accès standard", iconColor: "text-text-muted", bg: "bg-border-dark" };
}

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-accent/20 text-accent-light border border-accent/30"
            : "text-text-muted hover:text-text-primary hover:bg-bg-card",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 inset-y-2 w-0.5 rounded-r-full bg-accent" />
          )}
          <Icon size={17} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { role, logout, userEmail } = useAuth();

  const links = buildLinks(role);
  const roleInfo = getRoleInfo(role);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* ─── Mobile overlay ─────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ─── Sidebar ────────────────────── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border-dark bg-bg-sidebar transition-transform duration-300 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border-dark px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
            <Droplets size={18} />
          </div>
          <div>
            <p className="font-display text-base font-bold text-text-primary leading-tight">Barrage</p>
            <p className="text-[11px] text-text-muted">Operations center</p>
          </div>
          <button
            className="ml-auto rounded-lg p-1 text-text-muted hover:text-text-primary md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
          ))}
        </nav>

        {/* Role badge */}
        <div className={`mx-3 mb-4 rounded-2xl p-4 ${roleInfo.bg} border border-border-dark`}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className={roleInfo.iconColor} />
            <div>
              <p className={`text-xs font-bold uppercase tracking-wide ${roleInfo.iconColor}`}>
                {roleInfo.label}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">{roleInfo.sub}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main area ──────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border-dark bg-bg-card/50 px-5 py-3.5 backdrop-blur md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="rounded-xl border border-border-dark p-2 text-text-muted hover:text-text-primary md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">Water Control</p>
              <h1 className="font-display text-xl text-text-primary leading-tight">Youssef Ibn Tachfine</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Session card */}
            <div className="hidden rounded-xl border border-border-dark bg-bg-card px-4 py-2 text-right sm:block">
              <p className="text-[10px] uppercase tracking-wide text-accent-light">Session</p>
              <p className="text-sm font-semibold text-text-primary capitalize">{role || "—"}</p>
              <p className="text-[11px] text-text-muted">{userEmail}</p>
            </div>
            <NavLink
              to="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-dark bg-bg-card text-text-muted transition hover:border-accent/50 hover:text-accent"
            >
              <User size={18} />
            </NavLink>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-border-dark px-3 py-2.5 text-sm text-text-muted transition hover:border-accent/50 hover:text-text-primary"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <AlertBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}