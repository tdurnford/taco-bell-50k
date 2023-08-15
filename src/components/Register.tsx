import { FormEventHandler, useCallback, useState } from "react";
import {
  Field,
  Input,
  InputProps,
  Button,
  makeStyles,
} from "@fluentui/react-components";
import { produce } from "immer";

const useStyles = makeStyles({
  registrationForm: {
    marginBottom: "12px",
  },
});

type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phoneNumber: string;
  additionalDetails: string;
};

export const Registration = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    age: "0",
    email: "",
    phoneNumber: "",
    additionalDetails: "",
  });

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      console.log("Sending email  with form data:", formData);

      setFormData({
        firstName: "",
        lastName: "",
        age: "0",
        email: "",
        phoneNumber: "",
        additionalDetails: "",
      });
    },
    [formData]
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
          draft.age = value;
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
        <Field required label="Age">
          <Input
            type="number"
            value={formData.age.toString()}
            onChange={handleAgeChange}
          />
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
        <Field label="Additional Details">
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
    </form>
  );
};
