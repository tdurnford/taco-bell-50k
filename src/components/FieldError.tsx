import { type FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

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
 * Similar to FieldWarning but uses different error colors
 * Will be updated with a different icon in the future
 */
const useStyles = makeStyles({
  error: {
    // Uses Fluent UI's red palette for error messages
    color: tokens.colorPaletteRedForeground1,
    fontSize: "12px",
    marginTop: "4px",
    // Adds a subtle left border for visual emphasis
    paddingLeft: "8px",
    borderLeft: `2px solid ${tokens.colorPaletteRedBorder2}`,
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
 * - Uses error/danger colors (dark orange) instead of warning red
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
      {message}
    </div>
  );
};
