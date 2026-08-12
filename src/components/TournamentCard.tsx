import Link from "next/link";
import Image from "next/image";
import InlineAdminMessageControl from "./InlineAdminMessageControl";
import type { Tournament } from "@/types/database.types";

const statusLabel: Record<string, string> = {
  open: "Buka Pendaftaran",
  closed: "Ditutup",
  ongoing: "Berlangsung",
  finished: "Selesai",
  cancelled: "Dibatalkan",
};

const statusClass: Record<string, string> = {
  open: "bg-brand-500 text-white",
  closed: "bg-ink/70 text-white",
  ongoing: "bg-gold-500 text-ink",
  finished: "bg-ink/40 text-white",
  cancelled: "bg-rust-500 text-white",
};

export default function TournamentCard({
  tournament,
  isAdmin = false,
}: {
  tournament: Tournament;
  isAdmin?: boolean;
}) {
  return (
    <div className="border border-ink/10 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link href={`/tournaments/${tournament.id}`} className="block">
        <div className="relative h-36 bg-brand-50">
          {tournament.banner_url ? (
            <Image
              src={tournament.banner_url}
              alt={tournament.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-200 font-display uppercase tracking-wide text-sm">
              Tanpa Banner
            </div>
          )}
        </div>
        <div className="p-4 pb-3">
          {tournament.admin_message ? (
            <div className="pinned-note inline-flex items-center gap-1 text-xs font-semibold text-ink bg-gold-400 px-2.5 py-1.5 rounded-md mb-3">
              {tournament.admin_message}
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-50 text-brand-700">
                {tournament.game || "Umum"}
              </span>
              <span
                className={`ticket-badge ${statusClass[tournament.status] || statusClass.open}`}
              >
                {statusLabel[tournament.status] || tournament.status}
              </span>
            </div>
          )}
          <h3 className="font-semibold mb-1 line-clamp-1">{tournament.title}</h3>
          {tournament.prize && (
            <p className="text-sm text-gold-500 font-medium font-mono">🏆 {tournament.prize}</p>
          )}
        </div>
      </Link>

      {isAdmin && (
        <div className="px-4 pb-4 pt-1 border-t border-ink/5">
          <InlineAdminMessageControl
            tournamentId={tournament.id}
            currentMessage={tournament.admin_message}
          />
        </div>
      )}
    </div>
  );
}
