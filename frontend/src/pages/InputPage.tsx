import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useResume } from '../hooks/useResume'
import { useAnalysis } from '../hooks/useAnalysis'
import { Role } from '../services/api'

export default function InputPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload')
  const [selectedRole, setSelectedRole] = useState<Role>('Frontend Engineer')
  const [resumeText, setResumeText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { uploadResume, isLoading: isUploading, error: uploadError, clearError: clearUploadError } = useResume()
  const { analyzeResume, isLoading: isAnalyzing, error: analysisError, clearError: clearAnalysisError } = useAnalysis()

  const isLoading = isUploading || isAnalyzing
  const error = uploadError || analysisError

  const clearError = useCallback(() => {
    clearUploadError()
    clearAnalysisError()
  }, [clearUploadError, clearAnalysisError])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      clearError()
    }
  }, [clearError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 5242880, // 5MB
    onDrop,
  })

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <header className="w-full border-b border-gray-200 dark:border-[#282e39] bg-white/50 dark:bg-[#101622]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">bug_report</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">resumelint</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/">Home</Link>
            <a className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#login">Login</a>
          </nav>
          <button className="md:hidden text-slate-600 dark:text-gray-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-[720px] w-full text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Debug Your Career
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF or paste your text to get instant, AI-driven feedback tailored to your target engineering role.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-[800px] bg-white dark:bg-[#1c2333] rounded-2xl border border-gray-200 dark:border-[#282e39] shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-[#282e39]">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors hover:bg-gray-50 dark:hover:bg-[#252b3d] ${
                activeTab === 'upload'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                Upload PDF
              </div>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-4 text-center font-medium text-sm border-b-2 transition-colors hover:bg-gray-50 dark:hover:bg-[#252b3d] ${
                activeTab === 'paste'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">description</span>
                Paste Text
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <ErrorMessage
                error={error}
                onRetry={clearError}
                onDismiss={clearError}
                className="mb-6"
              />
            )}

            {activeTab === 'upload' ? (
              <div {...getRootProps()} className="relative group cursor-pointer">
                <input {...getInputProps()} />
                <div className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed bg-gray-50 dark:bg-[#151a25] px-6 py-16 transition-all ${
                  uploadedFile
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                    : isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 dark:border-[#3b4354] group-hover:border-primary/50 group-hover:bg-primary/5'
                }`}>
                  {uploadedFile ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedFile(null)
                        }}
                        className="mt-4 px-6 py-2.5 bg-white dark:bg-[#282e39] text-slate-900 dark:text-white text-sm font-semibold rounded-lg border border-gray-200 dark:border-[#3b4354] shadow-sm hover:bg-gray-50 dark:hover:bg-[#323946] transition-colors"
                      >
                        Choose Different File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Limit 5MB per file - PDF only</p>
                      </div>
                      <button className="mt-4 px-6 py-2.5 bg-white dark:bg-[#282e39] text-slate-900 dark:text-white text-sm font-semibold rounded-lg border border-gray-200 dark:border-[#3b4354] shadow-sm hover:bg-gray-50 dark:hover:bg-[#323946] transition-colors">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  className="w-full h-64 bg-gray-50 dark:bg-[#151a25] border border-gray-300 dark:border-[#3b4354] rounded-xl p-4 text-slate-900 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-mono text-sm"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Configuration Bar */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#282e39] grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Role Selector */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2" htmlFor="role">
                  Target Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    disabled={isLoading}
                    className="w-full appearance-none bg-white dark:bg-[#151a25] border border-gray-300 dark:border-[#3b4354] text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Fullstack Developer">Fullstack Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="Tech Lead">Tech Lead</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <div className="md:col-span-1">
                <Button
                  className="w-full"
                  disabled={isLoading || (activeTab === 'upload' ? !uploadedFile : !resumeText.trim())}
                  onClick={async () => {
                    try {
                      clearError()
                      // Upload the resume
                      const resume = await uploadResume(
                        activeTab === 'upload' ? uploadedFile : null,
                        activeTab === 'paste' ? resumeText : null,
                        selectedRole
                      )
                      // Analyze the uploaded resume
                      await analyzeResume(resume.id, selectedRole)
                      // Navigate to analysis page with resume and analysis data
                      navigate('/analysis', {
                        state: { resumeId: resume.id, role: selectedRole }
                      })
                    } catch (err) {
                      // Error is already handled by hooks
                      console.error('Failed to analyze resume:', err)
                    }
                  }}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                  )}
                  {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-gray-500">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <p>Your data is encrypted and not shared with recruiters.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-200 dark:border-[#282e39] bg-white dark:bg-[#101622]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-gray-500">© 2024 Resumelint Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="text-sm text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
