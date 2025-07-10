
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import './api/applicationHandler';

const PUBLISHABLE_KEY = "pk_test_ZW5nYWdpbmctdGljay04NS5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        elements: {
          logoBox: {
            height: "6rem"
          }
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
