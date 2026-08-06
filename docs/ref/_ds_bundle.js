/* @ds-bundle: {"format":4,"namespace":"OZMODigitalDesignSystem_5d9d0c","components":[{"name":"Alert","sourcePath":"components/core/Alert.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"}],"sourceHashes":{"components/core/Alert.jsx":"55104dc66edd","components/core/Badge.jsx":"b8edc1abed8d","components/core/Button.jsx":"1a1a80a53a83","components/core/Card.jsx":"f852cf7dc9e1","components/core/Checkbox.jsx":"82a59445b95a","components/core/Input.jsx":"6ed09acbcdd2","components/core/Switch.jsx":"d444ac659822"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OZMODigitalDesignSystem_5d9d0c = window.OZMODigitalDesignSystem_5d9d0c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OZMO Alert — inline message / callout.
 * tone: info (navy) | success | warning | danger
 */
function Alert({
  children,
  tone = "info",
  title,
  ...rest
}) {
  const map = {
    info: {
      bg: "var(--navy-100)",
      bar: "var(--navy)",
      head: "var(--navy)"
    },
    success: {
      bg: "#dce9df",
      bar: "var(--success)",
      head: "var(--success)"
    },
    warning: {
      bg: "var(--terracotta-100)",
      bar: "var(--terracotta)",
      head: "var(--terracotta-700)"
    },
    danger: {
      bg: "#f3dcd9",
      bar: "var(--danger)",
      head: "var(--danger)"
    }
  };
  const v = map[tone] || map.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      gap: "var(--space-3)",
      padding: "var(--space-4) var(--space-4)",
      background: v.bg,
      borderRadius: "var(--radius-md)",
      borderLeft: `4px solid ${v.bar}`,
      color: "var(--ink)",
      font: "var(--role-body)"
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "2px"
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "var(--weight-bold) var(--text-base)/1.3 var(--font-body)",
      color: v.head
    }
  }, title), /*#__PURE__*/React.createElement("div", null, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Alert.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OZMO Badge — small status / category label.
 * tone: navy | terracotta | success | neutral | spark
 * appearance: soft (tinted) | solid
 */
function Badge({
  children,
  tone = "navy",
  appearance = "soft",
  ...rest
}) {
  const map = {
    navy: {
      soft: ["var(--navy-100)", "var(--navy)"],
      solid: ["var(--navy)", "var(--cream)"]
    },
    terracotta: {
      soft: ["var(--terracotta-100)", "var(--terracotta-700)"],
      solid: ["var(--terracotta)", "var(--white)"]
    },
    success: {
      soft: ["#dce9df", "var(--success)"],
      solid: ["var(--success)", "var(--white)"]
    },
    spark: {
      soft: ["#ffe2d1", "var(--terracotta-700)"],
      solid: ["var(--spark)", "var(--white)"]
    },
    neutral: {
      soft: ["var(--cream-300)", "var(--ink-600)"],
      solid: ["var(--ink)", "var(--cream)"]
    }
  };
  const [bg, fg] = (map[tone] || map.navy)[appearance];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      whiteSpace: "nowrap"
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OZMO Button — the primary action primitive.
 * variant: primary (navy) | secondary (terracotta) | ghost | energy (spark) | link
 * size: sm | md | lg
 */
function Button({
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
    sm: {
      padding: "8px 16px",
      font: "var(--text-sm)",
      radius: "var(--radius-sm)",
      gap: "6px"
    },
    md: {
      padding: "12px 22px",
      font: "var(--text-base)",
      radius: "var(--radius-md)",
      gap: "8px"
    },
    lg: {
      padding: "16px 30px",
      font: "var(--text-md)",
      radius: "var(--radius-md)",
      gap: "10px"
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--navy)",
      color: "var(--cream)",
      border: "2px solid var(--navy)",
      shadow: "var(--shadow-sm)"
    },
    secondary: {
      background: "var(--terracotta)",
      color: "var(--white)",
      border: "2px solid var(--terracotta)",
      shadow: "var(--shadow-terra)"
    },
    energy: {
      background: "var(--spark)",
      color: "var(--white)",
      border: "2px solid var(--spark)",
      shadow: "var(--shadow-terra)"
    },
    ghost: {
      background: "transparent",
      color: "var(--navy)",
      border: "2px solid var(--border-strong)",
      shadow: "none"
    },
    link: {
      background: "transparent",
      color: "var(--text-link)",
      border: "2px solid transparent",
      shadow: "none"
    }
  };
  const v = variants[variant] || variants.primary;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: Tag === "button" ? disabled : undefined,
    style: {
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
      whiteSpace: "nowrap"
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "translateY(1px) scale(0.99)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "none";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OZMO Card — warm paper surface for grouping content.
 * variant: default | feature (navy) | outline
 * Accepts an optional eyebrow, title, and children body.
 */
function Card({
  children,
  variant = "default",
  eyebrow,
  title,
  footer,
  style = {},
  ...rest
}) {
  const variants = {
    default: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)",
      shadow: "var(--shadow-sm)",
      head: "var(--navy)"
    },
    feature: {
      background: "var(--navy)",
      color: "var(--cream)",
      border: "1px solid var(--navy-800)",
      shadow: "var(--shadow-lg)",
      head: "var(--cream)"
    },
    outline: {
      background: "transparent",
      color: "var(--text-body)",
      border: "2px solid var(--border-strong)",
      shadow: "none",
      head: "var(--navy)"
    }
  };
  const v = variants[variant] || variants.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      padding: "var(--space-5)",
      borderRadius: "var(--radius-card)",
      background: v.background,
      color: v.color,
      border: v.border,
      boxShadow: v.shadow,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-bold) var(--text-xs)/1 var(--font-body)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      color: variant === "feature" ? "var(--terracotta-400)" : "var(--terracotta)"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: "var(--weight-semibold) var(--text-lg)/var(--leading-snug) var(--font-display)",
      color: v.head,
      fontVariationSettings: "'SOFT' 40"
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--role-body)",
      color: v.color,
      opacity: variant === "feature" ? 0.9 : 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)"
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** OZMO Checkbox — warm, accessible check control with label. */
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  const fieldId = id || (label ? "cb-" + String(label).toLowerCase().replace(/\s+/g, "-") : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      font: "var(--role-body)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "20px",
      flex: "0 0 20px",
      borderRadius: "6px",
      border: checked ? "2px solid var(--terracotta)" : "2px solid var(--border-default)",
      background: checked ? "var(--terracotta)" : "var(--surface-raised)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--dur-base) var(--ease-standard)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6.2L4.6 9L10 3",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OZMO Input — labelled text field with hint / error states.
 */
function Input({
  label,
  hint,
  error,
  id,
  type = "text",
  full = true,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? "in-" + String(label).toLowerCase().replace(/\s+/g, "-") : undefined);
  const borderColor = error ? "var(--danger)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: full ? "100%" : "auto"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      font: "var(--weight-semibold) var(--text-sm)/1.2 var(--font-body)",
      color: "var(--navy)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    style: {
      font: "var(--role-body)",
      color: "var(--ink)",
      background: "var(--surface-raised)",
      padding: "11px 14px",
      border: `1.5px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      transition: "border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)",
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = "var(--terracotta)";
      e.target.style.boxShadow = "0 0 0 3px var(--terracotta-100)";
    },
    onBlur: e => {
      e.target.style.borderColor = borderColor;
      e.target.style.boxShadow = "none";
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-regular) var(--text-xs)/1.4 var(--font-body)",
      color: error ? "var(--danger)" : "var(--text-muted)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** OZMO Switch — on/off toggle. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  ...rest
}) {
  const fieldId = id || "sw-" + Math.random().toString(36).slice(2, 7);
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      font: "var(--role-body)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: toggle,
    style: {
      width: "44px",
      height: "26px",
      flex: "0 0 44px",
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--terracotta)" : "var(--ink-200)",
      padding: "3px",
      display: "inline-flex",
      justifyContent: checked ? "flex-end" : "flex-start",
      transition: "background var(--dur-base) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "var(--white)",
      boxShadow: "var(--shadow-sm)",
      transition: "all var(--dur-base) var(--ease-soft-bounce)"
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: toggle,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

})();
