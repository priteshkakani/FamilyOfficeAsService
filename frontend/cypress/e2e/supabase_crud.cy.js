// cypress/e2e/supabase_crud.cy.js
// Cypress E2E CRUD tests for Supabase tables: family_members, assets, liabilities, insurance, consents, households

describe("Supabase REST API CRUD (assets, liabilities, family_members)", () => {
  const supabaseUrl = Cypress.env("SUPABASE_URL");
  const supabaseKey = Cypress.env("SUPABASE_ANON_KEY");

  before(() => {
    cy.loginAsTestUser();
  });

  function getAuthHeaders() {
    return {
      apikey: supabaseKey,
      Authorization: `Bearer ${Cypress.env("access_token")}`,
      "Content-Type": "application/json",
    };
  }

  it("should insert and select from assets", () => {
    const userId = Cypress.env("user_id");
    const now = Date.now();
    const row = {
      user_id: userId,
      type: "stock",
      name: `Reliance Industries ${now}`,
      current_value: 100000,
      details: { foo: "bar" },
    };
    cy.supabaseRequest({
      method: "POST",
      url: `${supabaseUrl}/rest/v1/assets`,
      headers: getAuthHeaders(),
      body: row,
    }).then((resp) => {
      if (![200, 201].includes(resp.status)) {
        cy.log("POST /assets failed", JSON.stringify(resp.body));
        throw new Error(`POST /assets failed: ${JSON.stringify(resp.body)}`);
      }
      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
      const id = resp.body[0]?.id;
      expect(id).to.exist;
      cy.request({
        method: "GET",
        url: `${supabaseUrl}/rest/v1/assets?id=eq.${id}`,
        headers: getAuthHeaders(),
      }).then((getResp) => {
        expect(getResp.status).to.eq(200);
        expect(getResp.body[0]?.id).to.eq(id);
      });
    });
  });

  it("should insert and select from liabilities", () => {
    const userId = Cypress.env("user_id");
    const now = Date.now();
    const row = {
      user_id: userId,
      type: "loan",
      category: "personal",
      outstanding_amount: 50000,
      details: { bank: "HDFC", amount: 50000 },
    };
    cy.supabaseRequest({
      method: "POST",
      url: `${supabaseUrl}/rest/v1/liabilities`,
      headers: getAuthHeaders(),
      body: row,
    }).then((resp) => {
      if (![200, 201].includes(resp.status)) {
        cy.log("POST /liabilities failed", JSON.stringify(resp.body));
        throw new Error(
          `POST /liabilities failed: ${JSON.stringify(resp.body)}`
        );
      }
      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
      const id = resp.body[0]?.id;
      expect(id).to.exist;
      cy.request({
        method: "GET",
        url: `${supabaseUrl}/rest/v1/liabilities?id=eq.${id}`,
        headers: getAuthHeaders(),
      }).then((getResp) => {
        expect(getResp.status).to.eq(200);
        expect(getResp.body[0]?.id).to.eq(id);
      });
    });
  });

  it("should insert and select from family_members", () => {
    const userId = Cypress.env("user_id");
    const now = Date.now();
    const row = {
      user_id: userId,
      name: `Test Member ${now}`,
      relationship: "child",
      role: "view-only",
      dob: "2010-01-01",
    };
    cy.supabaseRequest({
      method: "POST",
      url: `${supabaseUrl}/rest/v1/family_members`,
      headers: getAuthHeaders(),
      body: row,
    }).then((resp) => {
      if (![200, 201].includes(resp.status)) {
        cy.log("POST /family_members failed", JSON.stringify(resp.body));
        throw new Error(
          `POST /family_members failed: ${JSON.stringify(resp.body)}`
        );
      }
      expect(Array.isArray(resp.body)).to.be.true;
      expect(resp.body.length).to.be.greaterThan(0);
      const id = resp.body[0]?.id;
      expect(id).to.exist;
      cy.request({
        method: "GET",
        url: `${supabaseUrl}/rest/v1/family_members?id=eq.${id}`,
        headers: getAuthHeaders(),
      }).then((getResp) => {
        expect(getResp.status).to.eq(200);
        expect(getResp.body[0]?.id).to.eq(id);
      });
    });
  });
});
