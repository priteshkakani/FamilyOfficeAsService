import os
from supabase import create_client


SUPABASE_URL = "https://fomyxahwvnfivxvrjtpf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXl4YWh3dm5maXZ4dnJqdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTgzMDAsImV4cCI6MjA3NTU3NDMwMH0.WT_DEOJ5otbwbhD_trLNa806d08WYwMfk0QWajsFVdw"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

email = "priteshgkakani@gmail.com"
password = "pune1234"

try:
    res = supabase.auth.sign_in_with_password({"email": email, "password": password})
    print("Login success! User:", res.user)
except Exception as e:
    print("Login failed:", e)
