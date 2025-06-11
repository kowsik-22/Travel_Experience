import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-day-picker/style.css"
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const clientid = "1048816973781-jvo3hma7kmqjgiv94qsg00okur4lrk5a.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientid}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
