import React from "react";

export default function SectionShell({ title, actions, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2
          className="text-xl font-bold"
          data-testid={`section-title-${title.toLowerCase()}`}
        >
          {title}
        </h2>
        <div>{actions}</div>
      </div>
      <div>{children}</div>
    </section>
  );
}
