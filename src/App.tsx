/* Multi-page app via router */
/* This was added to show a confirmation page with a donation link to Achilles to users when submitting registration info. */
/* This can be expanded in the future. */ 

/* Import Router and page components */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Confirmation from './pages/Confirmation';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Create light theme for Fluent UI components
// This is used on multiple pages, and thus is defined here
import {
  BrandVariants,
  Theme,
  createLightTheme,
} from "@fluentui/react-components";

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

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmation" element={<Confirmation />} />
        {/* Pass formspreeEndpoint prop to Register component for 2025 */}
        <Route
          path="/register/2025"
          element={<Register formspreeEndpoint="myzgjwkp" />}
        />
        {/* New registration route for 2026 */}
        <Route
          path="/register/2026"
          element={
            // TODO: replace with actual 2026 Formspree endpoint ID
            <Register formspreeEndpoint="YOUR_2026_ENDPOINT_ID" />
          }
        />
        {/* Add a catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Export the light theme for use in other components
export { lightTheme };

export default App;
