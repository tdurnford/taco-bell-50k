import {
  FluentProvider,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";

import { HeroBanner } from "../components/Banner";
import { RaceDescription } from "../components/Description";
import { RaceDetails } from "../components/Details";
import { Rules } from "../components/Rules";
import { Countdown } from "../components/Countdown";
//import { NewsLetter } from "../components/NewsLetter";
import { Registration } from "../components/Register";
import { Donate } from "../components/Donate";

// Import light theme for Fluent UI components
import { lightTheme } from "../App";

const useStyles = makeStyles({
  content: {
    maxWidth: "800px",
    ...shorthands.padding("48px"),
    "@media screen and (max-width: 600px)": {
      ...shorthands.padding("48px", "20px"),
    },
  },
});

function Home() {
  const classes = useStyles();
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
            <Registration />
            <Donate />
          </div>
        </div>
      </FluentProvider>
    );
}

export default Home;