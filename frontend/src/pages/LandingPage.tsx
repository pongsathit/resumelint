import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'

export default function LandingPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex flex-col flex-1 w-full items-center">
        {/* Hero Section */}
        <section className="w-full flex justify-center py-12 md:py-20 px-4">
          <div className="flex flex-col max-w-[1100px] flex-1">
            <div className="@container">
              <div className="flex flex-col gap-10 lg:flex-row items-center">
                {/* Hero Content */}
                <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
                  <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                    v2.0 Now Available with AI Rewrite
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.03em] dark:text-white text-gray-900">
                    Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Engineering Resume</span> with AI
                  </h1>
                  <h2 className="text-base md:text-lg font-normal leading-relaxed text-gray-600 dark:text-gray-400 max-w-[600px]">
                    Stop getting filtered out by ATS. Get instant, code-aware feedback on your resume and match it to your dream job description using our advanced LLM tailored for dev roles.
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
                    <Link to="/input">
                      <Button size="lg" className="w-full sm:w-auto">
                        <span className="material-symbols-outlined mr-2 text-[20px]">upload_file</span>
                        Analyze My Resume
                      </Button>
                    </Link>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      View Sample Report
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>No credit card required</span>
                    <span className="mx-1">•</span>
                    <span>PDF & DOCX supported</span>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="w-full lg:w-[500px] xl:w-[550px] aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-surface-border relative group bg-surface-dark">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-dark to-background-dark z-0"></div>
                  {/* Abstract decorative UI */}
                  <div className="absolute inset-2 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 font-mono text-xs z-10 overflow-hidden opacity-90">
                    <div className="flex gap-1.5 mb-4">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="text-gray-500 mb-2">// Analyzing resume.pdf...</div>
                    <div className="text-[#7ee787]">✓ Tech Stack detected: React, Node.js, AWS</div>
                    <div className="text-[#7ee787]">✓ Experience: 5 years</div>
                    <div className="text-[#ffa657] mt-2">&gt; Warning: Missing metrics in bullet points</div>
                    <div className="pl-4 text-gray-400">Current: "Built an API for users."</div>
                    <div className="pl-4 text-[#79c0ff]">Suggestion: "Designed scalable REST API serving 10k+ daily active users, reducing latency by 40%."</div>
                    <div className="mt-6 border-t border-[#30363d] pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">ATS Score</span>
                        <span className="text-[#7ee787] font-bold">87/100</span>
                      </div>
                      <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#238636] h-full w-[87%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full border-y border-gray-200 dark:border-surface-border bg-gray-50 dark:bg-background-dark/50 py-10 flex justify-center">
          <div className="flex flex-col items-center gap-6 max-w-[1280px] px-6 text-center w-full">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Trusted by engineers landing jobs at</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl dark:text-white text-gray-800"><span className="material-symbols-outlined">dataset</span> DataCo</div>
              <div className="flex items-center gap-2 font-bold text-xl dark:text-white text-gray-800"><span className="material-symbols-outlined">cloud_circle</span> CloudScale</div>
              <div className="flex items-center gap-2 font-bold text-xl dark:text-white text-gray-800"><span className="material-symbols-outlined">code_blocks</span> DevSpace</div>
              <div className="flex items-center gap-2 font-bold text-xl dark:text-white text-gray-800"><span className="material-symbols-outlined">rocket_launch</span> HyperGrowth</div>
              <div className="flex items-center gap-2 font-bold text-xl dark:text-white text-gray-800"><span className="material-symbols-outlined">terminal</span> StackFlow</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full flex justify-center py-20 px-6 bg-background-light dark:bg-background-dark">
          <div className="flex flex-col max-w-[1100px] flex-1 gap-12">
            <div className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight dark:text-white text-gray-900 max-w-[720px]">
                Engineering-First Resume Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-normal leading-normal max-w-[720px]">
                Built specifically for software engineers. We parse your GitHub, understand your stack, and help you speak the language of hiring managers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="size-12 rounded-lg bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">code</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold leading-tight dark:text-white text-gray-900">Resume Analyzer</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Deep Code Analysis. We go beyond keywords to understand the complexity of your projects and technical stack proficiency.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">fact_check</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold leading-tight dark:text-white text-gray-900">JD Matcher</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Beat the ATS. Paste a job description and see exactly what's missing from your resume to boost your match score instantly.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">auto_fix_high</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold leading-tight dark:text-white text-gray-900">AI Rewrite</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    AI-Powered Refactoring. Let our AI rewrite your bullet points to emphasize impact, metrics, and engineering leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full flex justify-center py-20 px-6 bg-white dark:bg-[#0c1018]">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-4 mb-12 text-center items-center">
              <h2 className="text-3xl font-black leading-tight tracking-tight dark:text-white text-gray-900">How it works</h2>
              <p className="text-gray-600 dark:text-gray-400">Three steps to your next interview</p>
            </div>
            <div className="grid grid-cols-[40px_1fr] gap-x-6 px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary text-white z-10 font-bold shadow-lg shadow-primary/30">1</div>
                <div className="w-[2px] bg-gray-200 dark:bg-surface-border h-full grow"></div>
              </div>
              <div className="flex flex-col pb-12 pt-1">
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-[600px]">
                  Drag and drop your existing resume (PDF or DOCX). We respect your privacy and don't store your personal data for training models.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[2px] bg-gray-200 dark:bg-surface-border h-4"></div>
                <div className="flex items-center justify-center size-10 rounded-full bg-background-light dark:bg-surface-dark border-2 border-primary text-primary z-10 font-bold">2</div>
                <div className="w-[2px] bg-gray-200 dark:bg-surface-border h-full grow"></div>
              </div>
              <div className="flex flex-col pb-12 pt-2">
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">AI Scan & Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-[600px]">
                  Our engine parses your experience, skills, and projects. It compares them against thousands of successful engineering resumes from top tech companies.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[2px] bg-gray-200 dark:bg-surface-border h-4"></div>
                <div className="flex items-center justify-center size-10 rounded-full bg-background-light dark:bg-surface-dark border-2 border-gray-300 dark:border-gray-600 text-gray-500 z-10 font-bold">3</div>
              </div>
              <div className="flex flex-col pb-2 pt-2">
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Refactor & Improve</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-[600px]">
                  Apply AI-suggested improvements with one click. Export your polished, ATS-friendly resume and start applying with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full flex justify-center py-20 px-6 bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-[1100px] rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-8 md:p-16 text-center text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            <h2 className="relative text-3xl md:text-5xl font-black mb-6 tracking-tight">Ready to debug your career?</h2>
            <p className="relative text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join 15,000+ engineers who have optimized their resumes and landed jobs at FAANG and high-growth startups.</p>
            <Link to="/input">
              <button className="relative bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-transform hover:-translate-y-1">
                Start Optimizing for Free
              </button>
            </Link>
            <p className="relative mt-4 text-sm text-blue-200 opacity-80">No credit card required • 14-day free trial on Pro plans</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
