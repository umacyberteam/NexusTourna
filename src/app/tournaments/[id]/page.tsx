import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import TournamentRegisterAction from "@/components/TournamentRegisterAction";
import AdminMessageControl from "@/components/AdminMessageControl";
import ShareButton from "@/components/ShareButton";
import type { Registration, Tournament } from "@/types/database.types";

export default async function TournamentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", params.id)
    .single<Tournament>();

  if (!tournament) notFound();

  const { count: registeredCount } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournament.id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let myRegistration: Registration | null = null;
  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("tournament_id", tournament.id)
      .eq("user_id", user.id)
      .maybeSingle<Registration>();
    myRegistration = data;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle<{ is_admin: boolean }>();
    isAdmin = profile?.is_admin ?? false;
  }

  const isFull =
    tournament.max_participants !== null &&
    (registeredCount || 0) >= tournament.max_participants;

  const isClosed = tournament.status !== "open" || isFull;

  return (
    <div className="max-w-2xl mx-auto">
      {tournament.banner_url && (
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-6 bg-brand-50">
          <Image
            src={tournament.banner_url}
            alt={tournament.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl text-brand-700">{tournament.title}</h1>
        <ShareButton title={tournament.title} />
      </div>
      <div className="flex flex-wrap gap-2 text-sm mb-4">
        {tournament.game && (
          <span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700">
            {tournament.game}
          </span>
        )}
        {tournament.prize && (
          <span className="px-2 py-1 rounded-full bg-gold-50 text-gold-500 font-mono">
            🏆 {tournament.prize}
          </span>
        )}
        <span className="px-2 py-1 rounded-full bg-ink/5 text-ink/70 font-mono">
          {registeredCount || 0}
          {tournament.max_participants ? ` / ${tournament.max_participants}` : ""} peserta
        </span>
      </div>

      {isAdmin && (
        <AdminMessageControl
          tournamentId={tournament.id}
          currentMessage={tournament.admin_message}
        />
      )}

      {tournament.description && (
        <p className="text-ink/80 mb-4 whitespace-pre-line">{tournament.description}</p>
      )}

      {tournament.rules && (
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Aturan</h2>
          <p className="text-ink/80 whitespace-pre-line">{tournament.rules}</p>
        </div>
      )}

      <div className="text-sm text-ink/50 mb-6 space-y-1">
        {tournament.registration_deadline && (
          <p>
            Batas pendaftaran:{" "}
            {new Date(tournament.registration_deadline).toLocaleString("id-ID")}
          </p>
        )}
        {tournament.start_date && (
          <p>Mulai: {new Date(tournament.start_date).toLocaleString("id-ID")}</p>
        )}
        {tournament.entry_fee > 0 && (
          <p>Biaya pendaftaran: Rp{tournament.entry_fee.toLocaleString("id-ID")}</p>
        )}
      </div>

      <TournamentRegisterAction
        tournamentId={tournament.id}
        isLoggedIn={!!user}
        isClosed={isClosed}
        registration={myRegistration}
      />
    </div>
  );
}
