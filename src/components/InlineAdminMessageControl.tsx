"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InlineAdminMessageControl({
  tournamentId,
  currentMessage,
}: {
  tournamentId: string;
  currentMessage: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
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

    setEditing(false);
    router.refresh();
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gold-500 font-semibold hover:underline"
      >
        📌 {currentMessage ? "Ubah Pesan Admin" : "Pin Pesan Admin"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Contoh: Direkomendasikan"
        maxLength={60}
        className="border border-ink/20 rounded-md px-2 py-1 text-xs w-full"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs bg-brand-600 text-white px-2 py-1 rounded-md disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={loading}
          className="text-xs bg-ink/10 px-2 py-1 rounded-md"
        >
          Batal
        </button>
      </div>
      {error && <p className="text-rust-600 text-xs">{error}</p>}
    </div>
  );
}
