import React from "react";

/**
 * Primary action control for OZMO interfaces.
 * @startingPoint section="Core" subtitle="Navy / terracotta / spark actions" viewport="700x180"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "energy" | "ghost" | "link";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Stretch to container width. */
  full?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Render as another element, e.g. "a". @default "button" */
  as?: "button" | "a";
  onClick?: (e: React.MouseEvent) => void;
}

export function Button(props: ButtonProps): JSX.Element;