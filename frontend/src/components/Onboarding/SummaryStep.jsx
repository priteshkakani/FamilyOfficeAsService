import React from "react";

export default function SummaryStep({ data }) {
  return (
    <div>
      <div className="mb-4 font-medium">
        Review your details before finishing onboarding:
      </div>
      <div className="mb-2">
        <b>Name:</b> {data.full_name}
      </div>
      <div className="mb-2">
        <b>Email:</b> {data.email}
      </div>
      <div className="mb-2">
        <b>Mobile:</b> {data.mobile_number}
      </div>
      <div className="mb-2">
        <b>Family Members:</b>
        <ul className="list-disc ml-6">
          {(data.family_members || []).map((m, i) => (
            <li key={i}>
              {m.name} ({m.relation})
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <b>Data Sources:</b> {(data.data_sources || []).join(", ")}
      </div>
      <div className="mb-2">
        <b>Monthly Income:</b> {data.monthly_income}
      </div>
      <div className="mb-2">
        <b>Monthly Expenses:</b> {data.monthly_expenses}
      </div>
      <div className="mb-2">
        <b>Liabilities:</b> {data.liabilities_summary}
      </div>
      <div className="mb-2">
        <b>Goals:</b>
        <ul className="list-disc ml-6">
          {(data.goals || []).map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
