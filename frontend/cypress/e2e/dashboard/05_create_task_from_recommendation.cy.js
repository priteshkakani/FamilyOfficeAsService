/// <reference types="cypress" />

describe("Create task from recommendation", () => {
  it("adds a task when clicking Add Task on a recommendation", () => {
    cy.login("advisor@test.com", "password");
    cy.visit("/dashboard/recommendations");
    cy.get('[data-testid^="rec-addtask-"]').first().click();
    // The modal should appear (TaskModal opens)
    cy.get('[data-testid="task-modal"]', { timeout: 5000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="task-modal"] input')
      .first()
      .clear()
      .type("Follow up on recommendation");
    cy.get('[data-testid="task-modal"]').contains("Save").click();
    // After saving, navigate to tasks page and assert the task exists
    cy.visit("/dashboard/tasks");
    cy.get('[data-testid="tasks-page"]', { timeout: 5000 }).should(
      "be.visible"
    );
    cy.contains("Follow up on recommendation").should("exist");
  });
});
