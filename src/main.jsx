/* main.jsx job: render the App components (acts as the building itself) */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render( /* App render structure */
  <StrictMode>
    <BrowserRouter>  {/* Wrap the App component with BrowserRouter to enable routing */ }
      <App />
    </BrowserRouter>
  </StrictMode>
)