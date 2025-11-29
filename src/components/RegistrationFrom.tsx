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
  address: string;
  city: string;
  state: string;
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

  // Ref to the bib number field for scrolling to it when validation fails
  // This allows us to programmatically scroll to the field to show the user the error
  const bibNumberFieldRef = useRef<HTMLDivElement>(null);

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

    // Additional validation rules can be added here
    // Example:
    // if (formData.email && !isValidEmail(formData.email)) {
    //   errors.push("'Email' must be a valid email address");
    // }

    return errors;
  }, [formData.bibNumber]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      // Validate the form before submission
      const errors = validateForm();

      // If there are validation errors, display them and prevent submission
      if (errors.length > 0) {
        // Scroll to the first field with an error so user can see it
        // Currently only bib number has validation, but this pattern can be extended
        // to handle multiple validation errors by tracking which field errored first
        if (bibNumberFieldRef.current) {
          bibNumberFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit the form to Formspree
      submit(formData);
    },
    [formData, submit, validateForm]
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
    },
    []
  );

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

  // Handler for state dropdown selection
  // Uses DropdownProps onChange signature which provides selectedOptions array
  const handleStateChange = useCallback<
    NonNullable<DropdownProps["onOptionSelect"]>
  >((_, data) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        // Extract the selected state value from the dropdown data
        draft.state = data.optionValue ?? "";
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
        <AddressAutocomplete
          value={formData.address}
          onChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          disabled={disabled}
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
          <Field required label="State">
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
          </Field>
          <Field required label="Zip Code">
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
        <Field required label="Email">
          <Input
            disabled={disabled}
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
          />
        </Field>
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


