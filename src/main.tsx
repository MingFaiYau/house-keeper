import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Log version on load
// @ts-expect-error __APP_VERSION__ is defined in vite.config.ts
const APP_VERSION = __APP_VERSION__ || 'dev';
console.log(`[App] Version: ${APP_VERSION}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
