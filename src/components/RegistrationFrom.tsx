import { FormEventHandler, type FC, useCallback, useState, useRef } from "react";
import {
  Field,
  Input,
  InputProps,
  Button,
  makeStyles,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  Textarea,
  TextareaProps,
  Dropdown,
  DropdownProps,
  Option,
} from "@fluentui/react-components";
import { produce } from "immer";
// Forms are submitted to Formspree
import { useSubmit } from "@formspree/react";
// React Router to direct to confirmation page after successful registration
import { useNavigate } from "react-router-dom";
// Address autocomplete component powered by Radar API
import { AddressAutocomplete } from "./AddressAutocomplete";
import type { ParsedAddress } from "../services/radarService";
// Warning and error components for displaying validation messages beneath fields
import { FieldWarning } from "./FieldWarning";
import { FieldError } from "./FieldError";

// List of US states and territories for the state dropdown
// Includes all 50 states plus DC and US territories
const US_STATES = [
  { key: "AL", text: "Alabama" },
  { key: "AK", text: "Alaska" },
  { key: "AZ", text: "Arizona" },
  { key: "AR", text: "Arkansas" },
  { key: "CA", text: "California" },
  { key: "CO", text: "Colorado" },
  { key: "CT", text: "Connecticut" },
  { key: "DE", text: "Delaware" },
  { key: "DC", text: "District of Columbia" },
  { key: "FL", text: "Florida" },
  { key: "GA", text: "Georgia" },
  { key: "HI", text: "Hawaii" },
  { key: "ID", text: "Idaho" },
  { key: "IL", text: "Illinois" },
  { key: "IN", text: "Indiana" },
  { key: "IA", text: "Iowa" },
  { key: "KS", text: "Kansas" },
  { key: "KY", text: "Kentucky" },
  { key: "LA", text: "Louisiana" },
  { key: "ME", text: "Maine" },
  { key: "MD", text: "Maryland" },
  { key: "MA", text: "Massachusetts" },
  { key: "MI", text: "Michigan" },
  { key: "MN", text: "Minnesota" },
  { key: "MS", text: "Mississippi" },
  { key: "MO", text: "Missouri" },
  { key: "MT", text: "Montana" },
  { key: "NE", text: "Nebraska" },
  { key: "NV", text: "Nevada" },
  { key: "NH", text: "New Hampshire" },
  { key: "NJ", text: "New Jersey" },
  { key: "NM", text: "New Mexico" },
  { key: "NY", text: "New York" },
  { key: "NC", text: "North Carolina" },
  { key: "ND", text: "North Dakota" },
  { key: "OH", text: "Ohio" },
  { key: "OK", text: "Oklahoma" },
  { key: "OR", text: "Oregon" },
  { key: "PA", text: "Pennsylvania" },
  { key: "RI", text: "Rhode Island" },
  { key: "SC", text: "South Carolina" },
  { key: "SD", text: "South Dakota" },
  { key: "TN", text: "Tennessee" },
  { key: "TX", text: "Texas" },
  { key: "UT", text: "Utah" },
  { key: "VT", text: "Vermont" },
  { key: "VA", text: "Virginia" },
  { key: "WA", text: "Washington" },
  { key: "WV", text: "West Virginia" },
  { key: "WI", text: "Wisconsin" },
  { key: "WY", text: "Wyoming" },
  { key: "AS", text: "American Samoa" },
  { key: "GU", text: "Guam" },
  { key: "MP", text: "Northern Mariana Islands" },
  { key: "PR", text: "Puerto Rico" },
  { key: "VI", text: "U.S. Virgin Islands" },
];

