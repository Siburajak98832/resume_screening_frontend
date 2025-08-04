
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SenderCredentialsModal({ open, setOpen, onSave }) {
  const [email, setEmail] = useState("")
  const [passkey, setPasskey] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address")
      return
    }
    if (!passkey || passkey.length < 10) {
      toast.error("Invalid Google App Password")
      return
    }
    onSave(email, passkey)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
                className="sm:max-w-md w-[90vw] max-w-[400px] bg-white rounded-xl p-6"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
                >
        <DialogHeader>
          <DialogTitle>Configure Sender Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sender-email">Email Address</Label>
            <Input
              id="sender-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="app-passkey">Google App Password</Label>
            <Input
              id="app-passkey"
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="16-character passkey"
            />
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowInstructions(!showInstructions)}
            onKeyDown={(e) => e.key === "Enter" && setShowInstructions(!showInstructions)}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
          >
            {showInstructions ? "Hide setup steps" : "How to generate a Google App Password?"}
          </div>
          {showInstructions && (
            <div className="p-3 rounded-md border text-sm bg-slate-50 text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Go to{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Google Account Security
                  </a>
                </li>
                <li>Enable 2-Step Verification.</li>
                <li>Click on <strong>App passwords</strong> under “Signing in to Google.”</li>
                <li>Generate a 16-digit app password for "Mail".</li>
                <li>Paste the key here. Do not share it.</li>
              </ol>
              <p className="text-xs text-slate-500">Your credentials are only used temporarily to send emails.</p>
            </div>
          )}
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

