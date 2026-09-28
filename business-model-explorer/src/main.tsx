import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { calculateProjection } from "./model/calculateProjection";
import { baselineCompany } from "./data/baselineCompany";

console.log(calculateProjection(baselineCompany));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
