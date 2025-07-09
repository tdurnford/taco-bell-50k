import {
  FluentProvider,
  makeStyles,
} from "@fluentui/react-components";

import { RegistrationForm } from "../components/RegistrationFrom";

// Import light theme for Fluent UI components
import { lightTheme } from "../App";
// Logo (pinto bean awakens)
import pintoBeanAwakens from '../images/pinto-bean-awakens.png';

const useStyles = makeStyles({
  background: {
    backgroundColor: "#311D63",
    /* Large amount of padding on top and bottom, none on sides */
    /* Makes the registration content appear as a card */
    padding: "100px 0px",
    "@media screen and (max-width: 600px)": {
      // Shrink padding on mobile
      padding: "20px 20px",
    },
  },
  content: {
    width: "75%",
    maxWidth: "800px",
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "48px",
    "@media screen and (max-width: 600px)": {
      // Use unset to all content to take up 
      // the full width on mobile, minus the 20px padding
      // in background, above
      width: "unset",
      padding: "48px 20px",
    },
  },
  pintoBeanAwakens: {
    width: "20%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    // marginBottom: "20px",
  },
});

function Register() {
  // Hooks
  const classes = useStyles();

  // Component
  return (
      <FluentProvider theme={lightTheme}>
        <div className={classes.background}>
          <div className={classes.content}>
            <img src={pintoBeanAwakens} alt="Taco Bell 50K unofficial logo. A cracked bell with the text 'the Pinto Bean Awakens'." className={classes.pintoBeanAwakens} />
            <RegistrationForm />
          </div>
        </div>
      </FluentProvider>
    );
}

export default Register;