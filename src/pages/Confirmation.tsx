// Theming via Fluent UI
import {
  FluentProvider,
  makeStyles,
  shorthands,
  Button,
} from "@fluentui/react-components";
import { lightTheme } from "../App";
// Achilles logo
import achillesLogo from '../images/achilles-logo.png';
// React Router to progammatically navigate back to home 
import { useNavigate } from "react-router-dom";

// "Hero" banner with desert taco image
import HeroImage from "../images/hero-banner.png";

// CSS styles for component
const useStyles = makeStyles({
  // Styles for desert taco image
  heroBanner: {
    backgroundImage: `url(${HeroImage})`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    ...shorthands.padding("20px"),

    "@media screen and (max-width: 600px)": {
      backgroundPositionX: "calc(100% + 100px)",
    },
    "& h1": {
      fontSize: "40px",
      fontWeight: "bold",
      lineHeight: "1.2",
      ...shorthands.margin("20px"),
    },
    "& p": {
      fontSize: "20px",
      ...shorthands.margin("0"),
    },
  },
  // Main content
  content: {
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    ...shorthands.padding("48px"),
    "@media screen and (max-width: 600px)": {
      ...shorthands.padding("48px", "20px"),
    },
  },
  // Achilles logo
  achillesLogo: {
    height: '200px',
    margin: '20px auto',
    display: 'block',
  },
  // Cotaining element for buttons
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    '& button': {
      // Root element width (rem) is defined in 
      // index.css, in the html element
      fontSize: '1rem',
      padding: '12px 24px',
    },
  }
});

// Confirmation page component
const Confirmation = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <FluentProvider theme={lightTheme}>
      <div className={classes.heroBanner}>
        <h1>Registration Confirmed!</h1>
      </div>
      <div className={classes.content}>
        <h2>You're in! Thanks for registering.</h2>
        <p>Registration for the Taco Bell 50K is free, but please consider supporting our charity partner, Achilles International.</p>

        <p> Achilles International is a 501(c)(3) nonprofit organization that pairs runners with disabilites with volunteer guides, aiming to create a community of all abilities through sport. Founded in 1983, Achilles has chapters worldwide, including in Denver, Colorado.</p>
          
        <p>The Denver chapter has operated since 2013 and has helped many athletes achieve their running goals. Achilles organizes weekly runs every Monday at the Washington Park Rec Center, and quarterly races for athletes. Achilles International Denver relies on donations and volunteers to continue its mission, and is an important source of community for both runners and guides. So far, two blind runners are Taco Bell 50K Survivors!</p>

        <p>All proceeds go directly to disabled runners in the Denver area for race entry fees, running shoes, and running-related equipment.</p>

        <p>Thank you for your support!</p>

        {/* Achilles logo */}
        <img src={achillesLogo} alt="Achilles International Denver Logo" className={classes.achillesLogo} />

        {/* Donate button: goes to Achilles fundraising page */}
        <div className={classes.buttonContainer}>
          <Button onClick={() => window.location.href = "https://give.achillesinternational.org/campaign/achilles-denver/c384648"} appearance="primary">Donate</Button>
          {/* Return to home screen */}
          <Button onClick={handleBackToHome}>Back to Home</Button>
        </div>
      </div>
    </FluentProvider>
  );
};

export default Confirmation;
