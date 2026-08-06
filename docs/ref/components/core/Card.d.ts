import React from "react";

/**
 * Warm paper surface for grouping content (services, case studies, pricing).
 * @startingPoint section="Core" subtitle="Paper / feature / outline surfaces" viewport="700x260"
 */
export interface CardProps {
  children?: React.ReactNode;
  /** @default "default" */
  variant?: "default" | "feature" | "outline";
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;