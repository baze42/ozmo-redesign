import React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "navy" */
  tone?: "navy" | "terracotta" | "success" | "spark" | "neutral";
  /** @default "soft" */
  appearance?: "soft" | "solid";
}

/** Compact uppercase status / category label. */
export function Badge(props: BadgeProps): JSX.Element;