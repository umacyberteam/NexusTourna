import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CreateTournamentForm from "@/components/CreateTournamentForm";

export default async function CreateTournamentPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <CreateTournamentForm />;
}
