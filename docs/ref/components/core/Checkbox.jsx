import React from "react";

/** OZMO Checkbox — warm, accessible check control with label. */
export function Checkbox({ label, checked = false, onChange, disabled = false, id, ...rest }) {
  const fieldId = id || (label ? "cb-" + String(label).toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <label htmlFor={fieldId} style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, font: "var(--role-body)", color: "var(--ink)" }}>
      <span
        style={{
          width: "20px", height: "20px", flex: "0 0 20px",
          borderRadius: "6px",
          border: checked ? "2px solid var(--terracotta)" : "2px solid var(--border-default)",
          background: checked ? "var(--terracotta)" : "var(--surface-raised)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "all var(--dur-base) var(--ease-standard)",
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.2L4.6 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </span>
      <input id={fieldId} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...rest} />
      {label}
    </label>
  );
}