// List of supported countries for international address entry
// Uses ISO 3166-1 alpha-2 country codes supported by Radar API
// United States is first, remaining countries are alphabetically ordered, "Other" is last
const COUNTRIES = [
  { key: "US", text: "United States" },
  { key: "AF", text: "Afghanistan" },
  { key: "AL", text: "Albania" },
  { key: "DZ", text: "Algeria" },
  { key: "AS", text: "American Samoa" },
  { key: "AD", text: "Andorra" },
  { key: "AO", text: "Angola" },
  { key: "AQ", text: "Antarctica" },
  { key: "AG", text: "Antigua and Barbuda" },
  { key: "AR", text: "Argentina" },
  { key: "AM", text: "Armenia" },
  { key: "AW", text: "Aruba" },
  { key: "AU", text: "Australia" },
  { key: "CC", text: "Australian Indian Ocean Territories" },
  { key: "AT", text: "Austria" },
  { key: "AZ", text: "Azerbaijan" },
  { key: "BH", text: "Bahrain" },
  { key: "BD", text: "Bangladesh" },
  { key: "BB", text: "Barbados" },
  { key: "BY", text: "Belarus" },
  { key: "BE", text: "Belgium" },
  { key: "BZ", text: "Belize" },
  { key: "BJ", text: "Benin" },
  { key: "BT", text: "Bhutan" },
  { key: "BO", text: "Bolivia" },
  { key: "BA", text: "Bosnia and Herzegovina" },
  { key: "BW", text: "Botswana" },
  { key: "BR", text: "Brazil" },
  { key: "BN", text: "Brunei" },
  { key: "BG", text: "Bulgaria" },
  { key: "BF", text: "Burkina Faso" },
  { key: "BI", text: "Burundi" },
  { key: "KH", text: "Cambodia" },
  { key: "CM", text: "Cameroon" },
  { key: "CA", text: "Canada" },
  { key: "CV", text: "Cape Verde" },
  { key: "CF", text: "Central African Republic" },
  { key: "TD", text: "Chad" },
  { key: "CL", text: "Chile" },
  { key: "CN", text: "China" },
  { key: "CO", text: "Colombia" },
  { key: "KM", text: "Comoros" },
  { key: "CR", text: "Costa Rica" },
  { key: "HR", text: "Croatia" },
  { key: "CU", text: "Cuba" },
  { key: "CW", text: "Curacao" },
  { key: "CY", text: "Cyprus" },
  { key: "CZ", text: "Czech Republic" },
  { key: "CD", text: "Democratic Republic of the Congo" },
  { key: "DK", text: "Denmark" },
  { key: "DJ", text: "Djibouti" },
  { key: "DM", text: "Dominica" },
  { key: "DO", text: "Dominican Republic" },
  { key: "TL", text: "East Timor" },
  { key: "EC", text: "Ecuador" },
  { key: "EG", text: "Egypt" },
  { key: "SV", text: "El Salvador" },
  { key: "GQ", text: "Equatorial Guinea" },
  { key: "ER", text: "Eritrea" },
  { key: "SZ", text: "Eswatini" },
  { key: "EE", text: "Estonia" },
  { key: "ET", text: "Ethiopia" },
  { key: "FM", text: "Federated States of Micronesia" },
  { key: "FJ", text: "Fiji" },
  { key: "FI", text: "Finland" },
  { key: "FR", text: "France" },
  { key: "GA", text: "Gabon" },
  { key: "GM", text: "Gambia" },
  { key: "GE", text: "Georgia" },
  { key: "DE", text: "Germany" },
  { key: "GH", text: "Ghana" },
  { key: "GR", text: "Greece" },
  { key: "GL", text: "Greenland" },
  { key: "GD", text: "Grenada" },
  { key: "GU", text: "Guam" },
  { key: "GT", text: "Guatemala" },
  { key: "GG", text: "Guernsey" },
  { key: "GN", text: "Guinea" },
  { key: "GW", text: "Guinea Bissau" },
  { key: "GY", text: "Guyana" },
  { key: "HT", text: "Haiti" },
  { key: "HN", text: "Honduras" },
  { key: "HK", text: "Hong Kong" },
  { key: "HU", text: "Hungary" },
  { key: "IS", text: "Iceland" },
  { key: "IN", text: "India" },
  { key: "ID", text: "Indonesia" },
  { key: "IR", text: "Iran" },
  { key: "IQ", text: "Iraq" },
  { key: "IE", text: "Ireland" },
  { key: "IM", text: "Isle of Man" },
  { key: "IL", text: "Israel" },
  { key: "IT", text: "Italy" },
  { key: "CI", text: "Ivory Coast" },
  { key: "JM", text: "Jamaica" },
  { key: "JP", text: "Japan" },
  { key: "JE", text: "Jersey" },
  { key: "JO", text: "Jordan" },
  { key: "KZ", text: "Kazakhstan" },
  { key: "KE", text: "Kenya" },
  { key: "KI", text: "Kiribati" },
  { key: "XK", text: "Kosovo" },
  { key: "KW", text: "Kuwait" },
  { key: "KG", text: "Kyrgyzstan" },
  { key: "LA", text: "Laos" },
  { key: "LV", text: "Latvia" },
  { key: "LB", text: "Lebanon" },
  { key: "LS", text: "Lesotho" },
  { key: "LR", text: "Liberia" },
  { key: "LY", text: "Libya" },
  { key: "LI", text: "Liechtenstein" },
  { key: "LT", text: "Lithuania" },
  { key: "LU", text: "Luxembourg" },
  { key: "MO", text: "Macau" },
  { key: "MK", text: "Macedonia" },
  { key: "MG", text: "Madagascar" },
  { key: "MW", text: "Malawi" },
  { key: "MY", text: "Malaysia" },
  { key: "MV", text: "Maldives" },
  { key: "ML", text: "Mali" },
  { key: "MT", text: "Malta" },
  { key: "MH", text: "Marshall Islands" },
  { key: "MR", text: "Mauritania" },
  { key: "MU", text: "Mauritius" },
  { key: "MX", text: "Mexico" },
  { key: "MD", text: "Moldova" },
  { key: "MC", text: "Monaco" },
  { key: "MN", text: "Mongolia" },
  { key: "ME", text: "Montenegro" },
  { key: "MA", text: "Morocco" },
  { key: "MZ", text: "Mozambique" },
  { key: "MM", text: "Myanmar" },
  { key: "NA", text: "Namibia" },
  { key: "NR", text: "Nauru" },
  { key: "NP", text: "Nepal" },
  { key: "NL", text: "Netherlands" },
  { key: "AN", text: "Netherlands Antilles" },
  { key: "NZ", text: "New Zealand" },
  { key: "NI", text: "Nicaragua" },
  { key: "NE", text: "Niger" },
  { key: "NG", text: "Nigeria" },
  { key: "KP", text: "North Korea" },
  { key: "MP", text: "Northern Mariana Islands" },
  { key: "NO", text: "Norway" },
  { key: "XN", text: "Null Island" },
  { key: "OM", text: "Oman" },
  { key: "PK", text: "Pakistan" },
  { key: "PW", text: "Palau" },
  { key: "PS", text: "Palestine" },
  { key: "PA", text: "Panama" },
  { key: "PG", text: "Papua New Guinea" },
  { key: "PY", text: "Paraguay" },
  { key: "PE", text: "Peru" },
  { key: "PH", text: "Philippines" },
  { key: "PL", text: "Poland" },
  { key: "PT", text: "Portugal" },
  { key: "PR", text: "Puerto Rico" },
  { key: "QA", text: "Qatar" },
  { key: "CG", text: "Republic of Congo" },
  { key: "RO", text: "Romania" },
  { key: "RU", text: "Russia" },
  { key: "RW", text: "Rwanda" },
  { key: "PM", text: "Saint Pierre and Miquelon" },
  { key: "WS", text: "Samoa" },
  { key: "SM", text: "San Marino" },
  { key: "ST", text: "Sao Tome and Principe" },
  { key: "SA", text: "Saudi Arabia" },
  { key: "SN", text: "Senegal" },
  { key: "RS", text: "Serbia" },
  { key: "SC", text: "Seychelles" },
  { key: "SL", text: "Sierra Leone" },
  { key: "SG", text: "Singapore" },
  { key: "SX", text: "Sint Maarten" },
  { key: "SK", text: "Slovakia" },
  { key: "SI", text: "Slovenia" },
  { key: "SB", text: "Solomon Islands" },
  { key: "SO", text: "Somalia" },
  { key: "XS", text: "Somaliland" },
  { key: "ZA", text: "South Africa" },
  { key: "KR", text: "South Korea" },
  { key: "SS", text: "South Sudan" },
  { key: "ES", text: "Spain" },
  { key: "LK", text: "Sri Lanka" },
  { key: "KN", text: "Saint Kitts and Nevis" },
  { key: "LC", text: "Saint Lucia" },
  { key: "VC", text: "Saint Vincent and the Grenadines" },
  { key: "SD", text: "Sudan" },
  { key: "SR", text: "Suriname" },
  { key: "SE", text: "Sweden" },
  { key: "CH", text: "Switzerland" },
  { key: "SY", text: "Syria" },
  { key: "TW", text: "Taiwan" },
  { key: "TJ", text: "Tajikistan" },
  { key: "TZ", text: "Tanzania" },
  { key: "TH", text: "Thailand" },
  { key: "BS", text: "The Bahamas" },
  { key: "TG", text: "Togo" },
  { key: "TO", text: "Tonga" },
  { key: "TT", text: "Trinidad and Tobago" },
  { key: "TN", text: "Tunisia" },
  { key: "TR", text: "Turkey" },
  { key: "TM", text: "Turkmenistan" },
  { key: "TV", text: "Tuvalu" },
  { key: "UG", text: "Uganda" },
  { key: "UA", text: "Ukraine" },
  { key: "AE", text: "United Arab Emirates" },
  { key: "GB", text: "United Kingdom" },
  { key: "UN", text: "United Nations" },
  { key: "UY", text: "Uruguay" },
  { key: "VI", text: "U.S. Virgin Islands" },
  { key: "UZ", text: "Uzbekistan" },
  { key: "VU", text: "Vanuatu" },
  { key: "VA", text: "Vatican" },
  { key: "VE", text: "Venezuela" },
  { key: "VN", text: "Vietnam" },
  { key: "EH", text: "Western Sahara" },
  { key: "YE", text: "Yemen" },
  { key: "ZM", text: "Zambia" },
  { key: "ZW", text: "Zimbabwe" },
  { key: "OTHER", text: "Other" },
];

