import React from "react";

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
}

/** Warm checkbox with terracotta checked fill. */
export function Checkbox(props: CheckboxProps): JSX.Element;