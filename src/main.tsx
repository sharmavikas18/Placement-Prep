import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <ThemeProvider>
      <App />
    </ThemeProvider>

    <ErrorBoundary>
      <App />
    </ErrorBoundary>

  </StrictMode>
);
