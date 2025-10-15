
import os
from supabase import create_client, Client

def get_supabase_client():
	SUPABASE_URL = os.getenv("SUPABASE_URL", "<your-supabase-url>")
	SUPABASE_KEY = os.getenv("SUPABASE_KEY", "<your-supabase-key>")
	return create_client(SUPABASE_URL, SUPABASE_KEY)
