export default function DashboardPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-[28px] bg-gradient-to-br from-lagoon to-cyan-700 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-white/70">
          Overview
        </p>
        <h2 className="mt-3 font-display text-4xl">Reservoir dashboard</h2>
        <p className="mt-4 max-w-xl text-white/80">
          Base layout, router, and Tailwind system are wired and ready for feature
          work.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          API client
        </p>
        <p className="mt-3 text-3xl font-semibold text-ink">Configured</p>
        <p className="mt-2 text-slate-600">
          Axios points to <code>http://localhost:8000/api</code> and adds the JWT
          bearer token automatically.
        </p>
      </div>
    </section>
  );
}
