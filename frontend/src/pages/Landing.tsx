import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-500" />
          <span className="text-lg font-bold">SaaS MVP</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Ship your SaaS in days,
          <br />
          <span className="text-sky-500">not weeks.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          A production-ready boilerplate with authentication, dashboards, and payments built in.
          Focus on your product, not the plumbing.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-lg bg-sky-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-600"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: 'Secure Auth', desc: 'JWT-based authentication with refresh tokens and bcrypt password hashing.' },
            { title: 'TypeSafe API', desc: 'Full TypeScript stack with Zod validation on every input boundary.' },
            { title: 'Scalable DB', desc: 'PostgreSQL with Prisma ORM — migrations, seeding, and type-safe queries.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6">
              <div className="mb-4 h-10 w-10 rounded-lg bg-sky-100" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-8">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-2 text-4xl font-bold">$0<span className="text-base font-normal text-slate-500">/mo</span></p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>Up to 100 users</li>
              <li>Community support</li>
              <li>Basic analytics</li>
            </ul>
            <Link
              to="/signup"
              className="mt-8 block rounded-lg border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Get started
            </Link>
          </div>
          <div className="rounded-xl border-2 border-sky-500 p-8">
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-2 text-4xl font-bold">$29<span className="text-base font-normal text-slate-500">/mo</span></p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li>Unlimited users</li>
              <li>Priority support</li>
              <li>Advanced analytics</li>
            </ul>
            <Link
              to="/signup"
              className="mt-8 block rounded-lg bg-sky-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-600"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to build?</h2>
        <p className="mt-4 text-slate-400">Start your free account in seconds.</p>
        <Link
          to="/signup"
          className="mt-8 inline-block rounded-lg bg-sky-500 px-8 py-3 text-base font-semibold text-white hover:bg-sky-600"
        >
          Get started free
        </Link>
      </section>

      <footer className="py-8 text-center text-sm text-slate-500">
        © 2026 SaaS MVP. All rights reserved.
      </footer>
    </div>
  );
}
