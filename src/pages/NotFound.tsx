// Theming via Fluent UI
import {
  FluentProvider,
  makeStyles,
  shorthands,
  Button,
} from "@fluentui/react-components";
import { lightTheme } from "../App";
// 404 Image
import HeroImage from "../images/not-found-image.png";

// CSS styles for component
const useStyles = makeStyles({
  // Styles for 404 image
  heroBanner: {
    backgroundImage: `url(${HeroImage})`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#211125",
    textAlign: "center",
    ...shorthands.padding("20px"),

    "@media screen and (max-width: 600px)": {
      backgroundPositionX: "calc(100% + 100px)",
      height: "60vh",
      width: "100%"
    },
    "& h1": {
      fontSize: "5rem",
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
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "1.5rem",
    lineHeight: "3rem",
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
  // // Cotaining element for buttons
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

const NotFound = () => {
  const classes = useStyles();

  return (
    <FluentProvider theme={lightTheme}>
      <div className={classes.heroBanner}>
        <h1>Not Found</h1>
      </div>
      <div className={classes.content}>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </FluentProvider>
  );
};

export default NotFound;
