"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // dibatalkan oleh user, abaikan
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm border border-brand-500 text-brand-700 px-3 py-1.5 rounded-md hover:bg-brand-50"
    >
      {copied ? "Link disalin!" : "🔗 Bagikan"}
    </button>
  );
}
