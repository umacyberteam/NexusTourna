"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterForTournamentForm({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [teamName, setTeamName] = useState("");
  const [playerNames, setPlayerNames] = useState("");
  const [contact, setContact] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    let proofUrl: string | null = null;

    if (proof) {
      const fileExt = proof.name.split(".").pop();
      const fileName = `${tournamentId}/${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("registration-proofs")
        .upload(fileName, proof);

      if (uploadError) {
        setError(`Gagal upload bukti: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("registration-proofs")
        .getPublicUrl(fileName);

      proofUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("registrations").insert({
      tournament_id: tournamentId,
      user_id: user.id,
      team_name: teamName,
      player_names: playerNames,
      contact,
      proof_url: proofUrl,
    });

    setLoading(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Kamu sudah terdaftar di turnamen ini.");
      } else {
        setError(insertError.message);
      }
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl mb-2 text-brand-700">Pendaftaran Terkirim ✅</h1>
        <p className="text-ink/60 mb-4">
          Panitia akan meninjau pendaftaranmu. Kamu bisa memantau statusnya nanti.
        </p>
        <button
          onClick={() => router.push(`/tournaments/${tournamentId}`)}
          className="text-brand-600 font-medium"
        >
          Kembali ke halaman turnamen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-brand-700">Form Pendaftaran</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Tim / Nama Kamu</label>
          <input
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Pemain (pisahkan koma)
          </label>
          <textarea
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
            rows={2}
          />
          <p className="text-xs text-ink/50 mt-1">
            Note: Jika pemain kamu sendiri kamu bisa skip "Nama Pemain", langsung
            taruh di "Nama Tim / Nama Kamu".
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kontak (WhatsApp/Email)</label>
          <input
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Bukti Pembayaran / Screenshot (opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProof(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
        </div>
        {error && <p className="text-rust-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Pendaftaran"}
        </button>
      </form>
    </div>
  );
}
