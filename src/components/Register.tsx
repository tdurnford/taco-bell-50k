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
} from "@fluentui/react-components";
import { produce } from "immer";
import { useSubmit } from "@formspree/react";

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
  emergencyContact: string;
  phoneNumber: string;
  comments: string;
};

type Props = {
  disabled?: boolean;
};

export const Registration: FC<Props> = ({ disabled }) => {
  const classes = useStyles();
  const { dispatchToast } = useToastController();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bibNumber: "",
    bibName: "",
    email: "",
    address: "",
    emergencyContact: "",
    phoneNumber: "",
    comments: "",
  });

  const submit = useSubmit<FormData>("myzgjwkp", {
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
        emergencyContact: "",
        phoneNumber: "",
        comments: "",
      });
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
      <h2>Register for the Race</h2>
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


