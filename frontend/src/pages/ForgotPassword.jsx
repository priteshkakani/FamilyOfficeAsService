import React, { useState } from "react";
import { resetPassword } from "../supabaseAuth";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error.message);
    else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 5000);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {success ? (
          <>
            <div className="text-green-600 mb-4">
              Password reset email sent! Redirecting to sign in...
            </div>
            <p
              data-testid="forgot-success"
              className="text-green-700 text-center mt-2"
            >
              Reset link sent to your email.
            </p>
          </>
        ) : (
          <>
            <input
              type="email"
              name="email"
              className="border p-2 w-full mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
            {error && (
              <div className="text-red-600 mt-2" data-testid="forgot-error">
                {error}
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}
