import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RegisterForTournamentForm from "@/components/RegisterForTournamentForm";

export default async function RegisterForTournamentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <RegisterForTournamentForm tournamentId={params.id} />;
}
