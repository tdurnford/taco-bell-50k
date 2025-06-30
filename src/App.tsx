/* Multi-page app via router */
/* This was added to show a confirmation page with a donation link to Achilles to users when submitting registration info. */
/* This can be expanded in the future. */ 

/* Import outer and page components */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
