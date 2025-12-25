import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Context
import { AuthProvider } from './context/AuthContext'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import InputPage from './pages/InputPage'
import JobDescriptionPage from './pages/JobDescriptionPage'
import AnalysisPage from './pages/AnalysisPage'
import JDMatchingPage from './pages/JDMatchingPage'
import ResumeRewritePage from './pages/ResumeRewritePage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/input" element={<InputPage />} />

            {/* Protected Routes */}
            <Route
              path="/job-description"
              element={
                <ProtectedRoute>
                  <JobDescriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <AnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matching"
              element={
                <ProtectedRoute>
                  <JDMatchingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewrite"
              element={
                <ProtectedRoute>
                  <ResumeRewritePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
