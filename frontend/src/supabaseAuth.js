// src/supabaseAuth.js
import { supabase } from "./supabaseClient";

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) console.error("Supabase signUp error:", error);
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) console.error("Supabase signIn error:", error);
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Supabase signOut error:", error);
  return { error };
}

export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) console.error("Supabase resetPassword error:", error);
  return { data, error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) console.error("Supabase getSession error:", error);
  return { data, error };
}
