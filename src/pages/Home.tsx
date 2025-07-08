import {
  FluentProvider,
  makeStyles,
  shorthands,
  Button,
} from "@fluentui/react-components";

import { HeroBanner } from "../components/Banner";
import { RaceDescription } from "../components/Description";
import { RaceDetails } from "../components/Details";
import { Rules } from "../components/Rules";
import { Countdown } from "../components/Countdown";
//import { NewsLetter } from "../components/NewsLetter";
import { Donate } from "../components/Donate";

// Import light theme for Fluent UI components
import { lightTheme } from "../App";
// React Router to navigate to registration page
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  content: {
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    ...shorthands.padding("48px"),
    "@media screen and (max-width: 600px)": {
      ...shorthands.padding("48px", "20px"),
    },
  },
  registerButton: {
    fontSize: "1.25rem",
    padding: "12px 72px",
    margin: "48px auto 8px auto",
    display: "block",
  },
});

function Home() {
  // Hooks
  const classes = useStyles();
  const navigate = useNavigate();

  // Handlers
  const handleGoToRegistration = () => {
    navigate("/register", { preventScrollReset: false });
  };

  // Component
  return (
      <FluentProvider theme={lightTheme}>
        <div>
          <HeroBanner />
          <Countdown />
          <div className={classes.content}>
            <RaceDescription />
            <RaceDetails />
            <Rules />
            {/* <Videos /> */}
            <Button onClick={handleGoToRegistration} appearance="primary" className={classes.registerButton}>Register</Button>
            <Donate />
          </div>
        </div>
      </FluentProvider>
    );
}

export default Home;