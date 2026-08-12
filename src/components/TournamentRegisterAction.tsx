"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Registration } from "@/types/database.types";

const statusLabel: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  approved: "Diterima",
  rejected: "Ditolak",
};

const statusClass: Record<string, string> = {
  pending: "bg-gold-50 text-gold-500",
  approved: "bg-brand-50 text-brand-700",
  rejected: "bg-rust-50 text-rust-600",
};

export default function TournamentRegisterAction({
  tournamentId,
  isLoggedIn,
  isClosed,
  registration,
}: {
  tournamentId: string;
  isLoggedIn: boolean;
  isClosed: boolean;
  registration: Registration | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExit = async () => {
    if (!registration) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registration.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  };

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-md hover:bg-brand-700"
      >
        Masuk untuk Mendaftar
      </Link>
    );
  }

  // User sudah terdaftar di turnamen ini — tampilkan status + tombol keluar
  if (registration) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-ink/60">Status pendaftaranmu:</span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              statusClass[registration.status]
            }`}
          >
            {statusLabel[registration.status]}
          </span>
        </div>

        {confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink/60">Yakin keluar dari turnamen ini?</span>
            <button
              disabled={loading}
              onClick={handleExit}
              className="text-sm bg-rust-600 text-white px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Ya, Keluar"}
            </button>
            <button
              disabled={loading}
              onClick={() => setConfirming(false)}
              className="text-sm bg-ink/10 text-ink px-3 py-1.5 rounded-md disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="border border-rust-500 text-rust-600 px-5 py-2.5 rounded-md hover:bg-rust-50 font-medium"
          >
            Exit Tournament
          </button>
        )}
        {error && <p className="text-rust-600 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  if (isClosed) {
    return (
      <p className="text-ink/50 font-medium">Pendaftaran sudah ditutup / kuota penuh.</p>
    );
  }

  return (
    <Link
      href={`/tournaments/${tournamentId}/register`}
      className="inline-block bg-brand-600 text-white px-5 py-2.5 rounded-md hover:bg-brand-700"
    >
      Daftar Sekarang
    </Link>
  );
}
