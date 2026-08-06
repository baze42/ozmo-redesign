import React from "react";

export interface InputProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message; overrides hint and turns the field red. */
  error?: React.ReactNode;
  id?: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
  style?: React.CSSProperties;
}

/** Labelled text field with hint and error states. */
export function Input(props: InputProps): JSX.Element;