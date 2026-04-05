import { Droplets } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
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
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-panel backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-gradient-to-br from-lagoon to-cyan-700 p-8 text-white md:p-12">
          <div className="inline-flex rounded-3xl bg-white/15 p-4">
            <Droplets size={30} />
          </div>
          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/70">
            Secure access
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Barrage control platform
          </h1>
          <p className="mt-6 max-w-md text-base text-white/80">
            Sign in to manage releases, monitor alerts, and access protected
            operations based on your role.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.3em] text-lagoon">Login</p>
          <h2 className="mt-3 font-display text-4xl text-ink">Welcome back</h2>
          <p className="mt-3 text-slate-600">
            Use your project credentials to get a JWT session from the API.
          </p>

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
                placeholder="directeur@barrage.ma"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
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
                placeholder="Enter your password"
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
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            Suggested demo account: <code>directeur@barrage.ma</code> /{" "}
            <code>123456</code>
          </div>
        </div>
      </div>
    </div>
  );
}
