import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // User membatalkan login di halaman Google, atau provider mengirim error lain
  const oauthError =
    searchParams.get("error_description") || searchParams.get("error");
  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(oauthError)}`
    );
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
