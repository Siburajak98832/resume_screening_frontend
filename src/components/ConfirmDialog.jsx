import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

export default function ConfirmDialog({ message = "Are you sure?", onConfirm, children }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
        </DialogHeader>
        <DialogDescription/>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost"  onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
