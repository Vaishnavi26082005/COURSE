import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RUG9fIjnqkP0Bf3B2I4PWS4U0pDvBZKys9liXFt8yae39GxHFzBr61KY9ECD2Ur3S6ItQ2pk0GddPlVHnZqPKNZ00SXavIlgk")

createRoot(document.getElementById('root')).render(
 <Elements  stripe={stripePromise}>
   <BrowserRouter>
   <App />
</BrowserRouter>
 </Elements>


 
)
