
// "use client"

// import { useEffect, useState,useContext } from "react"
// import axios from "axios"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,DialogDescription } from "@/components/ui/dialog"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   Briefcase,
//   Users,
//   TrendingUp,
//   Plus,
//   Search,
//   SortAsc,
//   SortDesc,
//   Eye,
//   Trash2,
//   Pencil,
//   Building2,
//   MapPin,
//   Calendar,
//   Mail,
//   Award,
//   Clock,
// } from "lucide-react"
// import { toast } from "sonner"

// import { auth } from "@/firebase" 
// import { onAuthStateChanged } from "firebase/auth"
// import { useNavigate } from "react-router-dom"



// export default function AdminDashboard() {
//   const BASE_URL = import.meta.env.VITE_API_BASE_URL
//   const navigate = useNavigate()
//   const [jobs, setJobs] = useState([])
//   const [logs, setLogs] = useState([])
//   const [filteredLogs, setFilteredLogs] = useState([])

//   const [search, setSearch] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [jobFilter, setJobFilter] = useState("all")
//   const [sortBy, setSortBy] = useState("timestamp")
//   const [sortOrder, setSortOrder] = useState("desc")
//   const [uid, setUid] = useState(null)
//   const [errors, setErrors] = useState({})

//   const [newJob, setNewJob] = useState({
//     title: "",
//     description: "",
//     department: "",
//     location: "",
//     deadline: "",
//     required_skills: "",
//     company_name: "",
//   })
//   const [editJobId, setEditJobId] = useState(null)
//   const [open, setOpen] = useState(false)
// // const [uid, setUid] = useState(null)

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       setUid(user.uid)
//     } else {
//       // Redirect to login if not logged in
//       navigate("/auth")
//     }
//   })

//   return () => unsubscribe()
// }, [])

//   const fetchAdminData = async () => {
//   if (!uid) return

//   try {
//     const jobsRes = await axios.get(`${BASE_URL}/admin/jobs?created_by=${uid}`)
//     const logsRes = await axios.get(`${BASE_URL}/admin/logs?created_by=${uid}`)
//     setJobs(jobsRes.data || [])
//     setLogs(logsRes.data || [])
//   } catch {
//     toast.error("Failed to fetch data")
//   }
// }

// useEffect(() => {
//   if (uid) fetchAdminData()
// }, [uid])

//   useEffect(() => {
//     filterLogs()
//   }, [search, statusFilter, jobFilter, logs, sortBy, sortOrder])

//   const filterLogs = () => {
//     let filtered = [...logs]

//     if (search)
//       filtered = filtered.filter(
//         (l) =>
//           l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()),
//       )

//     if (statusFilter !== "all")
//       filtered = filtered.filter((l) => l.status?.toLowerCase() === statusFilter.toLowerCase())

//     if (jobFilter !== "all") filtered = filtered.filter((l) => l.job_title === jobFilter)

//     filtered.sort((a, b) => {
//       let valA, valB
//       if (sortBy === "name") {
//         valA = a.name?.toLowerCase() || ""
//         valB = b.name?.toLowerCase() || ""
//       } else if (sortBy === "score") {
//         valA = Number.parseFloat(a.final_score) || 0
//         valB = Number.parseFloat(b.final_score) || 0
//       } else {
//         valA = new Date(a.timestamp)
//         valB = new Date(b.timestamp)
//       }

//       return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1
//     })

//     setFilteredLogs(filtered)
//   }

//   const sendEmail = async (log, status) => {
//     try {
//       await axios.post(`${BASE_URL}/send-email`, {
//         email: log.email,
//         name: log.name,
//         status,
//         best_role: log.role,
//         score: log.final_score,
//         job_id: log.job_id,
//       })
//       toast.success(`Email sent to ${log.email}`)
//     } catch(err) {
//       console.error(err.response?.data || err.message)
//       toast.error("Failed to send email")
//     }
//   }

//   const viewResume = (email) => {
//     const encoded = encodeURIComponent(email)
//     const url = `${BASE_URL}/resumes/${encoded}`

