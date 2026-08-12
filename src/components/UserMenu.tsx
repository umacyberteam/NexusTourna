"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  name: string;
  avatarUrl: string | null;
};

export default function UserMenu({ name, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full overflow-hidden border border-ink/20 flex items-center justify-center bg-brand-100 text-brand-700 text-xs font-semibold shrink-0"
        aria-label="Menu akun"
        aria-expanded={open}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-ink/10 rounded-md shadow-lg py-1 text-sm z-50">
          <div className="px-3 py-2 text-ink/50 text-xs truncate border-b border-ink/10">
            {name}
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left px-3 py-2 text-rust-600 hover:bg-rust-50 disabled:opacity-50"
          >
            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      )}
    </div>
  );
}