const useStyles = makeStyles({
  registrationForm: {
    marginBottom: "12px",
  },
  // Grid layout for city, state, and zip fields
  // On desktop (≥768px), displays fields side by side with proportional widths
  // On mobile (<768px), fields stack vertically
  cityStateZipGrid: {
    display: "grid",
    gap: "12px",
    // Mobile: single column (stacked)
    gridTemplateColumns: "1fr",
    // Desktop: city 50%, state 20%, zip 30%
    // Using fr units instead of % to automatically account for gaps
    "@media (min-width: 768px)": {
      gridTemplateColumns: "7fr 3fr 2fr",
    },
    // Override Fluent UI's default min-width on all Field children
    // This allows grid columns to shrink below component defaults
    "& > *": {
      minWidth: 0,
    },
    // Also override min-width on Input and Dropdown components within Fields
    // This ensures they don't expand beyond the grid cell
    "& input, & .fui-Input, & .fui-Field, & .fui-Dropdown": {
      minWidth: 0,
    },
  },
  // Ensures the state dropdown stays within its grid cell and positions correctly
  // Text overflow prevents placeholder from wrapping to multiple lines
  // The button can shrink but text won't overlap the expand icon
  stateDropdown: {
    width: "100%",
    minWidth: "unset", // Allow dropdown to shrink to fit grid cell
    // Hide the clear selection button (X button)
    "& .fui-Dropdown__clearButton": {
      display: "none",
    },
    // Prevent text wrapping and show ellipsis for long text in the dropdown button
    "& button": {
      minWidth: "unset", // Allow button to shrink to fit grid cell
      position: "relative", // For absolute positioning of the icon
      display: "block", // Block display for text overflow to work
      textOverflow: "ellipsis", // Show ellipsis for long text
      overflow: "hidden", // Hide overflowing text
      whiteSpace: "nowrap", // Prevent text wrapping
      paddingRight: "24px", // Reserve space for the expand icon
      // Style for the expand icon span to ensure it stays visible on the right
      "& .fui-Dropdown__expandIcon": {
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
      },
    },
  },
  // Constrains the dropdown options list to prevent scrolling issues
  // Limits height so the dropdown doesn't extend beyond viewport during scroll
  // Otherwise, the dropdown will display to the right of the input, or directly above it, depending on the scroll position
  stateDropdownListbox: {
    maxHeight: "200px", // ~8-10 options visible at once
  },
});