//     console.log("Opening resume:", url)
//     const win = window.open(url, "_blank")
//     if (!win) {
//       toast.error("Popup blocked. Please allow popups for this site.")
//     }
//   }

//   const deleteApplication = async (email, job_id) => {
//     try {
//       await axios.delete(`${BASE_URL}/logs/${encodeURIComponent(email)}/${job_id}`)
//       toast.success("Application deleted")
//       fetchAdminData()
//     } catch {
//       toast.error("Failed to delete application")
//     }
//   }

//   const handleEdit = (job) => {
//     setNewJob(job)
//     setEditJobId(job.id)
//     setOpen(true)
//   }

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/jobs/${id}`)
//       toast.success("Job deleted")
//       fetchAdminData()
//     } catch {
//       toast.error("Failed to delete job")
//     }
//   }

// const postOrUpdateJob = async () => {
//   if (!validateFields()) return

//   try {
//     const payload = {
//       ...newJob,
//       created_by: uid,
//       deadline: new Date(newJob.deadline).toISOString(),
//     }

//     if (editJobId) {
//       await axios.put(`${BASE_URL}/jobs/${editJobId}`, payload)
//       toast.success("Job updated")
//     } else {
//       await axios.post(`${BASE_URL}/jobs`, payload)
//       toast.success("Job posted")
//     }

//     // ✅ Reset modal form state
//     setNewJob({
//       title: "",
//       description: "",
//       department: "",
//       location: "",
//       required_skills: "",
//       company_name: "",
//       deadline: "",
//     })
//     setEditJobId(null)
//     setOpen(false)

//     fetchAdminData()
//   } catch (err) {
//     console.error(err)
//     toast.error("Failed to save job")
//   }
// }

  

//   const metrics = {
//     jobsPosted: jobs.length,
//     totalApplicants: logs.length,
//     accepted: logs.filter((l) => l.status === "ACCEPTED").length,
//     rejected: logs.filter((l) => l.status === "REJECTED").length,
//   }
//   const validateFields = () => {
//   const newErrors = {}
//   if (!newJob.title?.trim()) newErrors.title = "Job title is required"
//   if (!newJob.description?.trim()) newErrors.description = "Description is required"
//   if (!newJob.department?.trim()) newErrors.department = "Department is required"
//   if (!newJob.location?.trim()) newErrors.location = "Location is required"
//   if (!newJob.required_skills?.trim()) newErrors.required_skills = "Required skills are required"
//   if (!newJob.company_name?.trim()) newErrors.company_name = "Company name is required"

//   if (!newJob.deadline) {
//     newErrors.deadline = "Deadline is required"
//   } else if (new Date(newJob.deadline) <= new Date()) {
//     newErrors.deadline = "Deadline must be in the future"
//   }

//   setErrors(newErrors)
//   return Object.keys(newErrors).length === 0
// }


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto px-6 py-8 max-w-7xl">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
//           <div className="flex items-center gap-4">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
//               <Briefcase className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
//               <p className="text-slate-600 text-lg">Manage job postings and applications</p>
//             </div>
//           </div>
//           {/* <Dialog
//             open={open}
//             onOpenChange={(v) => {
//               setOpen(v)
//               if (!v) setEditJobId(null)
//             }}
//           > */}
//           <Dialog
//                 open={open}
//                 onOpenChange={(v) => {
//                   setOpen(v)
//                   if (!v) {
//                     setEditJobId(null)
//                     setNewJob({
//                       title: "",
//                       description: "",
//                       department: "",
//                       location: "",
//                       required_skills: "",
//                       company_name: "",
//                       deadline: "",
//                     })
//                   }
//                 }}
//               >
//             <DialogTrigger asChild>
//               <Button
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                 size="lg"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 {editJobId ? "Edit Job" : "Post New Job"}
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200">
//               <DialogHeader>
//                 <DialogTitle className="text-xl text-slate-900">
//                   {editJobId ? "Edit Job Posting" : "Create New Job"}
//                 </DialogTitle>
//               </DialogHeader>
//               <DialogDescription>
//                 Please fill in all the required job details below.
//               </DialogDescription>
//               <div className="space-y-4">
//                 <Input
//                   placeholder="Job Title"
//                   value={newJob.title}
//                   onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
//                   className="border-slate-200"
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
//                 <Textarea
//                   placeholder="Job Description"
//                   value={newJob.description}
//                   onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
//                   className="border-slate-200 resize-none"
//                   rows={3}
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.description}</p>}
//                 <div className="grid grid-cols-2 gap-4">
//                   <Input
//                     placeholder="Department"
//                     value={newJob.department}
//                     onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
//                     className="border-slate-200"
//                   />
//                   {errors.title && <p className="text-sm text-red-500">{errors.department}</p>}
//                   <Input
//                     placeholder="Location"
//                     value={newJob.location}
//                     onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
//                     className="border-slate-200"
//                   />
//                   {errors.title && <p className="text-sm text-red-500">{errors.location}</p>}
//                 </div>
//                 <Input
//                   placeholder="Required Skills"
//                   value={newJob.required_skills}
//                   onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
//                   className="border-slate-200"
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.required_skills}</p>}
//                 <Input
//                   placeholder="Company Name"
//                   value={newJob.company_name}
//                   onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
//                   className="border-slate-200"
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.company_name}</p>}
//                 <Input
//                   type="datetime-local"
//                   value={newJob.deadline}
//                   onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
//                   className="border-slate-200"
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.deadline}</p>}
//               </div>
//               <DialogFooter className="gap-3 pt-4">
//                 {/* <Button
//                   variant="outline"
//                   onClick={() => setOpen(false)}
//                   className="border-slate-200 text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </Button> */}
//                                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setOpen(false)
//                     setEditJobId(null)
//                     setNewJob({
//                       title: "",
//                       description: "",
//                       department: "",
//                       location: "",
//                       required_skills: "",
//                       company_name: "",
//                       deadline: "",
//                     })
//                   }}
//                   className="border-slate-200 text-slate-600 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={postOrUpdateJob}
//                   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
//                 >
//                   {editJobId ? "Update" : "Create"}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-6 md:grid-cols-4 mb-8">
//           <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-semibold text-slate-700">Jobs Posted</CardTitle>
//               <div className="p-2 bg-blue-50 rounded-lg">
//                 <Briefcase className="h-5 w-5 text-blue-600" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-slate-900">{metrics.jobsPosted}</div>
//               <p className="text-xs text-slate-600 mt-1">Active positions</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-semibold text-slate-700">Total Applicants</CardTitle>
//               <div className="p-2 bg-green-50 rounded-lg">
//                 <Users className="h-5 w-5 text-green-600" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-slate-900">{metrics.totalApplicants}</div>
//               <p className="text-xs text-slate-600 mt-1">All applications</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-semibold text-slate-700">Accepted</CardTitle>
//               <div className="p-2 bg-emerald-50 rounded-lg">
//                 <Award className="h-5 w-5 text-emerald-600" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-emerald-600">{metrics.accepted}</div>
//               <p className="text-xs text-slate-600 mt-1">Successful candidates</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-semibold text-slate-700">Rejected</CardTitle>
//               <div className="p-2 bg-red-50 rounded-lg">
//                 <TrendingUp className="h-5 w-5 text-red-600" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-red-600">{metrics.rejected}</div>
//               <p className="text-xs text-slate-600 mt-1">Not qualified</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Job Postings */}
//         <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3 text-slate-900">
//               <div className="p-2 bg-indigo-50 rounded-lg">
//                 <Briefcase className="h-5 w-5 text-indigo-600" />
//               </div>
//               Your Job Postings
//               <Badge variant="secondary" className="ml-auto">
//                 {jobs.length} active
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {jobs.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
//                   <Briefcase className="h-8 w-8 text-slate-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-slate-900 mb-2">No Jobs Posted</h3>
//                 <p className="text-slate-600">Create your first job posting to start receiving applications.</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-4">
//                 {jobs.map((job) => (
//                   <Card key={job.id} className="bg-slate-50/50 border-slate-200 hover:bg-slate-50 transition-colors">
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <div className="space-y-2">
//                           <CardTitle className="text-lg text-slate-900">{job.title}</CardTitle>
//                           <p className="text-slate-600 font-medium">{job.company_name?.toUpperCase()}</p>
//                           <div className="flex items-center gap-4 text-sm text-slate-600">
//                             <span className="flex items-center gap-1">
//                               <Building2 className="h-3 w-3" />
//                               {job.department}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <MapPin className="h-3 w-3" />
//                               {job.location}
//                             </span>
//                           </div>
//                           {job.deadline && (
//                             <div className="flex items-center gap-1 text-sm text-slate-600">
//                               <Calendar className="h-3 w-3" />
//                               {new Date(job.deadline).toLocaleDateString()}
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleEdit(job)}
//                             className="border-slate-200 hover:bg-slate-100"
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDelete(job.id)}
//                             className="border-red-200 text-red-600 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardHeader>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Filters */}
//         <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
//           <CardContent className="pt-6">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <Input
//                   placeholder="Search by name or email..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-10 border-slate-200"
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full lg:w-[180px] border-slate-200">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="ACCEPTED">Accepted</SelectItem>
//                   <SelectItem value="REJECTED">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select value={jobFilter} onValueChange={setJobFilter}>
//                 <SelectTrigger className="w-full lg:w-[200px] border-slate-200">
//                   <SelectValue placeholder="Filter by job" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Jobs</SelectItem>
//                   {jobs.map((job) => (
//                     <SelectItem key={job.id} value={job.title}>
//                       {job.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-full lg:w-[160px] border-slate-200">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="timestamp">Date</SelectItem>
//                   <SelectItem value="name">Name</SelectItem>
//                   <SelectItem value="score">Score</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//                 className="border-slate-200 hover:bg-slate-50"
//               >
//                 {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Applications */}
//         <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3 text-slate-900">
//               <div className="p-2 bg-green-50 rounded-lg">
//                 <Users className="h-5 w-5 text-green-600" />
//               </div>
//               Applications
//               <Badge variant="secondary" className="ml-auto">
//                 {filteredLogs.length} found
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {filteredLogs.length === 0 ? (
//               <Alert>
//                 <AlertDescription>No applicants found matching your criteria.</AlertDescription>
//               </Alert>
//             ) : (
//               <div className="space-y-4">
//                 {filteredLogs.map((log) => (
//                   <Card key={log.email + log.job_id} className="border-slate-200 hover:shadow-md transition-shadow">
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-3">
//                             <CardTitle className="text-lg text-slate-900">{log.name}</CardTitle>
//                             <Badge variant="outline" className="border-slate-200">
//                               {log.experience_level}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-2 text-slate-600">
//                             <Mail className="h-4 w-4" />
//                             <a href={`mailto:${log.email}`} className="hover:text-blue-600 transition-colors">
//                               {log.email}
//                             </a>
//                           </div>
//                           <div className="flex items-center gap-4 text-sm text-slate-600">
//                             <span className="flex items-center gap-1">
//                               <Briefcase className="h-3 w-3" />
//                               {log.job_title}
//                             </span>
//                             {/* <span className="flex items-center gap-1">
//                               <Award className="h-3 w-3" />
//                               Score: {log.final_score}
//                             </span> */}
//                             {log.timestamp && (
//                               <span className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {new Date(log.timestamp).toLocaleDateString()}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <Badge variant={log.status === "ACCEPTED" ? "default" : "destructive"} className="shrink-0">
//                           {log.status}
//                         </Badge>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="pt-0">
//                       <div className="flex flex-wrap gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => viewResume(log.email)}
//                           className="border-slate-200 hover:bg-slate-50"
//                         >
//                           <Eye className="w-4 h-4 mr-2" />
//                         </Button>
                        
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => sendEmail(log)}
//                           className="border-grey-200 text-white-600 hover:bg-black-50"
//                         >
//                           <Mail className="w-4 h-4 mr-2" />
//                         </Button>
//                           {/* <SMTPConfigForm adminEmail={user?.email} /> */}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => deleteApplication(log.email, log.job_id)}
//                           className="border-red-200 text-red-600 hover:bg-red-50"
//                         >
//                           <Trash2 className="w-2 h-2 mr-1" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  Trash2,
  Pencil,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  MoreVertical,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import SenderCredentialsModal from "@/components/SenderEmailmodal";
export default function AdminDashboard() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [emailSending, setEmailSending] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [sortBy, setSortBy] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState("desc")
  const [uid, setUid] = useState(null)
  const [errors, setErrors] = useState({})

  // Responsive state
  const [isJobsExpanded, setIsJobsExpanded] = useState(true)
  const [isStatsExpanded, setIsStatsExpanded] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    deadline: "",
    required_skills: "",
    company_name: "",
  })
  const [editJobId, setEditJobId] = useState(null)
  const [open, setOpen] = useState(false)



const [smtpConfig, setSmtpConfig] = useState(null)
const [showSmtpModal, setShowSmtpModal] = useState(false)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
      } else {
        // Redirect to login if not logged in
        navigate("/auth")
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchAdminData = async () => {
    if (!uid) return

    try {
      const jobsRes = await axios.get(`${BASE_URL}/admin/jobs?created_by=${uid}`)
      const logsRes = await axios.get(`${BASE_URL}/admin/logs?created_by=${uid}`)
      setJobs(jobsRes.data || [])
      setLogs(logsRes.data || [])
    } catch {
      toast.error("Failed to fetch data")
    }
  }

  useEffect(() => {
    if (uid) fetchAdminData()
  }, [uid])

  useEffect(() => {
    filterLogs()
  }, [search, statusFilter, jobFilter, logs, sortBy, sortOrder])

  const filterLogs = () => {
    let filtered = [...logs]

    if (search)
      filtered = filtered.filter(
        (l) =>
          l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()),
      )

    if (statusFilter !== "all")
      filtered = filtered.filter((l) => l.status?.toLowerCase() === statusFilter.toLowerCase())

    if (jobFilter !== "all") filtered = filtered.filter((l) => l.job_title === jobFilter)

    filtered.sort((a, b) => {
      let valA, valB
      if (sortBy === "name") {
        valA = a.name?.toLowerCase() || ""
        valB = b.name?.toLowerCase() || ""
      } else if (sortBy === "score") {
        valA = Number.parseFloat(a.final_score) || 0
        valB = Number.parseFloat(b.final_score) || 0
      } else {
        valA = new Date(a.timestamp)
        valB = new Date(b.timestamp)
      }

      return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1
    })

    setFilteredLogs(filtered)
  }

const now = new Date()

const activeJobs = jobs.filter(job => new Date(job.deadline) > now)


  // const sendEmail = async (log, status) => {
  //   setEmailSending(true)
  //   try {
  //     await axios.post(`${BASE_URL}/send-email`, {
  //       email: log.email,
  //       name: log.name||"candidate",
  //       status,
  //       best_role: log.role,
  //       score: log.final_score,
  //       job_id: log.job_id,
  //     })
  //     toast.success(`Email sent to ${log.email}`)
  //   } catch (err) {
  //     console.error(err.response?.data || err.message)
  //     toast.error("Failed to send email")
  //   }finally{
  //     setEmailSending(false)
  //   }
  // }

//   const sendEmail = async (log, status) => {
//   if (!senderCreds) {
//     setShowCredModal(true);
//     return;
//   }
// setEmailSending(true)
//   try {
//     await axios.post(`${BASE_URL}/send-email`, {
//       email: log.email,
//       name: log.name,
//       status,
//       best_role: log.role,
//       score: log.final_score,
//       job_id: log.job_id,
//       sender_email: senderCreds.email,
//       sender_password: senderCreds.passkey,
//     });
//     toast.success(`Email sent to ${log.email}`);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     toast.error("Failed to send email");
//   }
// };


const handleSendEmailToAll = () => {
  if (!smtpConfig) {
    setPendingLog("ALL")  
    setShowSmtpModal(true)
    return
  }
  sendEmailToAll(smtpConfig)
}


const sendEmailToAll = async (smtpConfig) => {
  setEmailSending(true)

  const promises = logs.map(async (log) => {
    try {
      await axios.post(`${BASE_URL}/send-email`, {
        email: log.email,
        name: log.name,
        status: log.status,
        best_role: log.role,
        score: log.final_score,
        job_id: log.job_id,
        sender_email: smtpConfig.email,
        sender_password: smtpConfig.passkey,
      })
      return { email: log.email, status: "sent" }
    } catch (error) {
      return {
        email: log.email,
        status: "failed",
        error: error?.response?.data?.error || "Unknown error"
      }
    }
  })

  const results = await Promise.all(promises)
  const failed = results.filter(r => r.status === "failed")
  const succeeded = results.length - failed.length

  toast.success(`${succeeded} emails sent.`)
  if (failed.length) {
    console.error("Failed emails:", failed)
    toast.error(`${failed.length} emails failed.`)
  }

  setEmailSending(false)
}



const [pendingLog, setPendingLog] = useState(null)
const [pendingStatus, setPendingStatus] = useState(null)

const handleSendEmail = (log, status) => {
  if (!smtpConfig) {
    setPendingLog(log)
    setPendingStatus(status)
    setShowSmtpModal(true)
    return
  }
  sendEmail(log, status, smtpConfig)
}

const sendEmail = async (log, status, smtpConfig) => {
  try {
    await axios.post(`${BASE_URL}/send-email`, {
      email: log.email,
      name: log.name,
      status,
      best_role: log.role,
      score: log.final_score,
      job_id: log.job_id,
      sender_email: smtpConfig.email,
      sender_password: smtpConfig.passkey,
    })
    toast.success(`Email sent to ${log.email}`)
  } catch (err) {
    console.error(err)
    toast.error("Failed to send email")
  }
}



  const viewResume = (email) => {
    const encoded = encodeURIComponent(email)
    const url = `${BASE_URL}/resumes/${encoded}`

    console.log("Opening resume:", url)
    const win = window.open(url, "_blank")
    if (!win) {
      toast.error("Popup blocked. Please allow popups for this site.")
    }
  }

  const deleteApplication = async (email, job_id) => {
    try {
      await axios.delete(`${BASE_URL}/logs/${encodeURIComponent(email)}/${job_id}`)
      toast.success("Application deleted")
      fetchAdminData()
    } catch {
      toast.error("Failed to delete application")
    }
  }

  const handleEdit = (job) => {
    setNewJob(job)
    setEditJobId(job.id)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/jobs/${id}`)
      toast.success("Job deleted")
      fetchAdminData()
    } catch {
      toast.error("Failed to delete job")
    }
  }

  const postOrUpdateJob = async () => {
    if (!validateFields()) return

    try {
      const payload = {
        ...newJob,
        created_by: uid,
        deadline: new Date(newJob.deadline).toISOString(),
      }

      if (editJobId) {
        await axios.put(`${BASE_URL}/jobs/${editJobId}`, payload)
        toast.success("Job updated")
      } else {
        await axios.post(`${BASE_URL}/jobs`, payload)
        toast.success("Job posted")
      }

      // ✅ Reset modal form state
      setNewJob({
        title: "",
        description: "",
        department: "",
        location: "",
        required_skills: "",
        company_name: "",
        deadline: "",
      })
      setEditJobId(null)
      setOpen(false)

      fetchAdminData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to save job")
    }
  }

  const metrics = {
    jobsPosted: activeJobs.length,
    totalApplicants: logs.length,
    accepted: logs.filter((l) => l.status === "ACCEPTED").length,
    rejected: logs.filter((l) => l.status === "REJECTED").length,
  }

  const validateFields = () => {
    const newErrors = {}
    if (!newJob.title?.trim()) newErrors.title = "Job title is required"
    if (!newJob.description?.trim()) newErrors.description = "Description is required"
    if (!newJob.department?.trim()) newErrors.department = "Department is required"
    if (!newJob.location?.trim()) newErrors.location = "Location is required"
    if (!newJob.required_skills?.trim()) newErrors.required_skills = "Required skills are required"
    if (!newJob.company_name?.trim()) newErrors.company_name = "Company name is required"

    if (!newJob.deadline) {
      newErrors.deadline = "Deadline is required"
    } else if (new Date(newJob.deadline) <= new Date()) {
      newErrors.deadline = "Deadline must be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Filters Component
  const FiltersContent = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-slate-200"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="border-slate-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="border-slate-200">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {/* {jobs.map((job) => (
              <SelectItem key={job.id} value={job.title}>
                {job.title}
              </SelectItem>
            ))} */}
            {jobs
              .filter((job) => new Date(job.deadline) > new Date()) // ✅ only active jobs
              .map((job) => (
                <SelectItem key={job.id} value={job.title}>
                  {job.title}
                </SelectItem>
            ))}

          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-slate-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timestamp">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="score">Score</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="border-slate-200 hover:bg-slate-50 justify-center"
        >
          {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
          <span className="hidden sm:inline">{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
        </Button>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg">
                <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Manage job postings and applications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={open}
                onOpenChange={(v) => {
                  setOpen(v)
                  if (!v) {
                    setEditJobId(null)
                    setNewJob({
                      title: "",
                      description: "",
                      department: "",
                      location: "",
                      required_skills: "",
                      company_name: "",
                      deadline: "",
                    })
                    setErrors({})
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">{editJobId ? "Edit Job" : "Post New Job"}</span>
                    <span className="sm:hidden">Post Job</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200"> 
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl text-slate-900 text-center">
                      {editJobId ? "Edit Job Posting" : "Create New Job"}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-center text-slate-600">
                      Please fill in all the required job details below.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="flex-1 px-1 sm:px-2">
                    <div className="space-y-1 sm:space-y-1 py-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                        <Input
                          placeholder="e.g. Senior Software Engineer"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          className="border-slate-200 h-10 sm:h-11"
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
                        <Textarea
                          placeholder="Describe the role, responsibilities, and requirements..."
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                          className="border-slate-200 resize-none overflow-auto min-h-[100px] sm:min-h-[120px] max-h-[200px]"
                          rows={4}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                          <Input
                            placeholder="e.g. Engineering"
                            value={newJob.department}
                            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                            className="border-slate-200 h-10 sm:h-11"
                          />
                          {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                          <Input
                            placeholder="e.g. New York, NY"
                            value={newJob.location}
                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                            className="border-slate-200 h-10 sm:h-11"
                          />
                          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills *</label>
                        <Input
                          placeholder="e.g. React, Node.js, TypeScript, AWS"
                          value={newJob.required_skills}
                          onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                          className="border-slate-200 h-10 sm:h-11"
                        />
                        {errors.required_skills && (
                          <p className="text-xs text-red-500 mt-1">{errors.required_skills}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                        <Input
                          placeholder="e.g. Tech Corp Inc."
                          value={newJob.company_name}
                          onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                          className="border-slate-200 h-10 sm:h-11"
                        />
                        {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Application Deadline *</label>
                        <Input
                          type="datetime-local"
                          value={newJob.deadline}
                          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                          className="border-slate-200 h-10 sm:h-11"
                        />
                        {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter className="flex-shrink-0 gap-3 pt-4 sm:pt-6 flex-col sm:flex-row border-t border-slate-200 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpen(false)
                        setEditJobId(null)
                        setNewJob({
                          title: "",
                          description: "",
                          department: "",
                          location: "",
                          required_skills: "",
                          company_name: "",
                          deadline: "",
                        })
                        setErrors({})
                      }}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 w-full sm:w-auto h-10 sm:h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={postOrUpdateJob}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full sm:w-auto h-10 sm:h-11 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {editJobId ? "Update Job" : "Create Job"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        


        {emailSending && (
            <div className="fixed inset-0 bg-gray bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray dark:bg-gray-900 rounded-lg px-6 py-4 flex items-center gap-4 shadow-xl">
                <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                <span className="text-sm text-black-700 dark:text-black-600">Sending Email...</span>
              </div>
             </div>
          )}


                <SenderCredentialsModal
                open={showSmtpModal}
                setOpen={setShowSmtpModal}
                onSave={(email, passkey) => {
                    const config = { email, passkey }
                    setSmtpConfig(config)
                    setShowSmtpModal(false)

                    if (pendingLog === "ALL") {
                      sendEmailToAll(config)
                    } else {
                      sendEmail(pendingLog, pendingStatus, config)
                    }
                  }}

              />





        {/* Stats Cards - Collapsible on mobile */}
        <Collapsible open={isStatsExpanded} onOpenChange={setIsStatsExpanded} className="mb-6 sm:mb-8">
          <CollapsibleTrigger asChild>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 md:cursor-default">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-slate-900">
                  <span className="text-base sm:text-lg">Dashboard Overview</span>
                  <div className="md:hidden">
                    {isStatsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-4">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-slate-700">Jobs Posted</CardTitle>
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900">{metrics.jobsPosted}</div>
                  <p className="text-xs text-slate-600 mt-1">Active positions</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-slate-700">Total Applicants</CardTitle>
                  <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                    <Users className="h-3 w-3 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900">{metrics.totalApplicants}</div>
                  <p className="text-xs text-slate-600 mt-1">All applications</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-slate-700">Accepted</CardTitle>
                  <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
                    <Award className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="text-xl sm:text-3xl font-bold text-emerald-600">{metrics.accepted}</div>
                  <p className="text-xs text-slate-600 mt-1">Successful candidates</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-slate-700">Rejected</CardTitle>
                  <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg">
                    <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="text-xl sm:text-3xl font-bold text-red-600">{metrics.rejected}</div>
                  <p className="text-xs text-slate-600 mt-1">Not qualified</p>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Job Postings - Collapsible */}
        <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <Collapsible open={isJobsExpanded} onOpenChange={setIsJobsExpanded}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                  <span className="text-base sm:text-lg">Your Job Postings</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {activeJobs.length} active
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isJobsExpanded ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="p-3 sm:p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                      <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No Jobs Posted</h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      Create your first job posting to start receiving applications.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="bg-slate-50/50 border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="space-y-2 min-w-0 flex-1">
                              <CardTitle className="text-base sm:text-lg text-slate-900 truncate">
                                {job.title}
                              </CardTitle>
                              <p className="text-sm text-slate-600 font-medium">{job.company_name?.toUpperCase()}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span className="truncate">{job.department}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{job.location}</span>
                                </span>
                                {job.deadline && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span className="truncate">{new Date(job.deadline).toLocaleDateString()}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex sm:hidden">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-200 bg-transparent w-full"
                                  >
                                    <MoreVertical className="h-4 w-4 mr-2" />
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(job)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(job.id)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="hidden sm:flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(job)}
                                className="border-slate-200 hover:bg-slate-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(job.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Filters - Mobile Sheet, Desktop Inline */}
        <Card className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="sm:hidden">
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-slate-200 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters & Search
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <div className="py-4">
                    <h3 className="text-lg font-semibold mb-4">Filters & Search</h3>
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden sm:block">
              <FiltersContent />
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <span className="text-base sm:text-lg">Applications</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {filteredLogs.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">No applicants found matching your criteria.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.email + log.job_id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <CardTitle className="text-base sm:text-lg text-slate-900 truncate">{log.name}</CardTitle>
                            <Badge variant="outline" className="border-slate-200 text-xs w-fit">
                              {log.experience_level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <a
                              href={`mailto:${log.email}`}
                              className="hover:text-blue-600 transition-colors text-sm truncate"
                            >
                              {log.email}
                            </a>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              <span className="truncate">{log.job_title}</span>
                            </span>
                            {log.timestamp && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(log.timestamp).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={log.status === "ACCEPTED" ? "default" : "destructive"}
                          className="shrink-0 text-xs"
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewResume(log.email)}
                          className="border-slate-200 hover:bg-slate-50 text-xs flex-1 sm:flex-none"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          // onClick={() => sendEmail(log,log.status)}
                          onClick={() => handleSendEmail(log,log.status)}
                          className="border-slate-200 hover:bg-slate-50 text-xs flex-1 sm:flex-none"
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Email</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteApplication(log.email, log.job_id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs flex-1 sm:flex-none"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Button
        onClick={handleSendEmailToAll}
        disabled={emailSending}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {emailSending ? "Sending..." : "Send Email to All"}
      </Button>


    </div>
  )
}
