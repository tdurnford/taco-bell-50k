import HeroImage from "../images/hero-banner.png";

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
});

export const HeroBanner = () => {
  const classes = useStyles();
  return (
    <div className={classes.heroBanner}>
      <h1>IT’S ALMOST TACO TIME!</h1>
      <p>Join us for a fun-filled day of running and excitement.</p>
    </div>
  );
};
