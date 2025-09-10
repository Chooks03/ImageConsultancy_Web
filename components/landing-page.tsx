"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Menu, X, Camera, Palette, Users, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const instagramUrl = "https://www.instagram.com/imageconsultant_harsha?igsh=YTR2dDJmdGR3Y2k0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 relative">
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/consultation-bg.png')",
        }}
      ></div>
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    SRI HARSHAVARDHINI
                  </h1>
                  <p className="text-xs text-muted-foreground">IMAGE CONSULTANCY SERVICE</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-rose-600 transition-colors">
                  Home
                </Link>
                {user && (
                  <>
                    <Link href="/about" className="text-gray-700 hover:text-rose-600 transition-colors">
                      About
                    </Link>
                    <Link href="/appointments" className="text-gray-700 hover:text-rose-600 transition-colors">
                      Appointments
                    </Link>
                    <Link href="/contact" className="text-gray-700 hover:text-rose-600 transition-colors">
                      Contact
                    </Link>
                  </>
                )}
              </nav>

              {/* Instagram Icon */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(instagramUrl, "_blank")}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  title="Visit our Instagram page"
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    className="border-rose-300 text-rose-600 hover:bg-rose-50"
                  >
                    My Profile
                  </Button>
                ) : null}
              </div>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 border-t pt-4">
                <div className="flex flex-col space-y-4">
                  <Link href="/" className="text-gray-700 hover:text-rose-600 transition-colors">
                    Home
                  </Link>
                  {user && (
                    <>
                      <Link href="/about" className="text-gray-700 hover:text-rose-600 transition-colors">
                        About
                      </Link>
                      <Link href="/appointments" className="text-gray-700 hover:text-rose-600 transition-colors">
                        Appointments
                      </Link>
                      <Link href="/contact" className="text-gray-700 hover:text-rose-600 transition-colors">
                        Contact
                      </Link>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => window.open(instagramUrl, "_blank")}
                    className="justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Visit Instagram Page
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your Image,
                <br />
                Transform Your Life
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Professional image consultancy services to help you discover your unique style, boost confidence, and
                make lasting impressions in every aspect of your life.
              </p>
            </div>

            {/* Center Login/Signup Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/login")}
                className="border-2 border-rose-500 text-rose-600 hover:bg-rose-50 px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                Login
              </Button>
            </div>

            {/* Instagram CTA */}
            <Card className="max-w-md mx-auto mb-16 bg-gradient-to-r from-pink-50 to-purple-50 border-rose-200">
              <CardContent className="p-6 text-center">
                <Instagram className="w-8 h-8 text-rose-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Follow Us on Instagram</h3>
                <p className="text-sm text-gray-600 mb-4">Get daily style tips and transformation stories</p>
                <Button
                  onClick={() => window.open(instagramUrl, "_blank")}
                  variant="outline"
                  className="w-full border-rose-300 text-rose-600 hover:bg-rose-50 bg-transparent"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Visit Instagram Page
                </Button>
              </CardContent>
            </Card>

            {/* Services Preview */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Style Consultation</h3>
                  <p className="text-sm text-gray-600">Personalized style analysis and wardrobe planning</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Personal Branding</h3>
                  <p className="text-sm text-gray-600">Build a powerful personal brand that stands out</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Confidence Coaching</h3>
                  <p className="text-sm text-gray-600">Boost your confidence and self-presentation skills</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Sri Harshavardhini Image Consultancy Service</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Sri Harshavardhini Image Consultancy Service. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
