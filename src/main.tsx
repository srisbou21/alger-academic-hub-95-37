import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import { AcademicYearProvider } from './contexts/AcademicYearContext'
import { TimetableProvider } from './contexts/TimetableContext'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AuthProvider>
      <AcademicYearProvider>
        <TimetableProvider>
          <App />
        </TimetableProvider>
      </AcademicYearProvider>
    </AuthProvider>
  </ErrorBoundary>
);
