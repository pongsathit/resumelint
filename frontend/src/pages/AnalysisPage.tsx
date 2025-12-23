import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'
import Badge from '../components/Badge'
import ScoreCircle from '../components/ScoreCircle'

export default function AnalysisPage() {
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(0)

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
                    Analysis for <span className="text-primary">My_Resume_v4.pdf</span>
                  </h1>
                  <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal">
                    Generated on Oct 24, 2023 • AI Model v2.1 • Software Engineer Profile
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
                <ScoreCircle score={82} />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Excellent Score</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                    Your resume is in the top <span className="text-score-good font-bold">15%</span> of profiles analyzed. Focus on quantifying your impact to reach the top 5%.
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Metric: Clarity */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-score-good/10 text-score-good">
                        <span className="material-symbols-outlined">visibility</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Clarity & Brevity</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-score-good h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Excellent use of active verbs and concise structure.</p>
                </div>

                {/* Metric: Impact */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-score-mid/10 text-score-mid">
                        <span className="material-symbols-outlined">bolt</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Business Impact</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-score-mid h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Needs more metrics. Quantify your achievements.</p>
                </div>

                {/* Metric: ATS */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-score-good/10 text-score-good">
                        <span className="material-symbols-outlined">rule</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">ATS Friendliness</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-score-good h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Formatting is parseable by 98% of ATS systems.</p>
                </div>

                {/* Metric: Technical Depth */}
                <div className="flex flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-score-bad/10 text-score-bad">
                        <span className="material-symbols-outlined">code</span>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Technical Depth</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-score-bad h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Missing key skills for "Senior Engineer" roles.</p>
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
                    <Badge variant="error">3 Critical</Badge>
                    <Badge variant="warning">5 Warnings</Badge>
                  </div>
                </div>

                {/* Suggestion Item - Expanded */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-card-light dark:bg-card-dark overflow-hidden shadow-sm">
                  <div
                    onClick={() => setExpandedSuggestion(expandedSuggestion === 0 ? null : 0)}
                    className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-score-bad">error</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Work Experience: Senior Developer Role</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Missing quantification of results</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">
                      {expandedSuggestion === 0 ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  {expandedSuggestion === 0 && (
                    <div className="p-6">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        Your bullet points describe responsibilities rather than achievements. Hiring managers want to see the "So what?" of your work. Use the <strong className="text-primary">Action + Context + Result</strong> formula.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4">
                          <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wide">
                            <span className="material-symbols-outlined text-sm">close</span> Original
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">"Worked on improving system performance for the main API."</p>
                        </div>
                        <div className="rounded-lg border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 p-4">
                          <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wide">
                            <span className="material-symbols-outlined text-sm">check</span> Suggested Rewrite
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                            "Reduced API latency by <span className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 px-1 rounded">30% (200ms to 140ms)</span> by implementing Redis caching strategies."
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                          Auto-fix with AI <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Sticky Actions */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 flex flex-col gap-6">
                  {/* Action Card */}
                  <div className="rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Improve this Resume</h3>
                    <div className="flex flex-col gap-3">
                      <Link to="/rewrite">
                        <Button className="w-full" icon={<span className="material-symbols-outlined">auto_fix_high</span>}>
                          Rewrite with AI
                        </Button>
                      </Link>
                      <Link to="/job-description">
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
