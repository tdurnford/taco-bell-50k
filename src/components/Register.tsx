import { FormEventHandler, useCallback, useState } from "react";
import { Field, Input, InputProps, Button } from "@fluentui/react-components";
import { produce } from "immer";

type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phoneNumber: string;
  additionalDetails: string;
};

export const Registration = () => {
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
      <div className="form-group">
        <Field label="First Name">
          <Input
            type="text"
            value={formData.firstName}
            onChange={handleFirstNameChange}
            required
          />
        </Field>
      </div>
      <div className="form-group">
        <Field label="Last Name">
          <Input
            type="text"
            value={formData.lastName}
            onChange={handleLastNameChange}
            required
          />
        </Field>
      </div>
      <div className="form-group">
        <Field label="Age">
          <Input
            type="number"
            value={formData.age.toString()}
            onChange={handleAgeChange}
            required
          />
        </Field>
      </div>
      <div className="form-group">
        <Field label="Email">
          <Input
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            required
          />
        </Field>
      </div>
      <div className="form-group">
        <Field label="Phone Number">
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
            required
          />
        </Field>
      </div>
      <div className="form-group">
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
