import React from "react";

/**
 * OZMO Badge — small status / category label.
 * tone: navy | terracotta | success | neutral | spark
 * appearance: soft (tinted) | solid
 */
export function Badge({ children, tone = "navy", appearance = "soft", ...rest }) {
  const map = {
    navy: { soft: ["var(--navy-100)", "var(--navy)"], solid: ["var(--navy)", "var(--cream)"] },
    terracotta: { soft: ["var(--terracotta-100)", "var(--terracotta-700)"], solid: ["var(--terracotta)", "var(--white)"] },
    success: { soft: ["#dce9df", "var(--success)"], solid: ["var(--success)", "var(--white)"] },
    spark: { soft: ["#ffe2d1", "var(--terracotta-700)"], solid: ["var(--spark)", "var(--white)"] },
    neutral: { soft: ["var(--cream-300)", "var(--ink-600)"], solid: ["var(--ink)", "var(--cream)"] },
  };
  const [bg, fg] = (map[tone] || map.navy)[appearance];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 11px",
        borderRadius: "var(--radius-pill)",
        background: bg,
        color: fg,
        font: "var(--weight-bold) var(--text-xs)/1 var(--font-body)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
      {...rest}
    >
      {children}
    </span>
  );
}