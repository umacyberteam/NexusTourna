"use client";

import { useMemo, useState } from "react";
import TournamentCard from "./TournamentCard";
import type { Tournament } from "@/types/database.types";

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "open", label: "Buka Pendaftaran" },
  { value: "closed", label: "Ditutup" },
  { value: "ongoing", label: "Berlangsung" },
  { value: "finished", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default function TournamentBoard({
  tournaments,
  isAdmin,
}: {
  tournaments: Tournament[];
  isAdmin: boolean;
}) {
  const [query, setQuery] = useState("");
  const [game, setGame] = useState("all");
  const [status, setStatus] = useState("all");

  const games = useMemo(() => {
    const set = new Set(
      tournaments.map((t) => t.game?.trim()).filter((g): g is string => !!g)
    );
    return Array.from(set).sort();
  }, [tournaments]);

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesQuery =
        query.trim() === "" ||
        t.title.toLowerCase().includes(query.trim().toLowerCase());
      const matchesGame = game === "all" || t.game === game;
      const matchesStatus = status === "all" || t.status === status;
      return matchesQuery && matchesGame && matchesStatus;
    });
  }, [tournaments, query, game, status]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama turnamen..."
          className="flex-1 border border-white/20 rounded-md px-3 py-2 text-sm bg-white/95 placeholder:text-ink/40"
        />
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/95"
        >
          <option value="all">Semua Game</option>
          {games.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/95"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/60">Tidak ada turnamen yang cocok.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TournamentCard key={t.id} tournament={t} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
