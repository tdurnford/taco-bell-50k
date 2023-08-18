import { FormEventHandler, useCallback, useState } from "react";
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
} from "@fluentui/react-components";
import { produce } from "immer";
import { useSubmit } from "@formspree/react";

const useStyles = makeStyles({
  registrationForm: {
    marginBottom: "12px",
  },
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SIMPLE_FORM_ID: string;
    }
  }
}

type FormData = {
  firstName: string;
  lastName: string;
  bibNumber: string;
  email: string;
  phoneNumber: string;
  additionalDetails: string;
};

export const Registration = () => {
  const classes = useStyles();
  const { dispatchToast } = useToastController();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bibNumber: "",
    email: "",
    phoneNumber: "",
    additionalDetails: "",
  });

  const submit = useSubmit<FormData>(process.env.REACT_APP_SIMPLE_FORM_ID);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      console.log("Sending email  with form data:", formData);

      submit(formData)
        .then(() => {
          dispatchToast(
            <Toast>
              <ToastTitle>You registered successfully!</ToastTitle>
            </Toast>,
            {
              intent: "success",
            }
          );
          setFormData({
            firstName: "",
            lastName: "",
            bibNumber: "",
            email: "",
            phoneNumber: "",
            additionalDetails: "",
          });
        })
        .catch(() => {
          dispatchToast(
            <Toast>
              <ToastTitle>Something went wrong!</ToastTitle>
            </Toast>,
            {
              intent: "error",
            }
          );
        });
    },
    [dispatchToast, formData, submit]
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

  const handleAgeChange = useCallback<NonNullable<InputProps["onChange"]>>(
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

  const handleAdditionalDetailsChange = useCallback<
    NonNullable<InputProps["onChange"]>
  >((_, { value }) => {
    setFormData((currentData) =>
      produce(currentData, (draft) => {
        draft.additionalDetails = value;
      })
    );
  }, []);

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h2>Register for the Race</h2>
      <div className={classes.registrationForm}>
        <Field required label="First Name">
          <Input
            type="text"
            value={formData.firstName}
            onChange={handleFirstNameChange}
          />
        </Field>
        <Field required label="Last Name">
          <Input
            type="text"
            value={formData.lastName}
            onChange={handleLastNameChange}
          />
        </Field>
        <Field required label="Bib number">
          <Input value={formData.bibNumber} onChange={handleAgeChange} />
        </Field>
        <Field required label="Email">
          <Input
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
          />
        </Field>
        <Field required label="Phone Number">
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Field>
        <Field label="Tell us your inspirational food or stupidity stories!">
          <Input
            multiple
            value={formData.additionalDetails}
            onChange={handleAdditionalDetailsChange}
          />
        </Field>
      </div>
      <Button appearance="primary" type="submit">
        Submit
      </Button>
      <Toaster />
    </form>
  );
};
