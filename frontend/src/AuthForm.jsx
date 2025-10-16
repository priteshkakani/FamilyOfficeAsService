import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { notifySuccess, notifyError } from "./utils/toast";

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
      try {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
          console.error("[Login error]", result.error.message);
          notifyError(`Login failed: ${result.error.message}`);
        } else if (result.data?.user) {
          notifySuccess("✅ Logged in successfully!");
          // Check onboarding status
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("is_onboarded")
            .eq("id", result.data.user.id)
            .maybeSingle();
          if (profileError) {
            console.error("[Profile fetch error]", profileError.message);
            notifyError("Failed to fetch profile info.");
            setLoading(false);
            return;
          }
          if (profile?.is_onboarded) navigate("/dashboard");
          else navigate("/onboarding");
        }
      } catch (err) {
        console.error("[Unexpected login error]", err);
        notifyError("Unexpected error occurred during login.");
      } finally {
        setLoading(false);
      }
      return;
    } else {
      try {
        result = await supabase.auth.signUp({ email, password });
        if (result.error) {
          console.error("[Signup error]", result.error.message);
          notifyError(`Signup failed: ${result.error.message}`);
        } else {
          console.log("[Signup success]", result.data);
          notifySuccess(
            "✅ Signed up successfully! Please log in to continue."
          );
          navigate("/login");
        }
      } catch (err) {
        console.error("[Unexpected signup error]", err);
        notifyError("Unexpected error occurred during signup.");
      } finally {
        setLoading(false);
      }
      return;
    }
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
