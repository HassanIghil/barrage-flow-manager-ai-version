import { Droplets } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "directeur@barrage.ma",
    password: "password",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
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
          "Connexion impossible. Verifiez vos identifiants.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/60 bg-white/85 shadow-panel backdrop-blur lg:grid-cols-[1fr_1.05fr]">
        <div className="bg-gradient-to-br from-lagoon to-cyan-700 p-8 text-white md:p-12">
          <div className="inline-flex rounded-3xl bg-white/15 p-4">
            <Droplets size={30} />
          </div>
          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/70">
            Authentification
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Barrage Flow Manager
          </h1>
          <p className="mt-6 max-w-md text-base text-white/85">
            Connectez-vous pour acceder a votre espace securise et consulter
            votre profil.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-lagoon">
            Connexion
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink">
            Bienvenue
          </h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-lagoon focus:bg-white"
                placeholder="directeur@barrage-yt.ma"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Mot de passe
              </span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-lagoon focus:bg-white"
                placeholder="Entrez votre mot de passe"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-lagoon px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
