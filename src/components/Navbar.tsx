import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Akun";
  let avatarUrl: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    displayName = profile?.full_name || profile?.username || user.email || "Akun";
    avatarUrl = profile?.avatar_url ?? null;
  }

  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-display uppercase tracking-wide text-xl text-brand-600"
        >
          Nexus Tournament
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/about" className="hover:text-brand-600">
            Tentang
          </Link>
          <Link href="/tournaments/create" className="hover:text-brand-600">
            Buat Turnamen
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-600">
                Dashboard
              </Link>
              <UserMenu name={displayName} avatarUrl={avatarUrl} />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-600">
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
