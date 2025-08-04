import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
import { toast } from "sonner"

const SMTPConfigForm = ({ adminEmail }) => {
  const [config, setConfig] = useState({
    email: adminEmail,
    smtp_host: "",
    smtp_port: "",
    smtp_username: "",
    smtp_password: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/config/${adminEmail}`)
        setConfig((prev) => ({ ...prev, ...res.data }))
      } catch (err) {
        console.warn("No existing SMTP config found for admin.")
      }
    }

    if (adminEmail) fetchConfig()
  }, [adminEmail])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/config`, config)
      toast({ title: "SMTP config saved successfully" })
    } catch (err) {
      toast({ title: "Failed to save SMTP config", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow border max-w-lg">
      <h2 className="text-xl font-bold text-slate-800">Your SMTP Email Configuration</h2>

      <Input
        placeholder="SMTP Host"
        value={config.smtp_host}
        onChange={(e) => setConfig({ ...config, smtp_host: e.target.value })}
      />
      <Input
        placeholder="SMTP Port"
        value={config.smtp_port}
        onChange={(e) => setConfig({ ...config, smtp_port: e.target.value })}
      />
      <Input
        placeholder="SMTP Username"
        value={config.smtp_username}
        onChange={(e) => setConfig({ ...config, smtp_username: e.target.value })}
      />
      <Input
        placeholder="SMTP Password"
        type="password"
        value={config.smtp_password}
        onChange={(e) => setConfig({ ...config, smtp_password: e.target.value })}
      />

      <Button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Configuration"}
      </Button>
    </div>
  )
}

export default SMTPConfigForm
