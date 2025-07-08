// This script is intended to be used to test the app
// It currently only checks if the app renders without crashing
import { render } from '@testing-library/react';
import App from './App';

test('Runs without crashing', () => {
  render(<App />);
});
