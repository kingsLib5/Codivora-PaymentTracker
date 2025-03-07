import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PaymentTracker from './PaymentTracker'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaymentTracker />
  </StrictMode>,
)
