import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-amber-700">
        Access denied
      </p>
      <h2 className="mt-3 font-display text-3xl text-ink">Role not authorized</h2>
      <p className="mt-3 max-w-2xl text-slate-700">
        Your session is valid, but this page is restricted to another role.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
