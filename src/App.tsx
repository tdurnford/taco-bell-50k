import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import { HeroBanner } from "./components/Banner";
import { RaceDescription } from "./components/Description";
import { RaceDetails } from "./components/Details";
import { Registration } from "./components/Register";
import { Rules } from "./components/Rules";

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div>
        <HeroBanner />
        <RaceDescription />
        <RaceDetails />
        <Rules />
        <Registration />
      </div>
    </FluentProvider>
  );
}

export default App;
