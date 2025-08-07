"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, MapPin, Building2, Upload, FileText, Loader2, Briefcase, Clock, Users } from "lucide-react"
import { toast } from "sonner"

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true)

      // 🟩 Fetch jobs from API
      const response = await axios.get(`${BASE_URL}/jobs`)

      // ✅ Filter expired jobs out
      const now = Date.now()
      const activeJobs = response.data.filter(
        (job) => new Date(job.deadline).getTime() > now
      )

      setJobs(activeJobs)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch jobs:", err)
      setError("Failed to load job opportunities. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [BASE_URL])


 

  const handleFileUpload = async () => {
    if (!file || !selectedJob) {
      setError("Please select a resume file.")
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("job_id", selectedJob.id.toString())

    try {
      const response = await axios.post(`${BASE_URL}/screen`, formData)
      console.log("🎯 Required Skills:", response.data.required_skills)
      setSelectedJob(null)
      setFile(null)
      toast.success("Resume uploaded successfully!")
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to upload resume. Please try again."
      console.error("❌ Upload error:", error)
      setError(message)
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const formatDeadline = (deadline) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isDeadlineSoon = (deadline) => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  function JobDescription({ description }) {
    const [expanded, setExpanded] = useState(false)

    return (
      <div>
        <CardDescription className={expanded ? "" : "line-clamp-3"}>{description}</CardDescription>

        {description.length > 150 && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-blue-600 hover:text-blue-700 hover:underline mt-2 text-sm font-medium transition-colors"
          >
            {expanded ? "View Less" : "View More"}
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="p-4 bg-white rounded-full shadow-lg mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Opportunities</h3>
            <p className="text-slate-600">Fetching the latest job openings for you...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Career Opportunities</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover exciting career opportunities and take the next step in your professional journey
          </p>
          {jobs.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {jobs.length} Open Position{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Apply Today</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert className="mb-8 max-w-2xl mx-auto" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {jobs.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardContent className="text-center py-16">
              <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-6">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Active Positions</h3>
              <p className="text-slate-600 leading-relaxed">
                There are currently no active job opportunities available. Please check back later for new openings.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl line-clamp-2 text-slate-900 leading-tight">{job.title}</CardTitle>
                    {isDeadlineSoon(job.deadline) && (
                      <Badge variant="destructive" className="shrink-0 shadow-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pt-0">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="p-1 bg-blue-50 rounded mr-3">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{job.department}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="p-1 bg-green-50 rounded mr-3">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="p-1 bg-orange-50 rounded mr-3">
                        <CalendarDays className="h-4 w-4 text-orange-600" />
                      </div>
                      <span>Deadline: {formatDeadline(job.deadline)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <JobDescription description={job.description} />
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    onClick={() => setSelectedJob(job)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          {/* <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200"> */}
          <DialogContent className="w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white/95 backdrop-blur-sm border-slate-200">

            <DialogHeader>
              <DialogTitle className="text-xl text-slate-900">Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription className="text-slate-600">
                Upload your resume to apply for this position. We accept PDF and DOCX formats.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <label htmlFor="resume" className="text-sm font-semibold text-slate-900">
                  Resume File
                </label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null)
                      setError(null)
                    }}
                    disabled={uploading}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-slate-200"
                  />
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-2 px-3">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedJob(null)
                  setFile(null)
                  setError(null)
                }}
                disabled={uploading}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
