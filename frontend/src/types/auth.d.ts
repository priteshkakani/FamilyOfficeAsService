import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  authLoading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  getDisplayName: (user: User | null, profile: Profile | null) => string;
  refetchProfile: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
