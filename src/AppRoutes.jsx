// AppRoutes.jsx – centralized routing

import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import ResumeUploader from "./ResumeUploader"
import AdminDashboard from "./AdminDashboard"
import ResumeAnalyzer from "./ResumeAnalyzer"
import JobsPage from "./JobsPage"
import UserJobBoard from "./UserJobBoard"
import AuthForm from "./AuthForm"

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/auth" replace />
}

function AdminRoute({ user, isAdmin, children }) {
  return user && isAdmin ? children : <Navigate to="/auth" replace />
}

export default function AppRoutes({ user, isAdmin }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/jobpages" element={<JobsPage />} />
      <Route path="/user-jobboard" element={<UserJobBoard />} />

      <Route
        path="/uploader"
        element={<PrivateRoute user={user}><ResumeUploader /></PrivateRoute>}
      />
      <Route
        path="/resume-analyzer"
        element={<PrivateRoute user={user}><ResumeAnalyzer /></PrivateRoute>}
      />
      <Route
        path="/admin"
        element={<AdminRoute user={user} isAdmin={isAdmin}><AdminDashboard /></AdminRoute>}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
