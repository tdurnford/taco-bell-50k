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
        <Toast>
          <ToastTitle>Something went wrong!</ToastTitle>
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
        <Toast>
          <ToastTitle>You registered successfully!</ToastTitle>
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
          if (isNaN(Number(value))) {
            return;
          }
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
      <h2>Register for the Race</h2>
      {disabled ? (
        <p>Registration is currently closed. Please check back later.</p>
      ) : null}
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
        <Field required label="Name On Bib">
          <Input
            disabled={disabled}
            value={formData.bibName}
            onChange={handleBibNumberChange}
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
