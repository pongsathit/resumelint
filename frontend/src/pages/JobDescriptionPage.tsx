import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useMatch } from '../hooks/useMatch'
import { useResume } from '../hooks/useResume'

export default function JobDescriptionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [jdText, setJdText] = useState('')

  // Get resumeId from navigation state
  const { resumeId } = (location.state as { resumeId?: string }) || {}

  const { matchResume, isLoading: isMatching, error: matchError, clearError: clearMatchError } = useMatch()
  const { resume, fetchResume, isLoading: isLoadingResume, error: resumeError } = useResume()

  const isLoading = isMatching || isLoadingResume
  const error = matchError || resumeError

  // Fetch resume details if we have resumeId
  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId).catch(() => {
        // Error handled by hook
      })
    }
  }, [resumeId, fetchResume])

  const handleCompare = async () => {
    if (!resumeId || !jdText.trim()) return

    try {
      clearMatchError()
      await matchResume(resumeId, undefined, jdText)
      navigate('/matching', { state: { resumeId } })
    } catch (err) {
      // Error handled by hook
      console.error('Failed to match resume:', err)
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="border-b border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-[#111318] px-4 lg:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between whitespace-nowrap max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[32px]">description</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Resumelint</h2>
          </Link>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link className="text-slate-500 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" to="/">Dashboard</Link>
              <a className="text-slate-500 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">My Resumes</a>
              <a className="text-slate-900 dark:text-white text-sm font-medium leading-normal" href="#">Job Tracker</a>
              <a className="text-slate-500 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">Settings</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="primary" size="sm">Upgrade Pro</Button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-slate-100 dark:ring-border-dark cursor-pointer" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=1")'}}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-[800px] w-full gap-6">
          {/* Breadcrumbs */}
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Job Tracker', href: '#' },
            { label: 'New Comparison' }
          ]} />

          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold">Analyze Job Fit</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
              Paste the full job description below. Our AI will analyze requirements against your resume to generate a compatibility score and optimization tips.
            </p>
          </div>

          {/* Active Resume Card */}
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {resume ? (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Resume</span>
                    <span className="text-slate-900 dark:text-white font-medium truncate">{resume.fileName}</span>
                  </div>
                </div>
                <Link
                  to="/input"
                  className="text-sm font-medium text-primary hover:text-blue-400 transition-colors flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  Switch Resume
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">No Resume Selected</span>
                  <Link to="/input" className="text-primary hover:text-blue-400 font-medium text-sm">
                    Upload a resume first
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage
              error={error}
              onDismiss={clearMatchError}
              className="mt-4"
            />
          )}

          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-slate-900 dark:text-white text-sm font-semibold" htmlFor="job-description">
                Job Description
              </label>
              <button className="text-xs font-medium text-primary hover:text-blue-400 flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[14px]">content_paste</span>
                Paste from clipboard
              </button>
            </div>
            <div className="relative group">
              <textarea
                id="job-description"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full min-h-[400px] bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-border-dark rounded-xl p-5 text-base font-normal leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner font-mono"
                placeholder={`Paste the job description here...

e.g.
About the Role:
We are looking for a Senior Software Engineer to join our team...

Requirements:
- 5+ years of experience with React and Node.js
- Experience with cloud infrastructure (AWS/GCP)...`}
              />
              {/* Character Counter */}
              <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-200 dark:border-border-dark pointer-events-none">
                {jdText.length} characters
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-2 pb-10">
            <button
              onClick={() => setJdText('')}
              disabled={isLoading}
              className="w-full sm:w-auto h-12 px-6 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Text
            </button>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              disabled={isLoading || !resumeId || !jdText.trim()}
              onClick={handleCompare}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="material-symbols-outlined group-hover:animate-pulse">analytics</span>
              )}
              {isLoading ? 'Analyzing...' : 'Compare with Resume'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
