import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardTournamentRow from "@/components/DashboardTournamentRow";
import type { Tournament } from "@/types/database.types";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Tournament[]>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-brand-700">Turnamen Saya</h1>
        <Link href="/tournaments/create" className="text-brand-600 font-medium">
          + Buat Baru
        </Link>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <p className="text-ink/50">Kamu belum membuat turnamen apapun.</p>
      ) : (
        <div className="space-y-3">
          {tournaments.map((t) => (
            <DashboardTournamentRow key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
