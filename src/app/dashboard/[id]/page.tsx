import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import RegistrationRow from "@/components/RegistrationRow";
import type { Registration, Tournament } from "@/types/database.types";

export default async function TournamentRegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", params.id)
    .single<Tournament>();

  if (!tournament) notFound();
  if (tournament.organizer_id !== user.id) redirect("/dashboard");

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .eq("tournament_id", params.id)
    .order("created_at", { ascending: true })
    .returns<Registration[]>();

  return (
    <div>
      <h1 className="text-2xl text-brand-700 mb-1">{tournament.title}</h1>
      <p className="text-ink/50 mb-6">Daftar Peserta</p>

      {!registrations || registrations.length === 0 ? (
        <p className="text-ink/50">Belum ada yang mendaftar.</p>
      ) : (
        <div className="space-y-3">
          {registrations.map((r) => (
            <RegistrationRow key={r.id} registration={r} />
          ))}
        </div>
      )}
    </div>
  );
}
