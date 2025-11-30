import { type FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
// Phosphor icon for displaying a warning circle icon before warning messages
import { WarningCircleIcon } from "@phosphor-icons/react";

/**
 * Props for the FieldWarning component
 */
type FieldWarningProps = {
  /** The warning message to display to the user */
  message: string;
};

/**
 * Styles for the warning component
 * Uses Fluent UI's color tokens for consistent theming
 */
const useStyles = makeStyles({
  warning: {
    // Uses custom "hot" color from global CSS variables for warning messages
    // Falls back to Fluent UI's dark orange color if the CSS variable is not defined
    color: `var(--color-hot, ${tokens.colorPaletteDarkOrangeForeground1})`,
    fontSize: "14px",
    marginTop: "4px",
    // Adds a subtle indent for visual emphasis
    paddingLeft: "8px",
    // Flexbox layout to align icon and text
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
});

/**
 * Reusable field warning component
 *
 * Displays a warning message beneath form fields when validation issues occur.
 * This component provides consistent styling and behavior for warnings across
 * different form fields.
 *
 * Displays a warning circle icon (from Phosphor Icons) before the message to
 * visually indicate that this is a warning, not an error.
 *
 * @example
 * ```tsx
 * {showWarning && <FieldWarning message="Please enter a numeric value" />}
 * ```
 */
export const FieldWarning: FC<FieldWarningProps> = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.warning} role="alert" aria-live="polite">
      {/* Warning circle icon from Phosphor Icons to indicate a warning */}
      <WarningCircleIcon size={18} weight="fill" />
      <span>{message}</span>
    </div>
  );
};
