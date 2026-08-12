import { createClient } from "@/lib/supabase/server";
import TournamentBoard from "@/components/TournamentBoard";
import type { Tournament } from "@/types/database.types";

export default async function HomePage() {
  const supabase = createClient();
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Tournament[]>();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = !!profile?.is_admin;
  }

  return (
    <div>
      <div className="galaxy-bg" aria-hidden="true" />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl uppercase text-white mb-2">
          Papan Turnamen
        </h1>
        <p className="text-white/70">
          Turnamen resmi, iseng-iseng, atau berhadiah — semua bisa didaftarkan di sini.
        </p>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <p className="text-white/60">Belum ada turnamen. Jadilah yang pertama membuat!</p>
      ) : (
        <TournamentBoard tournaments={tournaments} isAdmin={isAdmin} />
      )}
    </div>
  );
}
