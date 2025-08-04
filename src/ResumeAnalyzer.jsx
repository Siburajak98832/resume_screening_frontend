
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Upload, Plus, Trash2, Target, Download, CheckCircle, AlertCircle, ArrowLeft, Copy, Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setResumeFile(file)
  }

  const addJob = () => setJobs([...jobs, { title: "", description: "" }])

  const deleteJob = (index) => {
    if (jobs.length >= 1) {
      const updatedJobs = jobs.filter((_, i) => i !== index)
      setJobs(updatedJobs)
    }
  }

  const handleJobChange = (i, field, val) => {
    const updated = [...jobs]
    updated[i][field] = val
    setJobs(updated)
  }

  const handleSubmit = async () => {
    if (!resumeFile || jobs.some((j) => !j.title || !j.description)) {
      return
    }

    const formData = new FormData()
    formData.append("file", resumeFile)
    formData.append("titles", JSON.stringify(jobs.map((j) => j.title)))
    formData.append("descriptions", JSON.stringify(jobs.map((j) => j.description)))

    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/analyze_resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const sortedResults = res.data.results.sort((a, b) => b.ats_score - a.ats_score)
      setResults(sortedResults)
    } catch (err) {
      console.error("Error during analysis:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadJobsFromBackend = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/jobs`)
      const jobList = res.data.map((job) => ({
        title: job.title,
        description: job.description,
      }))
      setJobs((prev) => [...prev, ...jobList])
    } catch (err) {
      console.error("Failed to load jobs from backend:", err)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const copyAnalysisToClipboard = () => {
    const combinedText = results
      .map((r, i) => `#${i + 1} - ${r.job_title}\nScore: ${r.ats_score}%\nSuggestions:\n${r.suggestions}\n\n`)
      .join("")
    navigator.clipboard.writeText(combinedText)
    toast.success("Analysis copied to clipboard")
  }

  const shareAnalysis = async () => {
    if (!navigator.share) return toast.error("Sharing not supported")
    const shareText = results.map((r, i) => `#${i + 1} - ${r.job_title}\nScore: ${r.ats_score}%\n\n`).join("")
    try {
      await navigator.share({ title: "My Resume Analysis Results", text: shareText })
    } catch (err) {
      toast.error("Sharing canceled or failed")
    }
  }

  const isFormValid = resumeFile && jobs.every((j) => j.title && j.description)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
        {/* Navigation */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/user-jobboard")}
            className="text-slate-600 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Job Board</span>
            <span className="inline sm:hidden">Back</span>
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Get instant ATS scores and personalized improvement suggestions by analyzing your resume against multiple
              job descriptions
            </p>
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Upload Your Resume</h2>
            </div>
            <p className="text-slate-600 ml-12 text-sm sm:text-base">
              Upload your resume in PDF or DOCX format for analysis
            </p>
          </div>

          <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="max-w-md mx-auto text-sm sm:text-base file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-sm text-slate-500">Supported formats: PDF, DOCX (Max 10MB)</p>
                </div>
                {resumeFile && (
                  <div className="inline-flex items-center gap-3 text-sm text-emerald-600 bg-emerald-50 rounded-xl py-3 px-6 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span className="truncate max-w-xs">{resumeFile.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Job Positions */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Add Job Positions ({jobs.length})</h2>
              </div>
              <div className="flex flex-col xs:flex-row gap-3 ml-12 sm:ml-0">
                <Button
                  variant="outline"
                  onClick={loadJobsFromBackend}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/60 backdrop-blur-sm shadow-sm text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Load from Job Board</span>
                  <span className="inline sm:hidden">Load Jobs</span>
                </Button>
                <Button
                  onClick={addJob}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </div>
            <p className="text-slate-600 ml-12 text-sm sm:text-base">
              Add job descriptions to compare your resume against
            </p>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm shadow-lg border-slate-200">
            <CardContent className="p-6 sm:p-8">
              {jobs.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <div className="w-8 h-8 bg-slate-300 rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">No jobs added yet</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Add job descriptions to analyze your resume compatibility and get personalized suggestions
                  </p>
                  <Button
                    onClick={addJob}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobs.map((job, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex items-center justify-center w-6 h-6 bg-slate-600 text-white rounded-full text-xs font-bold flex-shrink-0 mt-1">
                          {i + 1}
                        </div>
                        <div className="flex-1 space-y-4 min-w-0">
                          <div className="flex flex-col xs:flex-row gap-3">
                            <Input
                              placeholder="e.g. Senior Software Engineer"
                              value={job.title}
                              onChange={(e) => handleJobChange(i, "title", e.target.value)}
                              className="flex-1 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteJob(i)}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex-shrink-0 px-4 py-2 text-sm"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Paste the complete job description here..."
                            rows={4}
                            value={job.description}
                            onChange={(e) => handleJobChange(i, "description", e.target.value)}
                            className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Analysis */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Run Analysis</h2>
            </div>
            <p className="text-slate-600 ml-12 text-sm sm:text-base">
              Analyze your resume against all added job descriptions
            </p>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm shadow-lg border-slate-200">
            <CardContent className="p-6 sm:p-8">
              {!isFormValid && (
                <Alert className="mb-6 border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm sm:text-base">
                    Please upload a resume and fill in all job fields before analyzing.
                  </AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={loading || !isFormValid}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span className="text-sm sm:text-base">Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-3" />
                    <span className="hidden sm:inline">
                      Analyze Resume Against {jobs.length} Job{jobs.length !== 1 ? "s" : ""}
                    </span>
                    <span className="inline sm:hidden">
                      Analyze {jobs.length} Job{jobs.length !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mb-8">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full text-sm font-bold">
                    ✓
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Analysis Results</h2>
                </div>
                <div className="flex gap-3 ml-12 sm:ml-0">
                  <Button
                    variant="outline"
                    onClick={copyAnalysisToClipboard}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/60 backdrop-blur-sm shadow-sm text-sm"
                  >
                    <Copy className="w-4 h-4 mr-2 sm:mr-0" />
                    <span className="hidden sm:inline">Copy Analysis</span>
                  </Button>
                  {navigator.share && (
                    <Button
                      variant="outline"
                      onClick={shareAnalysis}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/60 backdrop-blur-sm shadow-sm text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-2 sm:mr-0" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 ml-12 flex-wrap">
                <p className="text-slate-600 text-sm sm:text-base">Results sorted by ATS score (highest first)</p>
                <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                  {results.length} job{results.length !== 1 ? "s" : ""} analyzed
                </Badge>
              </div>
            </div>

            <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-6">
                <CardTitle className="text-slate-900 text-lg sm:text-xl font-bold">Detailed Analysis Results</CardTitle>
                <p className="text-slate-600 text-sm sm:text-base">
                  Click on any result to view detailed improvement suggestions
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {results.map((res, i) => (
                    <AccordionItem key={i} value={res.job_title} className="border-slate-200">
                      <AccordionTrigger className="hover:no-underline px-6 py-6 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between w-full pr-4 min-w-0">
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-sm font-medium text-slate-500 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center">
                                {i + 1}
                              </span>
                              <Badge
                                variant={getScoreBadgeVariant(res.ats_score)}
                                className="min-w-[60px] font-bold text-sm px-3 py-1"
                              >
                                {res.ats_score}%
                              </Badge>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-left text-slate-900 text-base sm:text-lg truncate">
                                {res.job_title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-8">
                        <div className="space-y-8">
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
                              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                ATS Compatibility Score
                              </h4>
                              <span className={`font-bold text-2xl ${getScoreColor(res.ats_score)}`}>
                                {res.ats_score}%
                              </span>
                            </div>
                            <Progress value={res.ats_score} className="h-3" />
                          </div>

                          <Separator className="bg-slate-200" />

                          <div className="bg-blue-50 rounded-2xl p-6 sm:p-8">
                            <h4 className="font-bold text-slate-900 mb-6 text-lg">
                              Personalized Improvement Suggestions
                            </h4>
                            <div className="prose prose-sm max-w-none text-slate-700">
                              <ReactMarkdown
                                components={{
                                  h1: ({ children }) => (
                                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3">
                                      {children}
                                    </h1>
                                  ),
                                  h2: ({ children }) => (
                                    <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-5 mb-3">
                                      {children}
                                    </h2>
                                  ),
                                  h3: ({ children }) => (
                                    <h3 className="text-sm sm:text-base font-bold text-slate-700 mt-4 mb-2">
                                      {children}
                                    </h3>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-2 text-sm sm:text-base leading-relaxed">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base leading-relaxed">
                                      {children}
                                    </ol>
                                  ),
                                  p: ({ children }) => (
                                    <p className="text-sm sm:text-base leading-relaxed mb-4">{children}</p>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-bold text-blue-700">{children}</strong>
                                  ),
                                }}
                              >
                                {res.suggestions}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
