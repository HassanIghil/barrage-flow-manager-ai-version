import {
  Bell,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  Waves,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/releases", label: "Releases", icon: Waves },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
          isActive
            ? "bg-lagoon text-white shadow-panel"
            : "text-slate-600 hover:bg-white hover:text-slate-900",
        ].join(" ")
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { role, logout, userEmail } = useAuth();

  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 p-4 md:p-6">
        <aside
          className={[
            "fixed inset-y-4 left-4 z-20 w-72 rounded-[28px] border border-white/70 bg-dune/90 p-5 shadow-panel backdrop-blur md:static md:block",
            open ? "block" : "hidden",
          ].join(" ")}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-lagoon p-3 text-white">
              <Droplets size={22} />
            </div>
            <div>
              <p className="font-display text-xl">Barrage</p>
              <p className="text-sm text-slate-500">Operations center</p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
            ))}
          </nav>

          <div className="mt-8 rounded-3xl bg-lagoon p-5 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
              Tailwind test
            </p>
            <p className="mt-2 text-lg font-semibold">Design system is active.</p>
            <p className="mt-2 text-sm text-white/80">
              This card is styled entirely with Tailwind utility classes.
            </p>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-slate-950/30 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          />
        ) : null}

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col rounded-[32px] border border-white/60 bg-white/70 shadow-panel backdrop-blur">
          <header className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 md:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Water control
              </p>
              <h1 className="font-display text-2xl">Youssef Ibn Tachfine</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>
              <div className="rounded-2xl bg-spray px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-lagoon">
                  Session
                </p>
                <p className="text-sm font-semibold">{role || "Connected"}</p>
                <p className="text-xs text-slate-500">{userEmail}</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                onClick={logout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
