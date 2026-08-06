import React from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  id?: string;
}

/** On/off toggle with a soft-bounce thumb. */
export function Switch(props: SwitchProps): JSX.Element;