import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router'
import {Toaster} from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!bg-base-100 !text-base-content !font-mono !text-sm !shadow-xl !ring-1 !ring-base-content/10",
          duration: 3000,
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
