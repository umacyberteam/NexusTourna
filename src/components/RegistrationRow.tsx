"use client";

import { useState } from "react";
import type { Registration } from "@/types/database.types";

const statusClass: Record<string, string> = {
  pending: "bg-gold-50 text-gold-500",
  approved: "bg-brand-50 text-brand-700",
  rejected: "bg-rust-50 text-rust-600",
};

export default function RegistrationRow({
  registration,
}: {
  registration: Registration;
}) {
  const [status, setStatus] = useState(registration.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: "approved" | "rejected") => {
    setLoading(true);
    const res = await fetch(`/api/registrations/${registration.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (res.ok) setStatus(newStatus);
  };

  return (
    <div className="border border-ink/10 rounded-lg p-4 bg-white flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold">{registration.team_name}</p>
        {registration.player_names && (
          <p className="text-sm text-ink/50">{registration.player_names}</p>
        )}
        <p className="text-sm text-ink/50">{registration.contact}</p>
        {registration.proof_url && (
          <a
            href={registration.proof_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-brand-600 underline"
          >
            Lihat bukti
          </a>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass[status]}`}>
          {status}
        </span>
        {status === "pending" && (
          <>
            <button
              disabled={loading}
              onClick={() => updateStatus("approved")}
              className="text-xs bg-brand-600 text-white px-2 py-1 rounded-md disabled:opacity-50"
            >
              Terima
            </button>
            <button
              disabled={loading}
              onClick={() => updateStatus("rejected")}
              className="text-xs bg-rust-600 text-white px-2 py-1 rounded-md disabled:opacity-50"
            >
              Tolak
            </button>
          </>
        )}
      </div>
    </div>
  );
}
