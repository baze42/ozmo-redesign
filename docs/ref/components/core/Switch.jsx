import React from "react";

/** OZMO Switch — on/off toggle. */
export function Switch({ checked = false, onChange, disabled = false, label, id, ...rest }) {
  const fieldId = id || "sw-" + Math.random().toString(36).slice(2, 7);
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  return (
    <label htmlFor={fieldId} style={{ display: "inline-flex", alignItems: "center", gap: "12px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, font: "var(--role-body)", color: "var(--ink)" }}>
      <span
        onClick={toggle}
        style={{
          width: "44px", height: "26px", flex: "0 0 44px",
          borderRadius: "var(--radius-pill)",
          background: checked ? "var(--terracotta)" : "var(--ink-200)",
          padding: "3px",
          display: "inline-flex",
          justifyContent: checked ? "flex-end" : "flex-start",
          transition: "background var(--dur-base) var(--ease-standard)",
        }}
      >
        <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--white)", boxShadow: "var(--shadow-sm)", transition: "all var(--dur-base) var(--ease-soft-bounce)" }} />
      </span>
      <input id={fieldId} type="checkbox" checked={checked} disabled={disabled} onChange={toggle} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...rest} />
      {label}
    </label>
  );
}