import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { rest } from "msw";
import { setupServer } from "msw/node";
import fetchDataFromSupabase from "../src/utils/fetchDataFromSupabase";

// Mock supabase-js client
vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({ data: { id: 1, name: "Test" }, error: null })
            ),
          })),
        })),
      })),
    })),
  };
});

describe("fetchDataFromSupabase", () => {
  it("fetches data from supabase and returns expected result", async () => {
    const data = await fetchDataFromSupabase("test_table", {
      key: "id",
      value: 1,
    });
    expect(data).toEqual({ id: 1, name: "Test" });
  });
});
