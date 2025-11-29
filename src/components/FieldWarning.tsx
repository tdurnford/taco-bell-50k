import { type FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

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
    // Uses Fluent UI's warning color for the text
    color: tokens.colorPaletteRedForeground1,
    fontSize: "12px",
    marginTop: "4px",
    // Adds a subtle left border for visual emphasis
    paddingLeft: "8px",
    borderLeft: `2px solid ${tokens.colorPaletteRedBorder2}`,
  },
});

/**
 * Reusable field warning component
 *
 * Displays a warning message beneath form fields when validation issues occur.
 * This component provides consistent styling and behavior for warnings across
 * different form fields.
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
      {message}
    </div>
  );
};
