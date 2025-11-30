import { type FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
// Phosphor icon for displaying an X circle icon before error messages
import { XCircleIcon } from "@phosphor-icons/react";

/**
 * Props for the FieldError component
 */
type FieldErrorProps = {
  /** The error message to display to the user */
  message: string;
};

/**
 * Styles for the error component
 * Uses Fluent UI's color tokens for consistent theming
 * Similar to FieldWarning but uses different error colors and displays an X circle icon
 */
const useStyles = makeStyles({
  error: {
    // Uses custom "diablo" color from global CSS variables for error messages
    // Falls back to Fluent UI's red color if the CSS variable is not defined
    color: `var(--color-diablo, ${tokens.colorPaletteRedForeground1})`,
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
 * Reusable field error component
 *
 * Displays an error message beneath form fields when validation fails.
 * This component provides consistent styling and behavior for errors across
 * different form fields. It's similar to FieldWarning but uses error semantics
 * and colors instead of warning colors.
 *
 * The main difference from FieldWarning:
 * - Uses error/danger colors (red) instead of warning colors
 * - Displays an X circle icon (from Phosphor Icons) before the message
 * - Intended for validation errors that prevent form submission
 * - FieldWarning is for advisory messages that don't block submission
 *
 * @example
 * ```tsx
 * {showError && <FieldError message="bib number must be a number" />}
 * ```
 */
export const FieldError: FC<FieldErrorProps> = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.error} role="alert" aria-live="polite">
      {/* X circle icon from Phosphor Icons to indicate an error */}
      <XCircleIcon size={18} weight="fill" />
      <span>{message}</span>
    </div>
  );
};
