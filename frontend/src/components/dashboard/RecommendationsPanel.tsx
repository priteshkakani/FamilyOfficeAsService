import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const PLACEHOLDER_RECOMMENDATIONS = [
  {
    id: 1,
    text: "Insurance gap detected: Consider increasing life/health cover.",
    action: "Add to Next Steps",
  },
  {
    id: 2,
    text: "Emergency fund < 6 months expenses.",
    action: "Add to Next Steps",
  },
  {
    id: 3,
    text: "High Debt/Income ratio alert.",
    action: "Add to Next Steps",
  },
  {
    id: 4,
    text: "Under-allocated to equity/gold/real estate.",
    action: "Add to Next Steps",
  },
];

export default function RecommendationsPanel({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: fetch/generate recommendations
    setRecommendations(PLACEHOLDER_RECOMMENDATIONS);
    setLoading(false);
  }, []);

  const handleAddNextStep = async (rec) => {
    try {
      const payload = {
        user_id: userId,
        description: rec.text,
        created_at: new Date().toISOString(),
        status: "pending",
      };
      const { error } = await supabase.from("next_steps").insert(payload);
      if (error) throw error;
      notifySuccess("Added to Next Steps");
    } catch (err) {
      notifyError("Failed to add next step");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold mb-2">Recommendations</h3>
      <ul className="bg-white rounded shadow p-4" data-testid="reco-list">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="flex items-center justify-between py-2 border-b"
          >
            <span>{rec.text}</span>
            <button
              className="bg-blue-600 text-white rounded px-3 py-1"
              data-testid="btn-add-next-step"
              onClick={() => handleAddNextStep(rec)}
            >
              {rec.action}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
