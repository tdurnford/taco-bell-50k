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
  Spinner,
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
  email: string;
};

type Props = {
  disabled?: boolean;
};

export const NewsLetter: FC<Props> = ({ disabled }) => {
  const classes = useStyles();
  const { dispatchToast } = useToastController();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const submit = useSubmit<FormData>("mpzgkybb", {
    onError: () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
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
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
      dispatchToast(
        <Toast>
          <ToastTitle>
            You successfully signed up for our news letter!
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
      setIsLoading(true);
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

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h2>Sign up for our news letter</h2>
      <p>Registration for next year will open in spring 2024</p>
      <p>
        Sign up for our news letter to be notified when registration opens and
        for other important updates
      </p>
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
        <Field required label="Email">
          <Input
            disabled={disabled}
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
          />
        </Field>
      </div>
      <Button
        icon={isLoading ? <Spinner size="tiny" /> : undefined}
        disabled={disabled || isLoading}
        appearance="primary"
        type="submit"
      >
        Submit
      </Button>
      <Toaster />
    </form>
  );
};
