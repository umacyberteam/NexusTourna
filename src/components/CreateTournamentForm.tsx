"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateTournamentForm() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [prize, setPrize] = useState("");
  const [entryFee, setEntryFee] = useState("0");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Kamu harus masuk dulu untuk membuat turnamen.");
      setLoading(false);
      router.push("/login");
      return;
    }

    let bannerUrl: string | null = null;

    if (banner) {
      const fileExt = banner.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("tournament-banners")
        .upload(fileName, banner);

      if (uploadError) {
        setError(`Gagal upload banner: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("tournament-banners")
        .getPublicUrl(fileName);

      bannerUrl = publicUrlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("tournaments")
      .insert({
        organizer_id: user.id,
        title,
        game,
        description,
        rules,
        prize,
        entry_fee: Number(entryFee) || 0,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
        registration_deadline: deadline || null,
        start_date: startDate || null,
        banner_url: bannerUrl,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      router.push(`/tournaments/${data.id}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl mb-6 text-brand-700">Buat Turnamen Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Turnamen</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
            placeholder="Contoh: Mabar Mobile Legends Antar RT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Game / Kategori</label>
          <input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
            placeholder="Contoh: Mobile Legends, Badminton, Catur"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Aturan (opsional)</label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hadiah (opsional)</label>
            <input
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2"
              placeholder="Contoh: Rp500.000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Biaya Pendaftaran</label>
            <input
              type="number"
              min="0"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Maks. Peserta</label>
            <input
              type="number"
              min="1"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batas Pendaftaran</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-ink/20 rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-ink/20 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Banner (opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
        </div>
        {error && <p className="text-rust-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Buat Turnamen"}
        </button>
      </form>
    </div>
  );
}
