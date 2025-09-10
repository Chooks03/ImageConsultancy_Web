import { Camera } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
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
  )
}
