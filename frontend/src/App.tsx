import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import LandingPage from './pages/LandingPage'
import InputPage from './pages/InputPage'
import JobDescriptionPage from './pages/JobDescriptionPage'
import AnalysisPage from './pages/AnalysisPage'
import JDMatchingPage from './pages/JDMatchingPage'
import ResumeRewritePage from './pages/ResumeRewritePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/job-description" element={<JobDescriptionPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/matching" element={<JDMatchingPage />} />
          <Route path="/rewrite" element={<ResumeRewritePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
