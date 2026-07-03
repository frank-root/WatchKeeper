import Link from "next/link";
import { SignupForm } from "./signup-form";

export default async function SignupPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-sky-400">
          ⚓ Watchkeeper
        </Link>
        <SignupForm error={error} />
      </div>
    </main>
  );
}
