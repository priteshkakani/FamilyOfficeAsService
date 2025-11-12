import { Session, User } from '@supabase/supabase-js';
import { Database } from '../../database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_onboarded?: boolean;
};

export interface UseAuthProfileReturn {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'USER_DELETED' | 'PASSWORD_RECOVERY';

export interface AuthStateChangeEvent {
  event: AuthChangeEvent;
  session: Session | null;
}
