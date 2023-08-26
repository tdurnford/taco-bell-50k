import {
  BrandVariants,
  FluentProvider,
  Theme,
  createLightTheme,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";

import { HeroBanner } from "./components/Banner";
import { RaceDescription } from "./components/Description";
import { RaceDetails } from "./components/Details";
import { Registration } from "./components/Register";
import { Rules } from "./components/Rules";
import { Countdown } from "./components/Countdown";
import { Videos } from "./components/Videos";

const brandVariants: BrandVariants = {
  10: "#050205",
  20: "#211125",
  30: "#391741",
  40: "#4D1B58",
  50: "#621E71",
  60: "#742685",
  70: "#7F398F",
  80: "#8B4A98",
  90: "#965BA2",
  100: "#A26BAB",
  110: "#AD7CB5",
  120: "#B88DBF",
  130: "#C39EC8",
  140: "#CEAFD2",
  150: "#D9C0DC",
  160: "#E3D1E6",
};

const lightTheme: Theme = {
  ...createLightTheme(brandVariants),
};

const useStyles = makeStyles({
  content: {
    ...shorthands.padding("48px"),
    "@media screen and (max-width: 600px)": {
      ...shorthands.padding("48px", "20px"),
    },
  },
});

function App() {
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
          <Videos />
          <Registration />
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
