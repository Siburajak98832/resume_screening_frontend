"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileText, Briefcase, Users, Target, Zap } from "lucide-react"

export default function LandingPage({ setShowNavbar }) {
  const navigate = useNavigate()

  const handleJobOpportunities = () => {
    setShowNavbar(false)
    navigate("/user-jobboard")
  }

  const handleAdminLogin = () => {
    setShowNavbar(true)
    navigate("/admin")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Resumind</span>
            </div>
            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Post Jobs
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">AI-Powered Resume Screening</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your hiring process with intelligent candidate matching and comprehensive resume analysis
            </p>

            {/* Main Action Button */}
            <Button
              onClick={handleJobOpportunities}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-sm"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Explore Job Opportunities
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">AI-powered candidate screening with precision matching</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Analysis</h3>
              <p className="text-gray-600 text-sm">Comprehensive skill assessment and evaluation</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600 text-sm">Lightning-fast results with instant feedback</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2025 Resumind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
