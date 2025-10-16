import React from "react";

export default function UpcomingGoals({ goals, loading }) {
  return (
    <section className="bg-white rounded-xl shadow-md p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Upcoming Goals
      </h2>
      {loading ? (
        <div className="h-20 animate-pulse bg-gray-100 rounded" />
      ) : goals?.length ? (
        <ul className="space-y-2">
          {goals.map((g) => (
            <li
              key={g.title}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{g.title}</p>
                <p className="text-xs text-gray-500">
                  Target: ₹{g.target_amount?.toLocaleString("en-IN")} •{" "}
                  {g.target_date
                    ? new Date(g.target_date).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <span
                className={`text-sm ${
                  g.priority === "High" ? "text-red-600" : "text-gray-500"
                }`}
              >
                {g.priority}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No upcoming goals 🎯</p>
      )}
    </section>
  );
}
