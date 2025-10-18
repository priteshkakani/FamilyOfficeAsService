// Minimal in-memory mock of the Supabase client used for tests.
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

function makeFrom(table) {
  // Helper: wrap a resolved result in the supabase-like chainable builder
  const wrapResult = (result) => ({
    data: result,
    error: null,
  });

  const builder = {
    select: (cols) => {
      // Return a chainable builder that supports .eq().single().maybeSingle().limit()
      const chain = {
        eq: async (field, value) => {
          const found = (db[table] || []).filter(
            (r) => String(r[field]) === String(value)
          );
          return wrapResult(found);
        },
        maybeSingle: async () => wrapResult((db[table] || [])[0] || null),
        single: async () => wrapResult((db[table] || [])[0] || null),
        limit: async (n) => wrapResult((db[table] || []).slice(0, n)),
        order: async (..._args) => wrapResult(db[table] || []),
        // when select() is called without further chaining, return entire table
        select: async () => wrapResult(db[table] || []),
      };
      return chain;
    },
    maybeSingle: async () => wrapResult((db[table] || [])[0] || null),
    insert(payload) {
      const rows = Array.isArray(payload) ? payload : [payload];
      const stored = rows.map((r, i) => ({
        id: r.id || `${table}-${Date.now()}-${i}`,
        ...r,
      }));
      db[table] = (db[table] || []).concat(stored);
      const result = wrapResult(stored);
      // allow chaining .select() and .maybeSingle()
      result.select = async () => wrapResult(stored);
      result.maybeSingle = async () => wrapResult(stored[0] || null);
      // make await supabase.from(...).insert(...) work by being thenable
      result.then = (resolve) =>
        Promise.resolve(wrapResult(stored)).then(resolve);
      return result;
    },
    update(payload) {
      const f = {
        eq(field, value) {
          const apply = async () => {
            const matches = (db[table] || []).filter(
              (r) => String(r[field]) === String(value)
            );
            const updated = matches.map((m) => {
              const idx = db[table].findIndex((x) => x === m);
              db[table][idx] = { ...db[table][idx], ...payload };
              return db[table][idx];
            });
            return wrapResult(updated);
          };
          apply.select = async () => {
            // perform the same mutation as apply() so .select() returns updated rows
            const matches = (db[table] || []).filter(
              (r) => String(r[field]) === String(value)
            );
            const updated = matches.map((m) => {
              const idx = db[table].findIndex((x) => x === m);
              db[table][idx] = { ...db[table][idx], ...payload };
              return db[table][idx];
            });
            return wrapResult(updated);
          };
          // also support awaiting the eq(...) call directly
          apply.then = (resolve) => Promise.resolve(apply()).then(resolve);
          return apply;
        },
      };
      return f;
    },
    delete() {
      return {
        eq(field, value) {
          const g = async () => {
            const before = db[table] || [];
            const removed = [];
            db[table] = before.filter((r) => {
              if (String(r[field]) === String(value)) {
                removed.push(r);
                return false;
              }
              return true;
            });
            return wrapResult(removed);
          };
          g.select = async () => {
            const before = db[table] || [];
            const removed = before.filter(
              (r) => String(r[field]) === String(value)
            );
            return wrapResult(removed);
          };
          g.then = (resolve) => Promise.resolve(g()).then(resolve);
          return g;
        },
      };
    },
    upsert(payload) {
      const rows = Array.isArray(payload) ? payload : [payload];
      const stored = rows.map((r) => {
        if (r.id) {
          const idx = (db[table] || []).findIndex(
            (x) => String(x.id) === String(r.id)
          );
          if (idx >= 0) {
            db[table][idx] = { ...db[table][idx], ...r };
            return db[table][idx];
          }
        }
        const newRow = { id: r.id || `${table}-${Date.now()}`, ...r };
        db[table] = (db[table] || []).concat(newRow);
        return newRow;
      });
      const result = wrapResult(stored);
      result.select = async () => wrapResult(stored);
      result.maybeSingle = async () => wrapResult(stored[0] || null);
      result.then = (resolve) =>
        Promise.resolve(wrapResult(stored)).then(resolve);
      return result;
    },
    single: async () => wrapResult((db[table] || [])[0] || null),
  };

  return builder;
}

// Mutable current supabase object used by tests; tests can call __setSupabase
// to override behavior per-test.
let currentSupabase = {
  from: (table) => makeFrom(table),
  auth: {
    // Provide a default fake session for tests so components load synchronously.
    getSession: async () => ({
      data: { session: { user: { id: "test-user" } } },
    }),
    onAuthStateChange: () => ({ data: null }),
    signInWithPassword: async () => ({ data: null }),
    signOut: async () => ({ error: null }),
  },
};

export function __setSupabase(obj) {
  currentSupabase = obj;
}

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      return currentSupabase[prop];
    },
    getOwnPropertyDescriptor() {
      return { configurable: true, enumerable: true };
    },
  }
);

export default { supabase, __setSupabase };
