import React from "react";

/**
 * OZMO Input — labelled text field with hint / error states.
 */
export function Input({ label, hint, error, id, type = "text", full = true, style = {}, ...rest }) {
  const fieldId = id || (label ? "in-" + String(label).toLowerCase().replace(/\s+/g, "-") : undefined);
  const borderColor = error ? "var(--danger)" : "var(--border-default)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: full ? "100%" : "auto" }}>
      {label && (
        <label htmlFor={fieldId} style={{ font: "var(--weight-semibold) var(--text-sm)/1.2 var(--font-body)", color: "var(--navy)" }}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        style={{
          font: "var(--role-body)",
          color: "var(--ink)",
          background: "var(--surface-raised)",
          padding: "11px 14px",
          border: `1.5px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          transition: "border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)",
          ...style,
        }}
        onFocus={(e) => { e.target.style.borderColor = "var(--terracotta)"; e.target.style.boxShadow = "0 0 0 3px var(--terracotta-100)"; }}
        onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = "none"; }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{ font: "var(--weight-regular) var(--text-xs)/1.4 var(--font-body)", color: error ? "var(--danger)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}