type FormData = {
  firstName: string;
  lastName: string;
  bibNumber: string;
  bibName: string;
  email: string;
  country: string;        // ISO country code (e.g., "US", "CA", "MX")
  address: string;
  city: string;
  state: string;          // State code for US (e.g., "CA"), free text for other countries
  zipCode: string;
  emergencyContact: string;
  phoneNumber: string;
  comments: string;
};

type Props = {
  disabled?: boolean;
  /** Formspree endpoint ID for useSubmit */
  formspreeEndpoint: string;
};

export const RegistrationForm: FC<Props> = ({ disabled, formspreeEndpoint }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { dispatchToast } = useToastController();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bibNumber: "",
    bibName: "",
    email: "",
    country: "US",           // Default to United States
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    phoneNumber: "",
    comments: "",
  });

  // Track whether to show a warning for non-numeric bib number during typing
  // This warning appears in real-time as users enter non-numeric characters
  const [showBibNumberWarning, setShowBibNumberWarning] = useState(false);

  // Track whether to show an error for non-numeric bib number after submission
  // This error appears after form submission fails validation and persists until user starts typing again
  const [showBibNumberError, setShowBibNumberError] = useState(false);

  // Track whether to show an error for invalid email after submission
  // This error appears after form submission fails validation and persists until user starts typing again
  const [showEmailError, setShowEmailError] = useState(false);

  // Ref to the bib number field for scrolling to it when validation fails
  // This allows us to programmatically scroll to the field to show the user the error
  const bibNumberFieldRef = useRef<HTMLDivElement>(null);

  // Ref to the email field for scrolling to it when validation fails
  const emailFieldRef = useRef<HTMLDivElement>(null);

  const submit = useSubmit<FormData>(formspreeEndpoint, {
    onError: () => {
      dispatchToast(
        <Toast
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          fontSize: '1.5rem',
          maxWidth: '500px',
          borderRadius: '10px',
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1000
        }}
        >
          <ToastTitle
            style={{
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            Something went wrong!
          </ToastTitle>
        </Toast>,
        {
          intent: "error",
        }
      );
    },
    onSuccess: () => {
      setFormData({
        firstName: "",
        lastName: "",
        bibNumber: "",
        bibName: "",
        email: "",
        country: "US",           // Reset to United States default
        address: "",
        city: "",
        state: "",
        zipCode: "",
        emergencyContact: "",
        phoneNumber: "",
        comments: "",
      });
      // Navigate to confirmation page
      // replace: true keeps this page from being registered in the browser 
      // history stack, so the user can't go back to it
      // This makes it harder for people to spam the registration form
      // and easier to navigate back to the home page
      navigate("/confirmation", { replace: true });
      dispatchToast(
        <Toast
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            fontSize: '1.5rem',
            maxWidth: '500px',
            borderRadius: '10px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
        >
          <ToastTitle
            style={{
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            You registered successfully!
          </ToastTitle>
        </Toast>,
        {
          intent: "success",
        }
      );
    },
  });

  // #region Event Handlers

  /**
   * Validates that an email address is in a valid format
   *
   * Uses a standard email regex pattern that checks for:
   * - One or more characters before the @ symbol (alphanumeric, dots, hyphens, underscores, plus signs)
   * - An @ symbol
   * - One or more characters for the domain (alphanumeric, dots, hyphens)
   * - A dot followed by 2+ characters for the TLD
   *
   * This provides more user-friendly validation than the HTML5 type="email" attribute,
   * which has browser-specific quirks and less clear error messages.
   *
   * @param email - The email string to validate
   * @returns true if the email is valid, false otherwise
   */
  const isValidEmail = useCallback((email: string): boolean => {
    // Basic email regex pattern
    // Matches: user@domain.com, first.last+tag@sub.domain.co.uk, etc.
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Validates the form data before submission
   *
   * This function checks all form fields against validation rules and returns
   * an array of error messages. If the array is empty, the form is valid.
   *
   * As new validation rules are needed, they can be added here by checking
   * the relevant formData fields and pushing error messages to the errors array.
   *
   * When validation fails, this function also sets the appropriate error state
   * flags that control the display of FieldError components below the form fields.
   *
   * Validation happens in order of fields on the form, so the first error will be
   * the one we scroll to (for better UX).
   *
   * @returns Array of validation error messages (empty if form is valid)
   */
  const validateForm = useCallback((): string[] => {
    const errors: string[] = [];

    // Validate that bib number is numeric
    // Check if value is not empty and contains non-numeric characters
    if (formData.bibNumber.trim() !== "" && isNaN(Number(formData.bibNumber))) {
      errors.push("Bib number must be a number");
      // Set error state to display FieldError component below the bib number field
      setShowBibNumberError(true);
      // Hide the warning since we're now showing an error
      // This prevents both warning and error from displaying simultaneously
      setShowBibNumberWarning(false);
    }

    // Validate that email is in a valid format
    // Check if email is not empty and doesn't match the email pattern
    if (formData.email.trim() !== "" && !isValidEmail(formData.email.trim())) {
      errors.push("Email must be a valid email address");
      // Set error state to display FieldError component below the email field
      setShowEmailError(true);
    }

    return errors;
  }, [formData.bibNumber, formData.email, isValidEmail]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      // Validate the form before submission
      const errors = validateForm();

      // If there are validation errors, display them and prevent submission
      if (errors.length > 0) {
        // Scroll to the first field with an error so user can see it
        // Check fields in the order they appear on the form for better UX
        // This ensures we scroll to the topmost error first
        if (bibNumberFieldRef.current && showBibNumberError) {
          bibNumberFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (emailFieldRef.current && showEmailError) {
          emailFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit the form to Formspree
      submit(formData);
    },
    [formData, submit, validateForm, showBibNumberError, showEmailError]
  );

  const handleFirstNameChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.firstName = value;
      })
    );
  }, []);

  const handleLastNameChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (_, { value }) => {
      setFormData((currentData) =>
        produce(currentData, (draft) => {
          draft.lastName = value;
        })
      );
    },
    []
  );

  const handleBibNumberChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (_, { value }) => {
      // Always update the form data with the entered value
      setFormData((currentData) =>
        produce(currentData, (draft) => {
          draft.bibNumber = value;
        })
      );

      // Clear any error from a previous failed submission when user starts typing
      // This provides immediate feedback that they're addressing the validation error
      setShowBibNumberError(false);

      // Show warning in real-time if the value contains non-numeric characters
      // Check if value is empty first to avoid showing warning on empty field
      // isNaN returns true for empty strings, so we need special handling
      if (value.trim() !== "" && isNaN(Number(value))) {
        setShowBibNumberWarning(true);
      } else {
        setShowBibNumberWarning(false);
      }
    },
    []
  );

  const handleBibNameChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (_, { value }) => {
      setFormData((currentData) =>
        produce(currentData, (draft) => {
         
          draft.bibName = value;
        })
      );
    },
    []
  );

  const handleEmailChange = useCallback<NonNullable<InputProps["onChange"]>>(
    (_, { value }) => {
      setFormData((currentData) =>
        produce(currentData, (draft) => {
          draft.email = value;
        })
      );

      // Clear any error from a previous failed submission when user starts typing
      setShowEmailError(false);
    },
    []
  );

  /**
   * Handler for country dropdown selection
   *
   * When the user changes countries:
   * 1. Updates the country field in form data
   * 2. Clears the state field to avoid invalid state codes
   *    (e.g., if switching from US "CA" state to Canada country)
   */
  const handleCountryChange = useCallback<
    NonNullable<DropdownProps["onOptionSelect"]>
  >((_, data) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.country = data.optionValue ?? "US";
        // Clear state when switching countries to avoid confusion
        // e.g., "CA" in US (California) vs "CA" as country code (Canada)
        draft.state = "";
      })
    );
  }, []);

  const handlePhoneNumberChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.phoneNumber = value;
      })
    );
  }, []);

  const handleCommentsChange = useCallback<
    NonNullable<TextareaProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.comments = value;
      })
    );
  }, []);

  const handleAddressChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.address = value;
      })
    );
  }, []);

  /**
   * Handle address selection from autocomplete dropdown
   *
   * When a user selects an address from the Radar API suggestions:
   * 1. Updates the address field with the full street address
   * 2. Auto-fills the city field
   * 3. Auto-fills the state dropdown (using the state abbreviation)
   * 4. Auto-fills the zip code field
   *
   * This creates a seamless user experience where selecting one address
   * automatically populates all related fields.
   */
  const handleAddressSelect = useCallback(
    (parsedAddress: ParsedAddress) => {
      setFormData((currentData) =>
        produce(currentData, (draft) => {
          // Update address with the street address from Radar
          draft.address = parsedAddress.streetAddress;
          // Auto-fill city
          draft.city = parsedAddress.city;
          // Auto-fill state using the two-letter abbreviation (matches our dropdown values)
          draft.state = parsedAddress.stateCode;
          // Auto-fill zip code
          draft.zipCode = parsedAddress.zipCode;
        })
      );
    },
    []
  );

  const handleCityChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.city = value;
      })
    );
  }, []);

  /**
   * Handler for state field changes
   * Supports both dropdown selection (US) and text input (other countries)
   *
   * This handler needs to work with two different input types:
   * - Dropdown: provides data.optionValue (US state selection)
   * - Input: provides data.value (free-form text for international)
   */
  const handleStateChange = useCallback<
    NonNullable<DropdownProps["onOptionSelect"]> & NonNullable<InputProps["onChange"]>
  >((_, data) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        // Extract value from either dropdown (optionValue) or input (value)
        draft.state = (data as any).optionValue ?? (data as any).value ?? "";
      })
    );
  }, []);

  const handleZipCodeChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.zipCode = value;
      })
    );
  }, []);

  const handleEmergencyContactChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.emergencyContact = value;
      })
    );
  }, []);

  // #endregion 

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <br></br>
      <h2 style={{ textAlign: "center", marginTop: "0px" }}>Registration</h2>
      {disabled ? (
        <p>Registration is currently closed. Please check back later.</p>
      ) : null}
      <h3>Acknowledgment and Assumption of Risk</h3>
        <p> I acknowledge that my participation in the Taco Bell 50k involves inherent risks, including, but not limited to, physical injury, illness, death, property damage, 
         and other dangers that may occur. I understand these risks, whether they are known or unknown, anticipated or unanticipated, and I voluntarily choose to participate in the event.
         </p>
         <h3>Waiver and Release of Liability</h3>
         <p>
         In consideration of being allowed to participate in Taco Bell 50k, I hereby release, discharge, and hold harmless the Taco Bell 50k organizers, its officers, directors, employees, volunteers,
         agents, and any other associated parties (collectively, the "Released Parties") from any and all liabilities, claims, demands, or causes of action that I may hereafter have for injuries,
         damages, or losses arising out of or connected to my participation in the event, including, but not limited to, those caused by the negligence or fault of the Released Parties.</p>
      <div className={classes.registrationForm}>
        <Field required label="First Name">
          <Input
            disabled={disabled}
            value={formData.firstName}
            onChange={handleFirstNameChange}
          />
        </Field>
        <Field required label="Last Name">
          <Input
            disabled={disabled}
            value={formData.lastName}
            onChange={handleLastNameChange}
          />
        </Field>
        <Field required label="Country">
          <Dropdown
            disabled={disabled}
            placeholder="Select a country"
            value={COUNTRIES.find((c) => c.key === formData.country)?.text ?? formData.country}
            selectedOptions={formData.country ? [formData.country] : []}
            onOptionSelect={handleCountryChange}
            className={classes.stateDropdown}
            positioning="below-start"
          >
            {COUNTRIES.map((country) => (
              <Option key={country.key} value={country.key}>
                {country.text}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <AddressAutocomplete
          value={formData.address}
          onChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          disabled={disabled}
          countryCode={formData.country === "OTHER" ? undefined : formData.country}
        />
        {/* Grid layout for city, state, and zip - side by side on desktop, stacked on mobile */}
        <div className={classes.cityStateZipGrid}>
          <Field required label="City">
            <Input
              disabled={disabled}
              value={formData.city}
              onChange={handleCityChange}
            />
          </Field>
          <Field required label="State/Province">
            {formData.country === "US" ? (
              <Dropdown
                disabled={disabled}
                placeholder="Select a state"
                value={US_STATES.find((s) => s.key === formData.state)?.text ?? formData.state}
                selectedOptions={formData.state ? [formData.state] : []}
                onOptionSelect={handleStateChange}
                className={classes.stateDropdown}
                positioning="below-start"
                listbox={{ className: classes.stateDropdownListbox }}
              >
                {US_STATES.map((state) => (
                  <Option key={state.key} value={state.key}>
                    {state.text}
                  </Option>
                ))}
              </Dropdown>
            ) : (
              <Input
                disabled={disabled}
                value={formData.state}
                onChange={handleStateChange}
                placeholder="Enter state/province"
              />
            )}
          </Field>
          <Field required label={formData.country === "US" ? "Zip Code" : "Postal Code"}>
            <Input
              disabled={disabled}
              value={formData.zipCode}
              onChange={handleZipCodeChange}
            />
          </Field>
        </div>
        <div ref={bibNumberFieldRef}>
          <Field required label="Requested Bib Number">
            <Input
              disabled={disabled}
              value={formData.bibNumber}
              onChange={handleBibNumberChange}
            />
            {/* Show warning during typing if entry is non-numeric and no error is showing */}
            {showBibNumberWarning && !showBibNumberError && (
              <FieldWarning message="Entry must be a number" />
            )}
            {/* Show error after failed submission until user starts typing */}
            {showBibNumberError && (
              <FieldError message="Entry must be a number" />
            )}
          </Field>
        </div>
        <Field required label="What name do you want on your bib?">
          <Input
            disabled={disabled}
            value={formData.bibName}
            onChange={handleBibNameChange}
          />
        </Field>
        <div ref={emailFieldRef}>
          <Field required label="Email">
            <Input
              disabled={disabled}
              value={formData.email}
              onChange={handleEmailChange}
            />
            {/* Show error after failed submission until user starts typing */}
            {showEmailError && (
              <FieldError message="Email must be a valid email address" />
            )}
          </Field>
        </div>
        <Field required label="Phone Number">
          <Input
            disabled={disabled}
            type="tel"
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Field>
        <Field required label="Emergency Contact (Name And Phone Number)">
          <Input
            disabled={disabled}
            value={formData.emergencyContact}
            onChange={handleEmergencyContactChange}
          />
        </Field>
        
        <Field label="Comments">
          <Textarea
            disabled={disabled}
            value={formData.comments}
            onChange={handleCommentsChange}
          />
        </Field>
        
      </div>
      <Button disabled={disabled} appearance="primary" type="submit">
        Submit
      </Button>
      <Toaster />
    </form>
    
  );
};


