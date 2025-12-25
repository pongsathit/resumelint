import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useRewrite } from '../hooks/useRewrite'
import { useResume } from '../hooks/useResume'

export default function ResumeRewritePage() {
  const location = useLocation()
  const { resumeId, matchId } = (location.state as { resumeId?: string; matchId?: string }) || {}

  const [editedContent, setEditedContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const {
    rewrite,
    rewriteResume,
    updateRewrite,
    isLoading: isLoadingRewrite,
    error: rewriteError,
    clearError: clearRewriteError
  } = useRewrite()

  const {
    resume,
    fetchResume,
    isLoading: isLoadingResume,
    error: resumeError
  } = useResume()

  const isLoading = isLoadingRewrite || isLoadingResume
  const error = rewriteError || resumeError

  // Fetch resume and trigger rewrite
  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId).catch(() => {})
      // Trigger rewrite if we don't have one yet
      rewriteResume(resumeId, matchId ? { jobDescriptionId: matchId } : undefined).catch(() => {})
    }
  }, [resumeId, matchId, fetchResume, rewriteResume])

  // Set edited content when rewrite is loaded
  useEffect(() => {
    if (rewrite?.rewrittenText) {
      setEditedContent(rewrite.rewrittenText)
    }
  }, [rewrite?.rewrittenText])

  const handleSave = async () => {
    if (!rewrite?.rewriteId) return

    setIsSaving(true)
    try {
      await updateRewrite(rewrite.rewriteId, editedContent)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state
  if (isLoading && !rewrite) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" message="Generating AI rewrite..." />
        <p className="mt-4 text-slate-500 dark:text-slate-400">This may take a moment</p>
      </div>
    )
  }

  // Show error state
  if (error && !rewrite) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage
            error={error}
            onRetry={() => {
              clearRewriteError()
              if (resumeId) {
                rewriteResume(resumeId)
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

  const scoreImprovement = rewrite?.scoreImprovement || { before: 0, after: 0, delta: 0 }
  const changes = rewrite?.changes || []
  const originalText = rewrite?.originalText || resume?.rawText || ''

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark px-6 py-3 shrink-0">
        <Link to="/" className="flex items-center gap-4 text-white">
          <div className="size-6 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Resumelint</h2>
        </Link>
        <div className="flex flex-1 justify-end gap-6">
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-surface-dark hover:bg-border-dark text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-surface-dark hover:bg-border-dark text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">help</span>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-dark" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=3")'}}></div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumbs & Heading Area */}
          <div className="px-6 pt-5 pb-2 shrink-0">
            <div className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full">
              {/* Breadcrumbs */}
              <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: 'Resumes', href: '/input' },
                { label: resume?.fileName || 'Resume Rewrite' }
              ]} />

              {/* Page Heading & Primary Actions */}
              <div className="flex flex-wrap justify-between items-end gap-3 pb-2 border-b border-border-dark">
                <div className="flex min-w-72 flex-col gap-1">
                  <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">Resume Rewrite</h1>
                  <p className="text-[#9da6b9] text-sm font-normal">
                    {rewrite?.generatedAt
                      ? `Generated ${new Date(rewrite.generatedAt).toLocaleString()}`
                      : 'Generating...'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">history</span>}>
                    History
                  </Button>
                  <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">download</span>}>
                    Export PDF
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving || !rewrite}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar & Split Pane Container */}
          <div className="flex flex-col flex-1 px-6 pb-6 overflow-hidden">
            <div className="flex flex-col h-full max-w-[1400px] mx-auto w-full gap-4">
              {/* Editor Toolbar */}
              <div className="flex justify-between items-center bg-surface-dark rounded-t-xl border-x border-t border-border-dark px-4 py-2 shrink-0">
                <div className="flex items-center gap-1">
                  {/* Formatting Tools */}
                  <div className="flex gap-1 pr-3 border-r border-border-dark/50">
                    <button className="p-1.5 rounded hover:bg-white/10 text-[#9da6b9] hover:text-white transition-colors" title="Bold">
                      <span className="material-symbols-outlined text-[20px]">format_bold</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10 text-[#9da6b9] hover:text-white transition-colors" title="Italic">
                      <span className="material-symbols-outlined text-[20px]">format_italic</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10 text-[#9da6b9] hover:text-white transition-colors" title="Underline">
                      <span className="material-symbols-outlined text-[20px]">format_underlined</span>
                    </button>
                  </div>
                  <div className="flex gap-1 px-3 border-r border-border-dark/50">
                    <button className="p-1.5 rounded hover:bg-white/10 text-[#9da6b9] hover:text-white transition-colors" title="Bullet List">
                      <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10 text-[#9da6b9] hover:text-white transition-colors" title="Ordered List">
                      <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                    </button>
                  </div>
                  {/* AI Tools */}
                  <div className="flex gap-2 pl-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors">
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                      AI Fix Grammar
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-colors">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      Make More Senior
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Score</span>
                    <span className="text-white text-sm font-bold">{scoreImprovement.after}/100</span>
                    {scoreImprovement.delta > 0 && (
                      <span className="text-green-400 text-xs font-bold">+{scoreImprovement.delta}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Split View Content */}
              <div className="flex flex-1 gap-0 overflow-hidden rounded-b-xl border border-border-dark bg-background-dark">
                {/* Left Pane: Original Resume (Read Only) */}
                <div className="w-1/2 flex flex-col border-r border-border-dark bg-[#161b26]">
                  <div className="px-5 py-3 border-b border-border-dark bg-[#1a202c] flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-[#9da6b9] font-medium text-sm uppercase tracking-wider">Original Resume</h3>
                    <span className="bg-[#282e39] text-[#9da6b9] text-[10px] px-2 py-0.5 rounded">Read Only</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-[65ch] mx-auto text-[#9da6b9]/80 font-serif leading-relaxed text-sm space-y-6 select-none opacity-80">
                      <div>
                        <h4 className="text-lg font-bold text-[#9da6b9] border-b border-border-dark pb-1 mb-2">Experience</h4>
                        <p className="mb-1 font-semibold">Software Engineer - TechCorp</p>
                        <p className="text-xs italic mb-2">Jan 2020 - Present</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Responsible for backend development using Node.js.</li>
                          <li>Fixed bugs in the system and helped with deployment.</li>
                          <li>Worked with the frontend team to connect APIs.</li>
                          <li>Wrote some tests for the code.</li>
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold">Junior Developer - StartUp Inc</p>
                        <p className="text-xs italic mb-2">Jun 2018 - Dec 2019</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Helped build the main website using React.</li>
                          <li>Learned about databases and SQL.</li>
                          <li>Participated in daily standups.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Improved Resume (Editable) */}
                <div className="w-1/2 flex flex-col bg-background-dark relative">
                  <div className="px-5 py-3 border-b border-border-dark bg-surface-dark flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                      Improved Draft
                    </h3>
                    <span className="text-xs text-[#9da6b9]">Autosaved</span>
                  </div>
                  {/* Editor Area */}
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <div className="max-w-[65ch] mx-auto text-white font-serif leading-relaxed text-sm space-y-6 outline-none" contentEditable="true">
                      <div>
                        <h4 className="text-lg font-bold text-white border-b border-border-dark pb-1 mb-2">Experience</h4>
                        <p className="mb-1 font-semibold">Software Engineer - TechCorp</p>
                        <p className="text-xs italic mb-2 text-[#9da6b9]">Jan 2020 - Present</p>
                        <ul className="list-disc pl-5 space-y-3">
                          <li>
                            Architected scalable backend microservices using Node.js, <span className="bg-primary/20 border-b-2 border-primary px-1">reducing system latency by 40%</span> during peak traffic periods.
                          </li>
                          <li>
                            Resolved critical production bugs, improving system stability and increasing uptime to 99.9%.
                          </li>
                          <li>
                            Collaborated cross-functionally with frontend teams to design and implement RESTful APIs used by 10k+ daily active users.
                          </li>
                          <li>
                            Implemented comprehensive unit and integration testing suites, achieving 85% code coverage.
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold">Junior Developer - StartUp Inc</p>
                        <p className="text-xs italic mb-2 text-[#9da6b9]">Jun 2018 - Dec 2019</p>
                        <ul className="list-disc pl-5 space-y-3">
                          <li>Spearheaded the frontend development of the company's flagship website using React, resulting in a 20% increase in user engagement.</li>
                          <li>Optimized SQL database queries, decreasing data retrieval time by 15%.</li>
                          <li>Led daily standup meetings and facilitated agile sprint planning sessions.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Bottom AI Action Bar (Sticky) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                    <div className="flex items-center gap-2 p-1.5 bg-[#161b26] border border-border-dark shadow-2xl rounded-full backdrop-blur-md bg-opacity-90">
                      <input className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-[#9da6b9] w-64 px-3" placeholder="Ask AI to change something..." type="text" />
                      <button className="size-8 rounded-full bg-primary hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                      </button>
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
