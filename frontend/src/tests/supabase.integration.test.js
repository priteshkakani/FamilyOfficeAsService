import { supabase } from "./supabaseTestClient";

describe("Supabase Integration CRUD", () => {
  it("can create, read, update, and delete a user", async () => {
    // CREATE
    const email = `testuser_${Date.now()}@example.com`;
    const { data: created, error: createErr } = await supabase
      .from("users")
      .insert([{ mobile: `+123456${Date.now()}`, name: "Test User", email }])
      .select();
    expect(createErr).toBeNull();
    expect(created.length).toBe(1);
    const userId = created[0].id;

    // READ
    const { data: read, error: readErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);
    expect(readErr).toBeNull();
    expect(read.length).toBe(1);

    // UPDATE
    const { data: updated, error: updateErr } = await supabase
      .from("users")
      .update({ name: "Updated User" })
      .eq("id", userId)
      .select();
    expect(updateErr).toBeNull();
    expect(updated[0].name).toBe("Updated User");

    // DELETE
    const { error: deleteErr } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);
    expect(deleteErr).toBeNull();
  });

  it("can create, read, update, and delete a household", async () => {
    // Create user first
    const email = `testhousehold_${Date.now()}@example.com`;
    const { data: user } = await supabase
      .from("users")
      .insert([{ mobile: `+123456${Date.now()}`, name: "Owner", email }])
      .select();
    const ownerId = user[0].id;
    // CREATE
    const { data: created, error: createErr } = await supabase
      .from("households")
      .insert([{ name: "Test Household", owner_id: ownerId }])
      .select();
    expect(createErr).toBeNull();
    expect(created.length).toBe(1);
    const householdId = created[0].id;

    // READ
    const { data: read, error: readErr } = await supabase
      .from("households")
      .select("*")
      .eq("id", householdId);
    expect(readErr).toBeNull();
    expect(read.length).toBe(1);

    // UPDATE
    const { data: updated, error: updateErr } = await supabase
      .from("households")
      .update({ name: "Updated Household" })
      .eq("id", householdId)
      .select();
    expect(updateErr).toBeNull();
    expect(updated[0].name).toBe("Updated Household");

    // DELETE
    const { error: deleteErr } = await supabase
      .from("households")
      .delete()
      .eq("id", householdId);
    expect(deleteErr).toBeNull();
    // Cleanup user
    await supabase.from("users").delete().eq("id", ownerId);
  });

  it("can create, read, update, and delete a family_member", async () => {
    // Create household first
    const email = `testfamily_${Date.now()}@example.com`;
    const { data: user } = await supabase
      .from("users")
      .insert([{ mobile: `+123456${Date.now()}`, name: "Owner", email }])
      .select();
    const ownerId = user[0].id;
    const { data: household } = await supabase
      .from("households")
      .insert([{ name: "Family Household", owner_id: ownerId }])
      .select();
    const householdId = household[0].id;
    // CREATE
    const { data: created, error: createErr } = await supabase
      .from("family_members")
      .insert([
        {
          household_id: householdId,
          name: "Family Member",
          dob: "2000-01-01",
          relationship: "child",
          role: "view-only",
        },
      ])
      .select();
    expect(createErr).toBeNull();
    expect(created.length).toBe(1);
    const memberId = created[0].id;

    // READ
    const { data: read, error: readErr } = await supabase
      .from("family_members")
      .select("*")
      .eq("id", memberId);
    expect(readErr).toBeNull();
    expect(read.length).toBe(1);

    // UPDATE
    const { data: updated, error: updateErr } = await supabase
      .from("family_members")
      .update({ name: "Updated Member" })
      .eq("id", memberId)
      .select();
    expect(updateErr).toBeNull();
    expect(updated[0].name).toBe("Updated Member");

    // DELETE
    const { error: deleteErr } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId);
    expect(deleteErr).toBeNull();
    // Cleanup household and user
    await supabase.from("households").delete().eq("id", householdId);
    await supabase.from("users").delete().eq("id", ownerId);
  });

  it("can create, read, update, and delete an asset", async () => {
    // Create household first
    const email = `testasset_${Date.now()}@example.com`;
    const { data: user } = await supabase
      .from("users")
      .insert([{ mobile: `+123456${Date.now()}`, name: "Owner", email }])
      .select();
    const ownerId = user[0].id;
    const { data: household } = await supabase
      .from("households")
      .insert([{ name: "Asset Household", owner_id: ownerId }])
      .select();
    const householdId = household[0].id;
    // CREATE
    const { data: created, error: createErr } = await supabase
      .from("assets")
      .insert([
        {
          household_id: householdId,
          type: "property",
          details: { address: "123 Main St" },
        },
      ])
      .select();
    expect(createErr).toBeNull();
    expect(created.length).toBe(1);
    const assetId = created[0].id;

    // READ
    const { data: read, error: readErr } = await supabase
      .from("assets")
      .select("*")
      .eq("id", assetId);
    expect(readErr).toBeNull();
    expect(read.length).toBe(1);

    // UPDATE
    const { data: updated, error: updateErr } = await supabase
      .from("assets")
      .update({ type: "Updated Type" })
      .eq("id", assetId)
      .select();
    expect(updateErr).toBeNull();
    expect(updated[0].type).toBe("Updated Type");

    // DELETE
    const { error: deleteErr } = await supabase
      .from("assets")
      .delete()
      .eq("id", assetId);
    expect(deleteErr).toBeNull();
    // Cleanup household and user
    await supabase.from("households").delete().eq("id", householdId);
    await supabase.from("users").delete().eq("id", ownerId);
  });

  it("can create, read, update, and delete a consent", async () => {
    // Create user first
    const email = `testconsent_${Date.now()}@example.com`;
    const { data: user } = await supabase
      .from("users")
      .insert([{ mobile: `+123456${Date.now()}`, name: "Owner", email }])
      .select();
    const userId = user[0].id;
    // CREATE
    const { data: created, error: createErr } = await supabase
      .from("consents")
      .insert([
        {
          user_id: userId,
          source: "testsource",
          scope: "testscope",
          duration: "1 year",
        },
      ])
      .select();
    expect(createErr).toBeNull();
    expect(created.length).toBe(1);
    const consentId = created[0].id;

    // READ
    const { data: read, error: readErr } = await supabase
      .from("consents")
      .select("*")
      .eq("id", consentId);
    expect(readErr).toBeNull();
    expect(read.length).toBe(1);

    // UPDATE
    const { data: updated, error: updateErr } = await supabase
      .from("consents")
      .update({ scope: "updatedscope" })
      .eq("id", consentId)
      .select();
    expect(updateErr).toBeNull();
    expect(updated[0].scope).toBe("updatedscope");

    // DELETE
    const { error: deleteErr } = await supabase
      .from("consents")
      .delete()
      .eq("id", consentId);
    expect(deleteErr).toBeNull();
    // Cleanup user
    await supabase.from("users").delete().eq("id", userId);
  });

  it("can read from profiles table", async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, is_onboarded")
      .limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
