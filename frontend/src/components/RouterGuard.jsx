import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

export default function RouterGuard({ children }) {
  const navigate = useNavigate();
  const { isLoading, data } = useProfile();
  const [minDelay, setMinDelay] = React.useState(true);

  React.useEffect(() => {
    setMinDelay(true);
    const t = setTimeout(() => setMinDelay(false), 100);
    return () => clearTimeout(t);
  }, [isLoading]);

  React.useEffect(() => {
    if (!isLoading && !minDelay) {
      if (!data?.session) {
        navigate("/login", { replace: true });
      } else if (data?.profile && !data.profile.is_onboarded) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [isLoading, minDelay, data, navigate]);

  if (isLoading || minDelay) {
    return (
      <div className="text-center py-12" data-testid="loading">
        Loading...
      </div>
    );
  }
  if (!data?.session || (data?.profile && !data.profile.is_onboarded)) {
    return <div data-testid="loading">Loading...</div>;
  }
  return children;
}
