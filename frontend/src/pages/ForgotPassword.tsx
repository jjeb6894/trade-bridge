import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-sky-500" />
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-2 text-sm text-slate-600">We'll send you a reset link</p>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {sent ? (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              If an account exists for {email}, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              >
                Send reset link
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
