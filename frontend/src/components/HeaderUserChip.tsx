import React from "react";
import { useAuth } from "../contexts/AuthProvider";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length === 1) {
    // If email, use first two letters
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HeaderUserChip() {
  const { user, profile, authLoading, profileLoading, getDisplayName } =
    useAuth();
  const loading = authLoading || profileLoading;
  const displayName = getDisplayName(user, profile);
  const initials = getInitials(displayName || user?.email);

  if (!user && !loading) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/login"
          className="font-bold text-blue-600"
          data-testid="header-signin-cta"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {loading ? (
        <div className="flex items-center gap-2">
          <div
            className="animate-pulse bg-gray-300 rounded-full w-8 h-8"
            data-testid="header-avatar-skeleton"
          />
          <div
            className="animate-pulse bg-gray-300 rounded w-24 h-5"
            data-testid="header-username-skeleton"
          />
        </div>
      ) : (
        <>
          <div
            className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg"
            title={displayName}
            data-testid="header-avatar"
          >
            {initials}
          </div>
          <span
            className="font-bold text-gray-900 text-base"
            data-testid="header-username"
            title={user?.email}
          >
            {displayName}
          </span>
        </>
      )}
    </div>
  );
}
