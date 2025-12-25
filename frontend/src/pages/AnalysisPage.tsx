import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import Badge from '../components/Badge'
import ScoreCircle from '../components/ScoreCircle'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useAnalysis } from '../hooks/useAnalysis'
import { useResume } from '../hooks/useResume'
import { Severity } from '../services/api'

export default function AnalysisPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(0)

  // Get resumeId from navigation state or URL
  const { resumeId } = (location.state as { resumeId?: string; role?: string }) || {}

  const { analysis, isLoading: isLoadingAnalysis, error: analysisError, fetchAnalysis, clearError: clearAnalysisError } = useAnalysis()
  const { resume, isLoading: isLoadingResume, error: resumeError, fetchResume, clearError: clearResumeError } = useResume()

  const isLoading = isLoadingAnalysis || isLoadingResume
  const error = analysisError || resumeError

  const clearError = () => {
    clearAnalysisError()
    clearResumeError()
  }

  // Fetch analysis data when component mounts
  useEffect(() => {
    if (resumeId) {
      fetchAnalysis(resumeId).catch(() => {
        // Error is handled by hook
      })
      fetchResume(resumeId).catch(() => {
        // Error is handled by hook
      })
    }
  }, [resumeId, fetchAnalysis, fetchResume])

  // Helper to count suggestions by severity
  const countBySeverity = (severity: Severity) => {
    return analysis?.suggestions.filter(s => s.severity === severity).length || 0
  }

  // Helper to get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-score-good'
    if (score >= 60) return 'text-score-mid'
    return 'text-score-bad'
  }

  // Helper to get score bg color class
  const getScoreBgClass = (score: number) => {
    if (score >= 80) return 'bg-score-good'
    if (score >= 60) return 'bg-score-mid'
    return 'bg-score-bad'
  }

  // Show loading state
  if (isLoading && !analysis) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Analyzing your resume..." />
          <p className="mt-4 text-slate-500 dark:text-slate-400">This may take a few moments</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !analysis) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage
            error={error}
            onRetry={() => {
              clearError()
              if (resumeId) {
                fetchAnalysis(resumeId)
              }
            }}
          />
          <div className="mt-4 text-center">
            <Link to="/input" className="text-primary hover:text-primary/80 text-sm font-medium">
              Upload a new resume
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Use analysis data or fallback defaults for display
  const scores = analysis?.scores || { overall: 0, clarity: 0, impact: 0, atsFriendliness: 0, technicalDepth: 0 }
  const suggestions = analysis?.suggestions || []
  const fileName = resume?.fileName || 'Resume'
  const generatedAt = analysis?.generatedAt ? new Date(analysis.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282e39] bg-white/80 dark:bg-[#111318]/90 backdrop-blur-md px-4 py-3 md:px-10">
          <Link to="/" className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Resumelint</h2>
          </Link>
          <div className="flex flex-1 justify-end gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" to="/">Dashboard</Link>
              <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">History</a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Settings</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="primary" size="sm">Upload New Resume</Button>
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-slate-200 dark:ring-slate-700 cursor-pointer" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=2")'}}></div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 justify-center py-8 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col max-w-[1200px] flex-1 w-full gap-8">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-4">
              <Breadcrumb items={[
                { label: 'Upload Resume', href: '/input' },
                { label: 'Analysis Results' }
              ]} />
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
                    Analysis for <span className="text-primary">{fileName}</span>
                  </h1>
                  <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal">
                    Generated on {generatedAt} - AI Model v2.1 - {resume?.role || 'Software Engineer'} Profile
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">download</span>}>
                    Export PDF
                  </Button>
                  <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">share</span>}>
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Scores Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Overall Score Card */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-8 shadow-sm">
                <ScoreCircle score={scores.overall} />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {scores.overall >= 80 ? 'Excellent Score' : scores.overall >= 60 ? 'Good Score' : 'Needs Improvement'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                    {analysis?.summary || 'Your resume has been analyzed. Review the suggestions below to improve your score.'}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Metric: Clarity */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${scores.clarity >= 80 ? 'bg-score-good/10 text-score-good' : scores.clarity >= 60 ? 'bg-score-mid/10 text-score-mid' : 'bg-score-bad/10 text-score-bad'}`}>
                        <span className="material-symbols-outlined">visibility</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Clarity & Brevity</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{scores.clarity}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`${getScoreBgClass(scores.clarity)} h-2 rounded-full`} style={{width: `${scores.clarity}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {scores.clarity >= 80 ? 'Excellent use of active verbs and concise structure.' : scores.clarity >= 60 ? 'Good structure, some improvements possible.' : 'Consider restructuring for better clarity.'}
                  </p>
                </div>

                {/* Metric: Impact */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${scores.impact >= 80 ? 'bg-score-good/10 text-score-good' : scores.impact >= 60 ? 'bg-score-mid/10 text-score-mid' : 'bg-score-bad/10 text-score-bad'}`}>
                        <span className="material-symbols-outlined">bolt</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Business Impact</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{scores.impact}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`${getScoreBgClass(scores.impact)} h-2 rounded-full`} style={{width: `${scores.impact}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {scores.impact >= 80 ? 'Great quantification of achievements.' : scores.impact >= 60 ? 'Add more metrics to strengthen impact.' : 'Needs more metrics. Quantify your achievements.'}
                  </p>
                </div>

                {/* Metric: ATS */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${scores.atsFriendliness >= 80 ? 'bg-score-good/10 text-score-good' : scores.atsFriendliness >= 60 ? 'bg-score-mid/10 text-score-mid' : 'bg-score-bad/10 text-score-bad'}`}>
                        <span className="material-symbols-outlined">rule</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">ATS Friendliness</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{scores.atsFriendliness}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`${getScoreBgClass(scores.atsFriendliness)} h-2 rounded-full`} style={{width: `${scores.atsFriendliness}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {scores.atsFriendliness >= 80 ? 'Formatting is parseable by most ATS systems.' : scores.atsFriendliness >= 60 ? 'Some formatting may cause ATS issues.' : 'Significant ATS compatibility issues detected.'}
                  </p>
                </div>

                {/* Metric: Technical Depth */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${scores.technicalDepth >= 80 ? 'bg-score-good/10 text-score-good' : scores.technicalDepth >= 60 ? 'bg-score-mid/10 text-score-mid' : 'bg-score-bad/10 text-score-bad'}`}>
                        <span className="material-symbols-outlined">code</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Technical Depth</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{scores.technicalDepth}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`${getScoreBgClass(scores.technicalDepth)} h-2 rounded-full`} style={{width: `${scores.technicalDepth}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {scores.technicalDepth >= 80 ? 'Strong technical details and skills.' : scores.technicalDepth >= 60 ? 'Consider adding more technical details.' : 'Missing key technical skills for your target role.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Detailed Suggestions */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Suggestions</h2>
                  <div className="flex gap-2">
                    {countBySeverity('critical') > 0 && (
                      <Badge variant="error">{countBySeverity('critical')} Critical</Badge>
                    )}
                    {countBySeverity('warning') > 0 && (
                      <Badge variant="warning">{countBySeverity('warning')} Warnings</Badge>
                    )}
                    {countBySeverity('info') > 0 && (
                      <Badge variant="info">{countBySeverity('info')} Info</Badge>
                    )}
                  </div>
                </div>

                {suggestions.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card-light dark:bg-card-dark p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-green-500 mb-4">check_circle</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No suggestions</h3>
                    <p className="text-slate-500 dark:text-slate-400">Your resume is looking great! No major improvements needed.</p>
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <div key={suggestion.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card-light dark:bg-card-dark overflow-hidden shadow-sm">
                      <div
                        onClick={() => setExpandedSuggestion(expandedSuggestion === index ? null : index)}
                        className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${
                            suggestion.severity === 'critical' ? 'text-score-bad' :
                            suggestion.severity === 'warning' ? 'text-score-mid' : 'text-primary'
                          }`}>
                            {suggestion.severity === 'critical' ? 'error' :
                             suggestion.severity === 'warning' ? 'warning' : 'info'}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{suggestion.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{suggestion.section} - {suggestion.severity}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">
                          {expandedSuggestion === index ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                      {expandedSuggestion === index && (
                        <div className="p-6">
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            {suggestion.description}
                          </p>
                          {suggestion.reasoning && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 italic">
                              {suggestion.reasoning}
                            </p>
                          )}
                          {(suggestion.originalText || suggestion.suggestedText) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {suggestion.originalText && (
                                <div className="rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4">
                                  <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-sm">close</span> Original
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">{suggestion.originalText}</p>
                                </div>
                              )}
                              {suggestion.suggestedText && (
                                <div className="rounded-lg border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 p-4">
                                  <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-sm">check</span> Suggested Rewrite
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">{suggestion.suggestedText}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <Link
                              to="/rewrite"
                              state={{ resumeId, suggestionId: suggestion.id }}
                              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                            >
                              Auto-fix with AI <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Sticky Actions */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 flex flex-col gap-6">
                  {/* Action Card */}
                  <div className="rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Improve this Resume</h3>
                    <div className="flex flex-col gap-3">
                      <Link to="/rewrite" state={{ resumeId }}>
                        <Button className="w-full" icon={<span className="material-symbols-outlined">auto_fix_high</span>}>
                          Rewrite with AI
                        </Button>
                      </Link>
                      <Link to="/job-description" state={{ resumeId }}>
                        <Button variant="secondary" className="w-full" icon={<span className="material-symbols-outlined">compare_arrows</span>}>
                          Match Job Description
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
