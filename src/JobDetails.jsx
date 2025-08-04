// JobDetails.jsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    axios.get(`${BASE_URL}/jobs`) // Or create a `/jobs/{id}` API if needed
      .then(res => {
        const match = res.data.find(j => j.id === parseInt(id))
        setJob(match)
      })
  }, [id])

  if (!job) return <div className="p-4">Loading job details...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-muted-foreground mb-2">{job.location} | {job.department}</p>
      <p className="mb-4">{job.description}</p>
      <p className="font-medium">Required Skills: {job.required_skills}</p>
    </div>
  )
}
