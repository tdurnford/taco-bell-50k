import { FormEventHandler, type FC, useCallback, useState } from "react";
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

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      submit(formData);
    },
    [formData, submit]
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
      setFormData((currentData) =>
        produce(currentData, (draft) => {
          if (isNaN(Number(value))) {
            return;
          }
          draft.bibNumber = value;
        })
      );
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
        <Field required label="Address">
          <Input
            disabled={disabled}
            value={formData.address}
            onChange={handleAddressChange}
          />
        </Field>
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
        <Field required label="Requested Bib Number">
          <Input
            disabled={disabled}
            value={formData.bibNumber}
            onChange={handleBibNumberChange}
          />
        </Field>
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


