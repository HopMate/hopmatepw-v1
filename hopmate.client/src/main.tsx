/**
 * @file main.tsx
 * @description This file is the entry point of the React application. It renders the main App component into the root element of the HTML document.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);