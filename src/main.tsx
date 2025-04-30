
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Display a helpful message about Supabase configuration
console.info(
  "🔌 FlightLens AI is starting up. Make sure you have configured your Supabase credentials in the environment variables."
);

createRoot(document.getElementById("root")!).render(<App />);
