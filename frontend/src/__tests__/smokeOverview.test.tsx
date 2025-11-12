import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Ensure the in-repo supabase mock is used
vi.mock("../supabaseClient", () => require("../__mocks__/supabaseClient.js"));

import Overview from "../../src/pages/dashboard/Overview";
import { ClientProvider } from "../../src/contexts/ClientContext";

describe("Overview smoke", () => {
  it("renders Overview with mock data", async () => {
    render(
      <ClientProvider>
        <Overview />
      </ClientProvider>
    );

    expect(await screen.findByTestId("overview-page")).toBeTruthy();
  });
});
