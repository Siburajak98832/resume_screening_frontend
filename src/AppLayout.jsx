
"use client"

import { useEffect, useState } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import ResumeUploader from "./ResumeUploader"
import AdminDashboard from "./AdminDashboard"
import ResumeAnalyzer from "./ResumeAnalyzer"
import JobsPage from "./JobsPage"
import UserJobBoard from "./UserJobBoard"
import AuthForm from "./AuthForm"
import LandingPage from "./components/LandingPage"
import { Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, BarChart3, LogOut, HomeIcon, Brain, Menu } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [showNavbar, setShowNavbar] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  // Update navbar visibility based on path
  useEffect(() => {
    const hiddenPaths = ["/", "/auth"]
    setShowNavbar(!hiddenPaths.includes(currentPath))
  }, [currentPath])

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon className="h-4 w-4" /> },
    { path: "/jobpages", label: "Job Board", icon: <Briefcase className="h-4 w-4" /> },
    { path: "/admin", label: "Admin Dashboard", icon: <BarChart3 className="h-4 w-4" />, adminOnly: true },
  ]

  const getUserInitials = (user) => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.charAt(0)?.toUpperCase() || "?"
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            Resumind
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-indigo-600 text-white">{getUserInitials(user)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Admin Access
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map(
              (item) =>
                (!item.adminOnly || isAdmin) && (
                  <Button
                    key={item.path}
                    variant={currentPath === item.path ? "default" : "ghost"}
                    className="w-full justify-start h-12"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                ),
            )}
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {showNavbar && user && (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Resumind</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map(
                (item) =>
                  (!item.adminOnly || isAdmin) && (
                    <Button
                      key={item.path}
                      variant={currentPath === item.path ? "default" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-2"
                    >
                      {item.icon}
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  ),
              )}

              {/* Desktop User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-600 text-white">{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="flex-col items-start">
                    <span className="font-medium">{user?.email}</span>
                    {isAdmin && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Admin Access
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </header>
      )}

      <main className={showNavbar ? "container mx-auto px-4 py-6" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage setShowNavbar={setShowNavbar} />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/jobpages" element={<JobsPage />} />
          <Route path="/uploader" element={<ResumeUploader />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/user-jobboard" element={<UserJobBoard />} />
          <Route path="/admin" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  )
}
