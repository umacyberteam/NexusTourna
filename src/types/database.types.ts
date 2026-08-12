export type TournamentStatus =
  | "open"
  | "closed"
  | "ongoing"
  | "finished"
  | "cancelled";

export type RegistrationStatus = "pending" | "approved" | "rejected";

export type Tournament = {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  game: string | null;
  banner_url: string | null;
  rules: string | null;
  prize: string | null;
  entry_fee: number;
  max_participants: number | null;
  registration_deadline: string | null;
  start_date: string | null;
  status: TournamentStatus;
  admin_message: string | null;
  created_at: string;
};

export type Registration = {
  id: string;
  tournament_id: string;
  user_id: string;
  team_name: string | null;
  player_names: string | null;
  contact: string | null;
  proof_url: string | null;
  status: RegistrationStatus;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
};
