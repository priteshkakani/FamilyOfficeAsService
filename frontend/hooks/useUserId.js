import { useAuth } from "@/hooks/useAuth";

export default function useUserId() {
  const { user, authLoading } = useAuth();
  return { userId: user?.id, loading: authLoading };
}
