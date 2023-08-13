import { HeroBanner } from "./components/Banner";
import { RaceDescription } from "./components/Description";
import { RaceDetails } from "./components/Details";
import { Registration } from "./components/Register";
import { Rules } from "./components/Rules";

function App() {
  return (
    <div>
      <HeroBanner />
      <RaceDescription />
      <RaceDetails />
      <Rules />
      <Registration />
    </div>
  );
}

export default App;
