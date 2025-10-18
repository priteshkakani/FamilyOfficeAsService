// MSW handlers scaffold for frontend tests.
// Export an array of handlers. Add handlers here to mock Supabase/network responses.
// Export a factory that accepts MSW's `rest` object. This avoids importing `msw`
// at module-evaluation time (which can cause ESM/CJS resolution issues under some
// test runners). setupTests will call this factory with the actual `rest`.
export default function createHandlers(rest) {
  const base = process.env.VITE_SUPABASE_URL || "https://test.supabase.local";

  const db = {
    profiles: [
      { id: "client-123", full_name: "Test Client", email: "client@test" },
    ],
    goals: [],
    tasks: [],
    assets: [],
    liabilities: [],
    consents: [],
    epfo_data: [],
    income_records: [],
    expense_records: [],
  };

  function tableNameFromUrl(url) {
    const parts = url.split("/rest/v1/");
    if (parts.length > 1) return parts[1].split("?")[0].split("/")[0];
    return null;
  }

  return [
    // GET /rest/v1/:table
    rest.get(`${base}/rest/v1/:table`, (req, res, ctx) => {
      const { table } = req.params;
      const t = db[table] || [];
      return res(ctx.status(200), ctx.json(t));
    }),

    // POST /rest/v1/:table
    rest.post(`${base}/rest/v1/:table`, async (req, res, ctx) => {
      const { table } = req.params;
      const body = (await req.json().catch(() => ({}))) || {};
      const payload = Array.isArray(body) ? body : [body];
      const stored = payload.map((p, i) => ({
        id: `${table}-${Date.now()}-${i}`,
        ...p,
      }));
      db[table] = (db[table] || []).concat(stored);
      return res(ctx.status(201), ctx.json(stored));
    }),

    // PATCH /rest/v1/:table (supports ?id=eq.X)
    rest.patch(`${base}/rest/v1/:table`, async (req, res, ctx) => {
      const { table } = req.params;
      const body = (await req.json().catch(() => ({}))) || {};
      const url = req.url.toString();
      const idMatch = url.match(/id=eq.(\w[\w-]*)/);
      if (idMatch) {
        const id = idMatch[1];
        db[table] = (db[table] || []).map((r) =>
          r.id === id ? { ...r, ...body } : r
        );
        return res(
          ctx.status(200),
          ctx.json(db[table].filter((r) => r.id === id))
        );
      }
      return res(
        ctx.status(400),
        ctx.json({ message: "unsupported patch query" })
      );
    }),

    // DELETE /rest/v1/:table (supports ?id=eq.X)
    rest.delete(`${base}/rest/v1/:table`, (req, res, ctx) => {
      const { table } = req.params;
      const url = req.url.toString();
      const idMatch = url.match(/id=eq.(\w[\w-]*)/);
      if (idMatch) {
        const id = idMatch[1];
        db[table] = (db[table] || []).filter((r) => r.id !== id);
        return res(ctx.status(204));
      }
      return res(
        ctx.status(400),
        ctx.json({ message: "unsupported delete query" })
      );
    }),

    // Auth token stub
    rest.post(`${base}/auth/v1/token`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ access_token: "test-token", expires_in: 3600 })
      );
    }),

    // Fallback for other supabase calls
    rest.all(`${base}/:rest(.*)`, (req, res, ctx) => {
      const tbl = tableNameFromUrl(req.url.toString());
      if (tbl && db[tbl]) return res(ctx.status(200), ctx.json(db[tbl]));
      return res(ctx.status(200), ctx.json({}));
    }),
  ];
}
