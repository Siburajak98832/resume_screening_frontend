
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CalendarDays,
  MapPin,
  Building2,
  Upload,
  FileText,
  Loader2,
  Briefcase,
  Home,
  Brain,
  Clock,
  Users,
  Search,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

function JobDescription({ description }) {
  if (!description) return null

  return (
    <Collapsible className="mt-2">
      <CollapsibleTrigger asChild>
        <button className="text-blue-600 hover:text-blue-700 hover:underline mt-1 text-sm font-medium flex items-center gap-1">
          <span className="hidden sm:inline">View Description</span>
          <span className="inline sm:hidden">Description</span>
          <ChevronDown className="h-4 w-4 collapsible-icon" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardDescription className="mt-2 text-sm sm:text-base leading-relaxed">{description}</CardDescription>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function UserJobBoard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
const [showProcessingModal, setShowProcessingModal] = useState(false) // New state for processing modal
const [processingStep, setProcessingStep] = useState("") // New state for processing step message


const BASE_URL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}/jobs`)
        setJobs(response.data)
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

  // const handleFileUpload = async () => {
  //   if (!file || !selectedJob) {
  //     setError("Please select a resume file.")
  //     return
  //   }

  //   setUploading(true)
  //   setError(null)

  //   const formData = new FormData()
  //   formData.append("file", file)
  //   formData.append("job_id", selectedJob.id.toString())

  //   try {
  //     const response = await axios.post(`${BASE_URL}/screen`, formData)
  //     console.log("🎯 Required Skills:", response.data.required_skills)
  //     setSelectedJob(null)
  //     setFile(null)
  //     toast.success("Resume uploaded successfully!")
  //   } catch (error) {
  //     const message = error?.response?.data?.detail || "Failed to upload resume. Please try again."
  //     console.error("❌ Upload error:", error)
  //     setError(message)
  //     toast.error(message)
  //   } finally {
  //     setUploading(false)
  //   }
  // }

    const handleFileUpload = async () => {
    if (!file || !selectedJob) {
      setError("Please select a resume file.")
      return
    }

    // Close the file upload dialog immediately
    setSelectedJob(null)

    setUploading(true) // Disable the submit button (though dialog is closing)
    setError(null) // Clear any previous errors

    // Open the processing modal and set initial step
    setShowProcessingModal(true)
    setProcessingStep("Uploading resume...")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("job_id", selectedJob.id.toString()) // Use selectedJob from closure

    try {
      // Simulate initial upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update step to analyzing
      setProcessingStep("Analyzing the resume...")
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Perform the actual API call
      const response = await axios.post(`${BASE_URL}/screen`, formData)
      console.log("🎯 Required Skills:", response.data.required_skills)

      // Update step to sending to admin
      setProcessingStep("Sending to the admin...")
      // Simulate final sending delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Close processing modal and show success toast
      setShowProcessingModal(false)
      setFile(null) // Clear selected file
      toast.success("Resume uploaded successfully!")

    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to upload resume. Please try again."
      console.error("❌ Upload error:", error)
      // Close processing modal and show error toast
      setShowProcessingModal(false)
      setError(message) // This error might be displayed on the main page if the dialog is closed
      toast.error(message)
    } finally {
      setUploading(false) // Reset uploading state
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

  const now = new Date()
  const filteredJobs = jobs
  .filter((job) => new Date(job.deadline) > now) 
  .filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  )


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="p-4 bg-white rounded-full shadow-lg mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Loading Opportunities</h3>
            <p className="text-slate-600 text-sm sm:text-base">Fetching the latest job openings for you...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-blue-100 w-full sm:w-auto text-sm sm:text-base"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Home</span>
            <span className="inline sm:hidden">Home</span>
          </Button>

          <Button
            onClick={() => navigate("/resume-analyzer")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
          >
            <Brain className="w-4 h-4 mr-2 sm:mr-0" />
            <span className="hidden sm:inline">Analyse Your Resume Against Jobs</span>
            <span className="inline sm:hidden">Analyze Resume</span>
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Career Opportunities
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover exciting career opportunities and take the next step in your professional journey
          </p>

          {jobs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6">
              <div className="flex items-center gap-2 text-slate-600 text-sm sm:text-base">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {jobs.length} Open Position{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm sm:text-base">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Apply Today</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert className="mb-8 max-w-2xl mx-auto text-sm sm:text-base" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Input */}
        {jobs.length > 0 && (
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search jobs by title, department, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-slate-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        )}

        {filteredJobs.length === 0 && jobs.length > 0 ? (
          <Card className="max-w-2xl mx-auto shadow-lg bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-16">
              <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-6">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Matching Jobs Found</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Your search did not return any job opportunities. Please try a different search term.
              </p>
            </CardContent>
          </Card>
        ) : filteredJobs.length === 0 && jobs.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-lg bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="text-center py-16">
              <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-6">
                <FileText className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Active Positions</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                There are currently no active job opportunities available. Please check back later for new openings.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg sm:text-xl line-clamp-2 text-slate-900 leading-tight">
                      {job.title}
                    </CardTitle>
                    {isDeadlineSoon(job.deadline) && (
                      <Badge variant="destructive" className="shrink-0 shadow-sm text-xs sm:text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pt-0">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm sm:text-base text-slate-600">
                      <div className="p-1 bg-blue-50 rounded mr-3">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{job.department}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-slate-600">
                      <div className="p-1 bg-green-50 rounded mr-3">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-slate-600">
                      <div className="p-1 bg-orange-50 rounded mr-3">
                        <CalendarDays className="h-4 w-4 text-orange-600" />
                      </div>
                      <span>Deadline: {formatDeadline(job.deadline)}</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-slate-200" />

                  <JobDescription description={job.description} />
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    onClick={() => setSelectedJob(job)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2 sm:mr-0" />
                    <span className="hidden sm:inline">Apply Now</span>
                    <span className="inline sm:hidden">Apply</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white/95 backdrop-blur-sm border-slate-200 rounded-lg p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl text-slate-900">Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription className="text-slate-600 text-sm sm:text-base">
                Upload your resume to apply for this position. We accept PDF and DOCX formats.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-sm sm:text-base">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <label htmlFor="resume" className="text-sm sm:text-base font-semibold text-slate-900">
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
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-slate-200 text-sm sm:text-base"
                  />
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm sm:text-base text-green-600 bg-green-50 rounded-lg py-2 px-3">
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
                className="border-slate-200 text-slate-600 hover:bg-slate-50 w-full sm:w-auto text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2 sm:mr-0" />
                    <span className="hidden sm:inline">Submit Application</span>
                    <span className="inline sm:hidden">Submit</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

 {/* New Dialog for Processing Animation */}
        <Dialog open={showProcessingModal}>
          <DialogContent
            className="w-[90vw] max-w-sm bg-white/95 backdrop-blur-sm border-slate-200 rounded-lg p-6 text-center"
            onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
            onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing on ESC key
          >
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-6" />
              <DialogTitle className="text-xl font-semibold text-slate-900 mb-2">
                {processingStep}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm">
                Please wait, this may take a moment.
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>





      </div>
    </div>
  )
}
