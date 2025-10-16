import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function AuthForm({ onAuth, mode: modeProp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  // If modeProp is provided, use it; otherwise, infer from location
  const initialMode =
    modeProp || (location.pathname === "/signup" ? "signup" : "login");
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const navigate = useNavigate();

  // No auto-redirect: always require user to sign in/up
  useEffect(() => {
    setSessionChecked(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    let result;
    if (forgotMode) {
      // Forgot password flow
      result = await supabase.auth.resetPasswordForEmail(email);
      if (result.error) setError(result.error.message);
      else setInfo("Check your email for a reset link.");
      setLoading(false);
      return;
    }
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (!result.error && result.data?.session) {
        // Deterministic loading marker and profile fetch for Cypress/real users
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();
        if (session?.session) {
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.session.user.id)
            .maybeSingle();
        }
        setLoading(false);
        navigate("/dashboard");
        return;
      }
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error && result.data?.user) {
        // Deterministic loading marker and profile fetch for Cypress/real users
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();
        if (session?.session) {
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.session.user.id)
            .maybeSingle();
        }
        setLoading(false);
        navigate("/onboarding");
        return;
      }
      // Always redirect to onboarding after signup, regardless of session
      navigate("/onboarding");
      setLoading(false);
      return;
    }
    if (result.error) setError(result.error.message);
    setLoading(false);
  }

  if (!sessionChecked || loading) {
    return (
      <div data-testid="loading" style={{ textAlign: "center", marginTop: 64 }}>
        Loading...
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 320,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>
        {forgotMode
          ? "Forgot Password"
          : mode === "login"
          ? "Login"
          : "Sign Up"}
      </h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
        disabled={loading}
      />
      {!forgotMode && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          disabled={loading}
        />
      )}
      {error && (
        <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>
      )}
      {info && <div style={{ color: "#2563eb", marginBottom: 8 }}>{info}</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: "#2563eb",
          color: "white",
          padding: 10,
          border: "none",
          borderRadius: 4,
          fontWeight: 600,
        }}
      >
        {loading
          ? "Loading..."
          : forgotMode
          ? "Send Reset Email"
          : mode === "login"
          ? "Login"
          : "Sign Up"}
      </button>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        {forgotMode ? (
          <>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setForgotMode(false);
              }}
            >
              Back to Login
            </a>
          </>
        ) : mode === "login" ? (
          <>
            <span>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                }}
              >
                Sign Up
              </a>
            </span>
            <br />
            <a
              href="#"
              style={{ fontSize: 13, color: "#2563eb" }}
              onClick={(e) => {
                e.preventDefault();
                setForgotMode(true);
                setError(null);
                setInfo(null);
              }}
            >
              Forgot password?
            </a>
          </>
        ) : (
          <span>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode("login");
              }}
            >
              Login
            </a>
          </span>
        )}
      </div>
    </form>
  );
}
