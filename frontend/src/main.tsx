
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'


// Get the  root element
const rootElement = document.getElementById('root');

// Ensure rootElement is not null before creating root
if (rootElement) {
    // Create the root React element
    const root = createRoot(rootElement);
    // Render the App component
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
}else{
  console.error('Error: Could not find #root element');
}
