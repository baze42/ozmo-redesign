import React from "react";

/**
 * OZMO Card — warm paper surface for grouping content.
 * variant: default | feature (navy) | outline
 * Accepts an optional eyebrow, title, and children body.
 */
export function Card({ children, variant = "default", eyebrow, title, footer, style = {}, ...rest }) {
  const variants = {
    default: { background: "var(--surface-card)", color: "var(--text-body)", border: "1px solid var(--border-subtle)", shadow: "var(--shadow-sm)", head: "var(--navy)" },
    feature: { background: "var(--navy)", color: "var(--cream)", border: "1px solid var(--navy-800)", shadow: "var(--shadow-lg)", head: "var(--cream)" },
    outline: { background: "transparent", color: "var(--text-body)", border: "2px solid var(--border-strong)", shadow: "none", head: "var(--navy)" },
  };
  const v = variants[variant] || variants.default;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-5)",
        borderRadius: "var(--radius-card)",
        background: v.background,
        color: v.color,
        border: v.border,
        boxShadow: v.shadow,
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
        <span style={{ font: "var(--weight-bold) var(--text-xs)/1 var(--font-body)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: variant === "feature" ? "var(--terracotta-400)" : "var(--terracotta)" }}>
          {eyebrow}
        </span>
      )}
      {title && (
        <h3 style={{ margin: 0, font: "var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-display)", color: v.head, fontVariationSettings: "'SOFT' 40" }}>
          {title}
        </h3>
      )}
      {children && <div style={{ font: "var(--role-body)", color: v.color, opacity: variant === "feature" ? 0.9 : 1 }}>{children}</div>}
      {footer && <div style={{ marginTop: "var(--space-2)" }}>{footer}</div>}
    </div>
  );
}