"use client"
import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  User,
  Mail,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  Loader2,
  Send,
  Tag,
  AlertCircle,
  Brain,
  Target,
} from "lucide-react"

export default function ResumeUploader() {
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files?.[0] || null)
      setResponse(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResponse(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post(`${BASE_URL}/screen`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResponse(res.data)
      setFile(null)
      e.target.reset()
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!response || !response.email) return
    setEmailSending(true)
    try {
      await axios.post(`${BASE_URL}/send-email`, {
        email: response.email,
        name: response.name,
        status: response.status,
        best_role: response.best_role,
        score: response.final_score,
      })
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Email send error:", error)
      alert("Failed to send email.")
    } finally {
      setEmailSending(false)
    }
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "qualified":
        return "default"
      case "rejected":
      case "not qualified":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Resume Screening Platform</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Upload and analyze resumes with advanced AI-powered screening technology for instant candidate evaluation
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              Upload Resume for Analysis
            </CardTitle>
            <CardDescription className="text-slate-600">
              Upload a PDF or DOCX file to begin the comprehensive AI screening process
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-slate-300 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx"
                  onClick={(e) => (e.target.value = null)}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-4">
                  {file ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-700">{file.name}</p>
                        <p className="text-sm text-green-600">Ready to analyze • Click to change file</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-blue-500 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-slate-900">Drag & drop your resume here</p>
                        <p className="text-sm text-slate-600">or click to browse files</p>
                        <p className="text-xs text-slate-500 mt-2">Supports PDF and DOCX files up to 10MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 mr-3" />
                    Analyze Resume with AI
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading Progress */}
        {loading && (
          <Card className="mb-8 shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-slate-900">Processing your resume...</span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-sm text-slate-600">
                  Our advanced AI is analyzing skills, experience, qualifications, and candidate fit
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {response && (
          <div className="space-y-8">
            {/* Candidate Overview */}
            <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Candidate Profile Analysis
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Comprehensive candidate information extracted from resume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                      <p className="text-lg font-semibold text-slate-900">{response.name}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-slate-900 font-medium">{response.email}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Experience Level</label>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-slate-900">{response.experience_years} years</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {response.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Best Match Role</label>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-slate-900">{response.best_role}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Overall Score</label>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className={`text-3xl font-bold ${getScoreColor(response.final_score)}`}>
                          {response.final_score}%
                        </span>
                      </div>
                      <Progress value={response.final_score} className="h-2 mt-2" />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Screening Status</label>
                      <Badge variant={getStatusVariant(response.status)} className="text-sm font-semibold">
                        {response.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                  Skills Analysis
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Technical and professional skills identified from the resume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.matched_skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Section */}
            <Card className="shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Send className="h-5 w-5 text-blue-600" />
                  </div>
                  Send Screening Results
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Email the comprehensive screening report to the candidate
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    This will send a detailed screening report with analysis results to{" "}
                    <span className="font-semibold">{response.email}</span>
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleSendEmail}
                  disabled={emailSending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {emailSending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Send Results via Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

