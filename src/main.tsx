
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import utility functions to ensure they're loaded
import './scripts/utilityFunctions.ts'

createRoot(document.getElementById("root")!).render(<App />);
