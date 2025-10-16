# Logtail/BetterStack Setup for Family Office

1. Go to https://betterstack.com/logs/ and create a free Logtail account.
2. Create a new source, copy your Logtail Source Token.
3. Add it to your .env as VITE_LOGTAIL_TOKEN=...
4. All logs (logRemote) will be sent to Logtail in production.
5. You can view/search logs in the Logtail dashboard.

No vendor lock-in: You can swap Logtail for Sentry or another log collector by updating logger.js.
