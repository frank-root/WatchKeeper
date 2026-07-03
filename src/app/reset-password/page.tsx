import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-sky-400">
          ⚓ Watchkeeper
        </Link>

        <form
          action={updatePassword}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h1 className="text-lg font-semibold text-white">Choose a new password</h1>

          {error && (
            <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">{error}</p>
          )}

          <label className="block text-sm text-slate-300">
            New password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Retype new password
            <input
              name="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-500"
          >
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
