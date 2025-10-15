import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthProfile } from "../hooks/useAuthProfile";

export default function RouterGuard({ children }) {
  const navigate = useNavigate();
  const { loading, session, profile } = useAuthProfile();
  const [minDelay, setMinDelay] = React.useState(true);

  React.useEffect(() => {
    setMinDelay(true);
    const t = setTimeout(() => setMinDelay(false), 100);
    return () => clearTimeout(t);
  }, [loading]);

  React.useEffect(() => {
    if (!loading && !minDelay) {
      if (!session) {
        navigate("/login", { replace: true });
      } else if (profile && !profile.is_onboarded) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [loading, minDelay, session, profile, navigate]);

  if (loading || minDelay) {
    return (
      <div className="text-center py-12" data-testid="loading">
        Loading...
      </div>
    );
  }
  if (!session || (profile && !profile.is_onboarded)) {
    return <div data-testid="loading">Loading...</div>;
  }
  return children;
}
