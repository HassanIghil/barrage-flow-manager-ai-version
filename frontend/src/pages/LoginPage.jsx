import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Droplets,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Lock,
  X,
  Loader2,
  BarChart3,
  Globe
} from "lucide-react";

import barrageImg from "../assets/barrage.jpg";
import barrageMarocImg from "../assets/barrage1.jpg";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "directeur@barrage.ma",
    password: "123456",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(formData);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        "Identifiants incorrects. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent selection:text-black overflow-x-hidden font-body relative">

      {/* ─── Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass border-none bg-black/20 px-8 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-black shadow-glow">
            <Droplets size={24} />
          </div>
          <span className="font-display font-black text-xl tracking-tighter">BARRAGE<span className="text-accent underline decoration-4 underline-offset-4 decoration-accent/30">FLOW</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          <a href="#features" className="hover:text-accent transition-colors">Système</a>
          <a href="#" className="hover:text-accent transition-colors">Sécurité</a>
          <a href="#" className="hover:text-accent transition-colors">Support</a>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-2.5 rounded-xl border border-white/10 font-bold text-xs uppercase tracking-widest glass-hover transition-all bg-white/5 active:scale-95"
        >
          Accès Membre
        </button>
      </nav>

      {/* ─── Hero Section ───────────────────────────── */}
      <section className="relative pt-44 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Backdrop Image (Blurred) */}
        <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none opacity-20 -z-10 group overflow-hidden">
          <img
            src={barrageImg}
            className="w-full h-full object-cover blur-2xl scale-110"
            alt="Backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/0 via-bg-primary/50 to-bg-primary" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/20 blur-[160px] rounded-full pointer-events-none opacity-60" />
        <div className="absolute top-[300px] right-[-200px] w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-accent shadow-panel-glow">
            <Globe size={12} className="animate-pulse" /> Infrastructure Critique • Temps Réel
          </div>

          <h1 className="font-display text-7xl md:text-9xl font-black tracking-tight leading-[0.9] text-white">
            Maitrisez le flux,<br />
            <span className="text-accent drop-shadow-glow">Préservez l'avenir</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted leading-relaxed font-semibold">
            Plateforme de monitoring analytique pour le barrage Youssef Ibn Tachfine.
            Précision. Transparence. Efficacité.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10">
            <button
              onClick={() => setShowLogin(true)}
              className="h-16 px-12 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-sm flex items-center gap-4 hover:bg-accent-light hover:shadow-glow active:scale-[0.98] transition-all group"
            >
              Démarrer le contrôle <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="h-16 px-12 rounded-2xl glass glass-hover font-black uppercase tracking-widest text-sm flex items-center gap-4 border-white/10 active:scale-[0.98] transition-all">
              Documentation technique
            </button>
          </div>
        </div>
      </section>

      {/* ─── Mockup / Image Section ───────────────────── */}
      <section className="px-6 md:px-24">
        <div className="relative glass p-2 md:p-5 rounded-[44px] shadow-glow-lg border-white/5 animate-slideIn max-w-6xl mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
          <div className="rounded-[36px] overflow-hidden bg-bg-primary aspect-video relative group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70" />
            {/* Note: Updated with user-provided dam image sources */}
            <img
              src={barrageMarocImg}
              alt="Barrage Youssef Ibn Tachfine"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]"
            />
            <div className="absolute bottom-12 left-12 z-20 space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Activity size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Status: Connecté</span>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Youssef Ibn Tachfine</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────── */}
      <section id="features" className="py-40 px-6 max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Sécurité Militaire", desc: "Chiffrement AES-256 pour chaque ordre de lâcher.", icon: Lock },
          { title: "Analytique Prédictive", desc: "Visualisez l'avenir des réserves d'eau.", icon: BarChart3 },
          { title: "Dashboard Premium", desc: "Une interface pensée pour l'opérateur moderne.", icon: Activity },
          { title: "Zéro Latence", desc: "Temps réel absolu sur tous les capteurs.", icon: Zap },
        ].map((feat, i) => (
          <div key={i} className="glass p-10 rounded-[36px] space-y-6 glass-hover group border-white/5">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all shadow-panel">
              <feat.icon size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">{feat.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed font-bold">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className="py-32 border-t border-white/5 bg-black/60 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center px-6 space-y-12 relative z-10">
          <div className="flex items-center justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Système de Protection Critique</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">Accédez au centre de contrôle régional</h2>
          <button
            onClick={() => setShowLogin(true)}
            className="h-16 px-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:invert transition-all active:scale-95 shadow-glow-white"
          >
            Identifier l'opérateur
          </button>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">© 2026 Office de Mise en Valeur Agricole • Souss-Massa</p>
            <p className="text-[8px] uppercase font-black tracking-[0.5em] text-accent animate-pulse">Encryption: RSA-4096-AES-GCM</p>
          </div>
        </div>
      </footer>

      {/* ─── Login Modal ─── */}
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-2xl animate-fadeIn">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowLogin(false)} />

          <div className="w-full max-w-lg glass p-10 rounded-[48px] border-white/10 relative overflow-hidden animate-slideIn shadow-glow-lg">
            <div className="absolute -top-32 -right-32 h-64 w-64 bg-accent/20 blur-[100px] rounded-full" />

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-8 right-8 h-10 w-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition backdrop-blur-xl"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mb-10">
              <div className="inline-flex h-12 w-12 bg-accent/10 rounded-2xl items-center justify-center text-accent mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Authentification</h3>
              <p className="text-text-muted text-xs font-black uppercase tracking-widest">Opérateur Ibn Tachfine</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">E-mail de service</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/10"
                  placeholder="directeur@barrage.ma"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-1">Mot de passe</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 px-6 text-sm font-bold text-white focus:border-accent/40 focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-accent text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-light hover:shadow-glow transition-all disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                {isSubmitting ? "Connexion..." : "Accès Autorisé"}
              </button>
            </form>

            <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-text-muted opacity-50">Accès Démo:</p>
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-accent/80">
                <span>directeur@barrage.ma</span>
                <span className="text-white/20">•</span>
                <span>123456</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
