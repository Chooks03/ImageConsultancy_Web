"use client"

import { useRouter } from "next/navigation"
//import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, MapPin, Clock, Phone } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()
  const instagramUrl = "https://www.instagram.com/imageconsultant_harsha?igsh=YTR2dDJmdGR3Y2k0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-purple-100">
      {/* <Header /> */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-green-700 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Google Map Card with map-like subtle blue-gray background */}
            <Card className="overflow-hidden border border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-blue-50">
              <div className="h-64 bg-blue-100 rounded-t-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d77.8!3d9.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00d0c8c8c8c8c8%3A0x1234567890abcdef!2s55C%20Velayutham%20Rd%2C%20Sivakasi%2C%20Tamil%20Nadu%20626123%2C%20India!5e0!3m2!1sen!2sin!4v1627309416135!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Studio Location - 55C Velayutham Rd, Sivakasi"
                ></iframe>
              </div>
              <CardContent className="p-8 text-gray-800">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Studio Location</h3>
                      <p>55C Velayutham Rd</p>
                      <p>Sivakasi, Tamil Nadu - 626123</p>
                      <p>India</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Working Hours</h3>
                      <p>Monday to Friday: 9 AM to 7 PM</p>
                      <p>Saturday & Sunday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-green-700 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p>+91 7826071703</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instagram Card with Instagram-inspired soft gradient bg */}
            <Card className="border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-pink-50 via-purple-50 to-purple-100">
              <CardContent className="p-8 text-gray-800">
                <h2 className="text-3xl font-semibold mb-8 text-purple-700">Connect With Us</h2>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="w-28 h-28 mx-auto bg-gradient-to-r from-rose-500 to-purple-700 rounded-full flex items-center justify-center mb-5 shadow-lg">
                      <Instagram className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-purple-800">Follow on Instagram</h3>
                    <p className="mb-6">
                      Get daily style tips and transformation stories
                    </p>
                    <Button
                      onClick={() => window.open(instagramUrl, "_blank")}
                      className="bg-gradient-to-r from-rose-500 to-purple-700 hover:from-green-700 hover:to-purple-800 shadow-lg"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      @imageconsultant_harsha
                    </Button>
                  </div>

                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Book Your 1:1 Image Consulting Session</h3>
                    <p className="mb-6">
                      Unlock the style that reflects you. Schedule an appointment today!
                    </p>
                    <Button
                      onClick={() => router.push("/appointments")}
                      variant="outline"
                      className="w-full border-green-600 text-green-700 hover:bg-green-100 hover:border-green-700"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
