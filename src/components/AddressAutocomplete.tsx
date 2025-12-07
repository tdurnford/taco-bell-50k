import { type FC, useState, useCallback } from "react";
import {
  Field,
  Input,
  InputProps,
  makeStyles,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { useDebouncedCallback } from "use-debounce";
import { searchAddresses, type ParsedAddress } from "../services/radarService";

// Styling for the autocomplete component
// Follows the same pattern as other form fields in the registration form
const useStyles = makeStyles({
  // Container for the entire autocomplete (field + dropdown)
  // Uses relative positioning to anchor the dropdown below the input
  container: {
    position: "relative",
  },
  // Dropdown container showing address suggestions
  // Uses absolute positioning to avoid layout shifts
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    maxHeight: "300px",
    overflowY: "auto",
    marginTop: "4px",
  },
  // Individual suggestion item (mimics MenuItem appearance)
  suggestionItem: {
    padding: "8px 12px",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ":active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },
  // Style for loading spinner during API calls
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
  },
  // Style for "no results" message
  noResults: {
    padding: "8px 12px",
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
  },
});

// Props for the AddressAutocomplete component
// This component replaces the standard Address input field
type Props = {
  // The current address value from the form state
  value: string;
  // Callback when the address input changes (typing)
  onChange: NonNullable<InputProps["onChange"]>;
  // Callback when an address is selected from the dropdown
  // This will auto-fill city, state, and zip fields
  onAddressSelect: (address: ParsedAddress) => void;
  // Whether the input is disabled (e.g., when registration is closed)
  disabled?: boolean;
  // ISO country code for Radar API (e.g., "US", "CA", "MX")
  // Defaults to "US" for backward compatibility
  countryCode?: string;
};

/**
 * Address autocomplete component using Radar API
 *
 * This component provides a search-as-you-type address field that:
 * 1. Shows address suggestions in a dropdown as the user types
 * 2. Debounces API calls to avoid excessive requests (300ms delay)
 * 3. Auto-fills city, state, and zip when an address is selected
 * 4. Matches the Fluent UI design system used throughout the form
 * 5. Supports international addresses by passing country code to Radar API
 *
 * The component uses Radar's autocomplete API to fetch address suggestions
 * and displays them in a Fluent UI Menu component for consistency.
 */
export const AddressAutocomplete: FC<Props> = ({
  value,
  onChange,
  onAddressSelect,
  disabled,
  countryCode = "US",  // Default to US for backward compatibility
}) => {
  const classes = useStyles();

  // State for address suggestions returned from Radar API
  const [suggestions, setSuggestions] = useState<ParsedAddress[]>([]);
  // Loading state to show spinner during API calls
  const [loading, setLoading] = useState(false);
  // Whether the dropdown menu is open
  const [menuOpen, setMenuOpen] = useState(false);
  // Track if we've searched but found no results
  const [noResults, setNoResults] = useState(false);

  /**
   * Debounced search function that calls Radar API
   *
   * This function is wrapped with useDebouncedCallback to delay execution
   * by 300ms. This means:
   * - User types "123 M" quickly → only one API call after typing stops
   * - Reduces API usage and improves performance
   * - 300ms is standard for autocomplete (matches ~40 WPM typing speed)
   */
  const debouncedSearch = useDebouncedCallback(
    async (searchQuery: string) => {
      // Don't search for very short queries (less than 2 characters)
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setMenuOpen(false);
        setNoResults(false);
        return;
      }

      // Show loading state immediately (even during debounce delay)
      setLoading(true);
      setNoResults(false);

      try {
        // Call Radar API to get address suggestions
        // Pass the countryCode prop to filter results by country
        // If countryCode is undefined (e.g., "Other" country), the service defaults to "US"
        const results = await searchAddresses(searchQuery, countryCode);

        // Update suggestions and open menu if we got results
        setSuggestions(results);
        setMenuOpen(results.length > 0);
        setNoResults(results.length === 0);
      } catch (error) {
        // On error, clear suggestions and close menu
        console.error("Address search failed:", error);
        setSuggestions([]);
        setMenuOpen(false);
        setNoResults(true);
      } finally {
        // Always clear loading state when done
        setLoading(false);
      }
    },
    300, // 300ms debounce delay
    { maxWait: 1000 } // Maximum wait time to ensure eventual execution
  );

  /**
   * Handle input changes as the user types
   *
   * This function:
   * 1. Calls the parent's onChange handler to update form state
   * 2. Triggers the debounced search for new suggestions
   */
  const handleInputChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (event, data) => {
      // Update the form state with the new value
      onChange(event, data);
      // Trigger debounced search for address suggestions
      debouncedSearch(data.value);
    },
    [onChange, debouncedSearch]
  );

  /**
   * Handle selection of an address from the dropdown
   *
   * When a user clicks on an address suggestion:
   * 1. Close the dropdown menu
   * 2. Clear suggestions list
   * 3. Call the onAddressSelect callback to auto-fill city/state/zip
   */
  const handleAddressClick = useCallback(
    (address: ParsedAddress) => {
      // Close the menu
      setMenuOpen(false);
      // Clear the suggestions list
      setSuggestions([]);
      setNoResults(false);
      // Notify parent component to update city, state, zip fields
      onAddressSelect(address);
    },
    [onAddressSelect]
  );

  /**
   * Handle mouse down on suggestion items
   *
   * Uses onMouseDown instead of onClick to ensure the selection happens
   * before the input loses focus, which prevents the dropdown from closing
   * prematurely and allows the selection to register properly.
   */
  const handleSuggestionMouseDown = useCallback(
    (address: ParsedAddress) => {
      handleAddressClick(address);
    },
    [handleAddressClick]
  );

  return (
    <Field required label="Address">
      <div className={classes.container}>
        {/* Standard Fluent UI Input - no wrapper that captures focus */}
        <Input
          disabled={disabled}
          value={value}
          onChange={handleInputChange}
          placeholder="Start typing your address..."
          // Show spinner at the end of input during loading
          contentAfter={loading ? <Spinner size="tiny" /> : undefined}
          style={{ width: "100%" }}
        />

        {/* Dropdown showing address suggestions - only visible when menu should be open */}
        {menuOpen && (
          <div className={classes.dropdown}>
            {/* Show loading message during API call */}
            {loading && (
              <div className={classes.loadingContainer}>
                <Spinner size="tiny" />
                <span>Searching addresses...</span>
              </div>
            )}

            {/* Show "no results" message if search completed with no matches */}
            {!loading && noResults && (
              <div className={classes.noResults}>
                No addresses found. Try entering more details.
              </div>
            )}

            {/* Show address suggestions */}
            {!loading &&
              suggestions.map((address, index) => (
                <div
                  key={index}
                  className={classes.suggestionItem}
                  onMouseDown={() => handleSuggestionMouseDown(address)}
                  role="option"
                  aria-selected={false}
                >
                  {/* Display formatted address */}
                  {address.fullRadarData.formattedAddress}
                </div>
              ))}
          </div>
        )}
      </div>
    </Field>
  );
};
