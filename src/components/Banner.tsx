import HeroImage from "../images/tb50k-banner.png";

import { makeStyles, shorthands } from "@fluentui/react-components";

const useStyles = makeStyles({
  heroBanner: {
    backgroundImage: `url(${HeroImage})`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    ...shorthands.padding("20px"),
  },
  textContainer: {
    backgroundColor: "rgba(116, 38, 133, 0.6)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    marginTop: "350px",
    alignItems: "center",
    ...shorthands.padding("20px", "40px"),
    ...shorthands.borderRadius("8px"),
    "& h1": {
      fontSize: "40px",
      fontWeight: "bold",
      lineHeight: "1.2",
      ...shorthands.margin("0", "0", "12px", "0"),
    },
    "& p": {
      fontSize: "20px",
      ...shorthands.margin("0"),
    },
  },
});

export const HeroBanner = () => {
  const classes = useStyles();
  return (
    <div className={classes.heroBanner}>
      <div className={classes.textContainer}>
        <h1>IT’S ALMOST TACO TIME!</h1>
        <p>Join us for a fun-filled day of running and excitement.</p>
      </div>
    </div>
  );
};
