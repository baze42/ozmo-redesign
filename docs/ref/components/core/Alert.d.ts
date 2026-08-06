import React from "react";

export interface AlertProps {
  children?: React.ReactNode;
  /** @default "info" */
  tone?: "info" | "success" | "warning" | "danger";
  title?: React.ReactNode;
}

/** Inline callout / status message with a colored accent bar. */
export function Alert(props: AlertProps): JSX.Element;