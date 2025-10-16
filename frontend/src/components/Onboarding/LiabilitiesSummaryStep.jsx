import React, { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

const LIABILITY_TYPES = [
  { key: "home_loan", label: "Home Loan" },
  { key: "car_loan", label: "Car Loan" },
  { key: "personal_loan", label: "Personal Loan" },
  { key: "credit_card", label: "Credit Card Outstanding" },
  { key: "other", label: "Other" },
];

export default function LiabilitiesSummaryStep({ data, onChange }) {
  const [liabilities, setLiabilities] = useState(data.liabilities || {});

  useEffect(() => {
    onChange({ ...data, liabilities });
    // eslint-disable-next-line
  }, [liabilities]);

  const handleChange = (type, field, value) => {
    setLiabilities((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  return (
    <div data-testid="onboarding-step-liabilities">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Liabilities Summary
      </h2>
      <div className="space-y-6">
        {LIABILITY_TYPES.map((liab) => (
          <div
            key={liab.key}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
          >
            <div className="font-medium text-gray-700 mb-2">{liab.label}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                min="0"
                placeholder="Outstanding Amount (₹)"
                value={liabilities[liab.key]?.outstanding_amount || ""}
                onChange={(e) =>
                  handleChange(liab.key, "outstanding_amount", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`liab-${liab.key}-amount`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Interest Rate (%)"
                value={liabilities[liab.key]?.interest_rate || ""}
                onChange={(e) =>
                  handleChange(liab.key, "interest_rate", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`liab-${liab.key}-rate`}
              />
              <input
                type="number"
                min="0"
                placeholder="EMI (₹)"
                value={liabilities[liab.key]?.emi || ""}
                onChange={(e) => handleChange(liab.key, "emi", e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`liab-${liab.key}-emi`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="date"
                placeholder="Next Due Date"
                value={liabilities[liab.key]?.next_due_date || ""}
                onChange={(e) =>
                  handleChange(liab.key, "next_due_date", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`liab-${liab.key}-due`}
              />
              <input
                type="text"
                placeholder="Notes"
                value={liabilities[liab.key]?.notes || ""}
                onChange={(e) =>
                  handleChange(liab.key, "notes", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                data-testid={`liab-${liab.key}-notes`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
