"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Tournament } from "@/types/database.types";

export default function DashboardTournamentRow({
  tournament,
}: {
  tournament: Tournament;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase
      .from("tournaments")
      .delete()
      .eq("id", tournament.id);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <div className="border border-ink/10 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/dashboard/${tournament.id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{tournament.title}</h3>
        </Link>
        <span className="text-xs px-2 py-1 rounded-full bg-ink/5 text-ink/60 whitespace-nowrap">
          {tournament.status}
        </span>

        {confirming ? (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <button
              disabled={loading}
              onClick={handleDelete}
              className="text-xs bg-rust-600 text-white px-2 py-1 rounded-md disabled:opacity-50"
            >
              {loading ? "Menghapus..." : "Ya, hapus"}
            </button>
            <button
              disabled={loading}
              onClick={() => setConfirming(false)}
              className="text-xs bg-ink/10 text-ink px-2 py-1 rounded-md disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-rust-600 hover:underline whitespace-nowrap"
          >
            Hapus
          </button>
        )}
      </div>
      {errorMsg && <p className="text-rust-600 text-xs mt-2">{errorMsg}</p>}
    </div>
  );
}
