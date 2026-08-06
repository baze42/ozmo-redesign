import React from "react";

/**
 * OZMO Button — the primary action primitive.
 * variant: primary (navy) | secondary (terracotta) | ghost | energy (spark) | link
 * size: sm | md | lg
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  full = false,
  iconLeft = null,
  iconRight = null,
  as = "button",
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", font: "var(--text-sm)", radius: "var(--radius-sm)", gap: "6px" },
    md: { padding: "12px 22px", font: "var(--text-base)", radius: "var(--radius-md)", gap: "8px" },
    lg: { padding: "16px 30px", font: "var(--text-md)", radius: "var(--radius-md)", gap: "10px" },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: { background: "var(--navy)", color: "var(--cream)", border: "2px solid var(--navy)", shadow: "var(--shadow-sm)" },
    secondary: { background: "var(--terracotta)", color: "var(--white)", border: "2px solid var(--terracotta)", shadow: "var(--shadow-terra)" },
    energy: { background: "var(--spark)", color: "var(--white)", border: "2px solid var(--spark)", shadow: "var(--shadow-terra)" },
    ghost: { background: "transparent", color: "var(--navy)", border: "2px solid var(--border-strong)", shadow: "none" },
    link: { background: "transparent", color: "var(--text-link)", border: "2px solid transparent", shadow: "none" },
  };
  const v = variants[variant] || variants.primary;

  const Tag = as;
  return (
    <Tag
      disabled={Tag === "button" ? disabled : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        width: full ? "100%" : "auto",
        padding: s.padding,
        font: `var(--weight-semibold) ${s.font}/1 var(--font-body)`,
        letterSpacing: "0.01em",
        color: v.color,
        background: v.background,
        border: v.border,
        borderRadius: variant === "link" ? 0 : s.radius,
        boxShadow: v.shadow,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        textDecoration: variant === "link" ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)",
        whiteSpace: "nowrap",
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(1px) scale(0.99)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}