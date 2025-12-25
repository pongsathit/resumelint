import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ScoreCircle from '../components/ScoreCircle'
import Badge from '../components/Badge'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useMatch } from '../hooks/useMatch'
import { useResume } from '../hooks/useResume'

export default function JDMatchingPage() {
  const location = useLocation()
  const { resumeId } = (location.state as { resumeId?: string }) || {}

  const { match, isLoading: isLoadingMatch, error: matchError, clearError } = useMatch()
  const { resume, fetchResume, isLoading: isLoadingResume } = useResume()

  const isLoading = isLoadingMatch || isLoadingResume
  const error = matchError

  // Fetch resume details
  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId).catch(() => {})
    }
  }, [resumeId, fetchResume])

  // Get match data or defaults
  const matchScore = match?.matchScore || 0
  const breakdown = match?.breakdown || { keywords: 0, experience: 0, skills: 0, education: 0 }
  const missingKeywords = match?.missingKeywords || []
  const strengths = match?.strengths || []
  const aiExplanation = match?.aiExplanation || {
    summary: '',
    whyMismatch: '',
    priorityChanges: [],
    improvementTips: []
  }
  const generatedAt = match?.generatedAt ? new Date(match.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'

  // Show loading state
  if (isLoading && !match) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Analyzing job match..." />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Comparing your resume to the job description</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !match) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage
            error={error}
            onRetry={clearError}
          />
          <div className="mt-4 text-center">
            <Link to="/job-description" state={{ resumeId }} className="text-primary hover:text-primary/80 text-sm font-medium">
              Try again with a different job description
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Helper to get badge variant based on importance
  const getImportanceBadgeVariant = (importance: string) => {
    switch (importance) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      default: return 'neutral'
    }
  }

  // Helper to get badge variant based on match strength
  const getStrengthBadgeVariant = (strength: string) => {
    switch (strength) {
      case 'high': return 'success'
      case 'medium': return 'success'
      default: return 'neutral'
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-slate-200 dark:border-surface-border bg-white/80 dark:bg-[#111318]/90 backdrop-blur-md px-6 py-3 lg:px-10">
        <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-8 rounded bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">description</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">Resumelint</h2>
        </Link>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-6">
            <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Dashboard</Link>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Resume Builder</a>
            <a className="text-sm font-medium text-primary" href="#">Job Search</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Settings</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 dark:border-surface-border pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Match Analysis</h1>
              <Badge variant={matchScore >= 75 ? 'success' : matchScore >= 50 ? 'warning' : 'error'}>
                {matchScore >= 75 ? 'Good Match' : matchScore >= 50 ? 'Partial Match' : 'Low Match'}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              {resume?.role || 'Engineer'} - <span className="font-mono text-xs">ID #{match?.matchId?.slice(-4) || 'N/A'}</span> - Scanned {generatedAt}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-lg">picture_as_pdf</span>}>
              Export PDF
            </Button>
            <Link to="/rewrite" state={{ resumeId }}>
              <Button size="sm" icon={<span className="material-symbols-outlined text-lg">auto_fix_high</span>}>
                Auto-Fix Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Section: Score & AI Analysis */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Score Card */}
          <div className="lg:col-span-4 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-surface-border p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Overall Match Score
            </h3>
            <div className="flex flex-col items-center justify-center flex-1 py-4">
              <ScoreCircle score={matchScore} size="lg" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Match Quality</span>
                <span className="font-semibold text-primary">
                  {matchScore >= 80 ? 'Excellent Match' : matchScore >= 60 ? 'High Potential' : matchScore >= 40 ? 'Moderate' : 'Needs Work'}
                </span>
              </div>
              {/* Linear Progress Details */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Keywords</span>
                  <span>{breakdown.keywords}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${breakdown.keywords >= 70 ? 'bg-green-500' : breakdown.keywords >= 50 ? 'bg-amber-500' : 'bg-red-500'} rounded-full`} style={{width: `${breakdown.keywords}%`}}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Experience</span>
                  <span>{breakdown.experience}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${breakdown.experience >= 70 ? 'bg-green-500' : breakdown.experience >= 50 ? 'bg-amber-500' : 'bg-red-500'} rounded-full`} style={{width: `${breakdown.experience}%`}}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Skills</span>
                  <span>{breakdown.skills}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${breakdown.skills >= 70 ? 'bg-green-500' : breakdown.skills >= 50 ? 'bg-amber-500' : 'bg-red-500'} rounded-full`} style={{width: `${breakdown.skills}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Panel */}
          <div className="lg:col-span-8 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-surface-border overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-900/20 p-6 border-b border-slate-200 dark:border-surface-border flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Generated by Resumelint AI - {generatedAt}</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                {aiExplanation.summary || 'Your resume has been analyzed against the job description. Review the missing keywords and strengths below to improve your match score.'}
              </p>
              {aiExplanation.whyMismatch && (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {aiExplanation.whyMismatch}
                </p>
              )}
              {aiExplanation.improvementTips.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0">lightbulb</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">Improvement Tips</h4>
                      <ul className="text-sm text-amber-800 dark:text-amber-200/80 list-disc list-inside space-y-1">
                        {aiExplanation.improvementTips.slice(0, 3).map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column: Missing vs Strengths */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Missing Skills */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">warning</span>
                Missing Keywords
              </h3>
              <Badge variant="error">{missingKeywords.filter(k => k.importance === 'high').length} High Impact</Badge>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-900/30 p-5 shadow-sm min-h-[200px]">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">These keywords appear frequently in the JD but are missing from your resume.</p>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant={getImportanceBadgeVariant(keyword.importance) as 'error' | 'warning' | 'neutral'}
                      className="px-3 py-1.5"
                    >
                      {keyword.keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400">No missing keywords detected!</p>
              )}
            </div>
          </div>

          {/* Strengths */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Matching Strengths
              </h3>
              <Badge variant="success">Found {strengths.length}</Badge>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-green-200 dark:border-green-900/30 p-5 shadow-sm min-h-[200px]">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your resume strongly emphasizes these skills required by the job.</p>
              {strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {strengths.map((strength, index) => (
                    <Badge
                      key={index}
                      variant={getStrengthBadgeVariant(strength.matchStrength) as 'success' | 'neutral'}
                      className="px-3 py-1.5"
                    >
                      {strength.keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No matching strengths detected yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-4 w-full bg-slate-900 dark:bg-primary/10 backdrop-blur-xl border border-slate-700/50 dark:border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex size-10 rounded-full bg-primary/20 items-center justify-center text-primary">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Ready to optimize?</p>
              <p className="text-slate-400 text-xs">Let AI rewrite your bullet points for this JD.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link to="/analysis" state={{ resumeId }} className="flex-1 sm:flex-none">
              <button className="w-full justify-center px-6 py-2.5 rounded-lg bg-transparent border border-slate-600 text-white hover:bg-white/5 transition-colors text-sm font-semibold">
                View Analysis
              </button>
            </Link>
            <Link to="/rewrite" state={{ resumeId, matchId: match?.matchId }} className="flex-1 sm:flex-none">
              <Button className="w-full">
                Improve Resume
                <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
