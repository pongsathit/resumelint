import { Link } from 'react-router-dom'
import ScoreCircle from '../components/ScoreCircle'
import Badge from '../components/Badge'
import Button from '../components/Button'

export default function JDMatchingPage() {
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
              <Badge variant="success">Good Match</Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Senior Frontend Engineer • <span className="font-mono text-xs">ID #8291</span> • Scanned Oct 24, 2023
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-lg">picture_as_pdf</span>}>
              Export PDF
            </Button>
            <Link to="/rewrite">
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
              <ScoreCircle score={75} size="lg" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Match Quality</span>
                <span className="font-semibold text-primary">High Potential</span>
              </div>
              {/* Linear Progress Details */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Keywords</span>
                  <span>82%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '82%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Experience</span>
                  <span>65%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{width: '65%'}}></div>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Generated by Resumelint AI • Just now</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                Your profile demonstrates a <strong className="text-green-600 dark:text-green-400">strong alignment</strong> with the core Frontend requirements, specifically in{' '}
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">React</span> and{' '}
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">TypeScript</span> architecture. However, the match score is impacted by a lack of explicit mentions regarding containerization tools and specific testing frameworks highlighted in the JD.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0">lightbulb</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">Improvement Tip</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200/80">Consider adding a project section detailing your experience with Docker or CI/CD pipelines to address the DevOps gap.</p>
                  </div>
                </div>
              </div>
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
              <Badge variant="error">High Impact</Badge>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-900/30 p-5 shadow-sm min-h-[200px]">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">These keywords appear frequently in the JD but are missing from your resume.</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="error" className="px-3 py-1.5">Docker</Badge>
                <Badge variant="error" className="px-3 py-1.5">Kubernetes</Badge>
                <Badge variant="warning" className="px-3 py-1.5">gRPC</Badge>
                <Badge variant="warning" className="px-3 py-1.5">AWS Lambda</Badge>
                <Badge variant="error" className="px-3 py-1.5">Cypress</Badge>
                <Badge variant="warning" className="px-3 py-1.5">Jest</Badge>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                Matching Strengths
              </h3>
              <Badge variant="success">Found 18</Badge>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-green-200 dark:border-green-900/30 p-5 shadow-sm min-h-[200px]">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your resume strongly emphasizes these skills required by the job.</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" className="px-3 py-1.5">React.js</Badge>
                <Badge variant="success" className="px-3 py-1.5">TypeScript</Badge>
                <Badge variant="success" className="px-3 py-1.5">Node.js</Badge>
                <Badge variant="success" className="px-3 py-1.5">Tailwind CSS</Badge>
                <Badge variant="success" className="px-3 py-1.5">Redux</Badge>
                <Badge variant="success" className="px-3 py-1.5">REST API</Badge>
                <Badge variant="success" className="px-3 py-1.5">Git</Badge>
                <Badge variant="success" className="px-3 py-1.5">System Design</Badge>
              </div>
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
            <button className="flex-1 sm:flex-none justify-center px-6 py-2.5 rounded-lg bg-transparent border border-slate-600 text-white hover:bg-white/5 transition-colors text-sm font-semibold">
              View Suggestions
            </button>
            <Link to="/rewrite" className="flex-1 sm:flex-none">
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
