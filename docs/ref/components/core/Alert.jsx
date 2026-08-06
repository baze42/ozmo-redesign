import React from "react";

/**
 * OZMO Alert — inline message / callout.
 * tone: info (navy) | success | warning | danger
 */
export function Alert({ children, tone = "info", title, ...rest }) {
  const map = {
    info: { bg: "var(--navy-100)", bar: "var(--navy)", head: "var(--navy)" },
    success: { bg: "#dce9df", bar: "var(--success)", head: "var(--success)" },
    warning: { bg: "var(--terracotta-100)", bar: "var(--terracotta)", head: "var(--terracotta-700)" },
    danger: { bg: "#f3dcd9", bar: "var(--danger)", head: "var(--danger)" },
  };
  const v = map[tone] || map.info;
  return (
    <div
      role="status"
      style={{
        display: "flex",
        gap: "var(--space-3)",
        padding: "var(--space-4) var(--space-4)",
        background: v.bg,
        borderRadius: "var(--radius-md)",
        borderLeft: `4px solid ${v.bar}`,
        color: "var(--ink)",
        font: "var(--role-body)",
      }}
      {...rest}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {title && <strong style={{ font: "var(--weight-bold) var(--text-base)/1.3 var(--font-body)", color: v.head }}>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}