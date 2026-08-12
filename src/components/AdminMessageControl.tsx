"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminMessageControl({
  tournamentId,
  currentMessage,
}: {
  tournamentId: string;
  currentMessage: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [value, setValue] = useState(currentMessage ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("tournaments")
      .update({ admin_message: value.trim() || null })
      .eq("id", tournamentId);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <div className="border border-gold-400/50 bg-gold-50 rounded-lg p-3 mb-4">
      <p className="text-xs font-semibold text-gold-500 uppercase tracking-wide mb-2">
        📌 Pesan Admin — hanya kamu yang bisa lihat kontrol ini
      </p>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Contoh: Direkomendasikan, Segera Ditutup"
          maxLength={60}
          className="flex-1 border border-ink/20 rounded-md px-3 py-1.5 text-sm bg-white"
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-md disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "..." : "Simpan"}
        </button>
      </div>
      <p className="text-xs text-ink/40 mt-1">Kosongkan lalu simpan untuk menghapus pesan.</p>
      {error && <p className="text-rust-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
