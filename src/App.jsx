
// App.jsx – handles auth state, user/admin info, layout, and routes

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "./firebase"
import { BrowserRouter } from "react-router-dom"
import AppLayout from "./AppLayout"
import AppRoutes from "./AppRoutes"
import { doc, getDoc } from "firebase/firestore"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin")
        }
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])





  // if (loading) {
  //   return <div className="p-4 text-center text-slate-600">Loading...</div>
  // }
if (loading) {
  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
        <p className="text-sm text-slate-600">Loading</p>
      </div>
    </div>
  )
}

  return (
    <BrowserRouter>
      <AppLayout user={user} isAdmin={isAdmin}>
        <AppRoutes user={user} isAdmin={isAdmin} />
      </AppLayout>
    </BrowserRouter>
  )
}

