"use client";

import About from "./about/page";
import Contact from "./contact/page";
import FAQ from "./faq/page";
import Instagram from "./instagram/page";
import Payment from "./payment/page";
import Signup from "./signup/page";
import Login from "./login/page";
import ForgotPassword from "./forgot-password/page";
import Appointments from "./appointments/page";
import OurServices from "./our-services/page";
import Footer from "../components/footer";

export default function CombinedPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-purple-50">
      
      {/* Home Page Section (replacing welcome section) */}
      <section id="home" className="scroll-mt-[80px] max-w-6xl mx-auto my-10 px-4 sm:px-6">
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden rounded-lg shadow-xl">
          {/* Background Stripes */}
          <div className="absolute inset-0 striped-bg -z-10" />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
            
            {/* Left Section */}
            <div className="flex flex-col justify-center px-4 sm:px-6 md:px-12 py-10 sm:py-16 bg-white rounded-l-lg">
              <span className="bg-green-900 text-white px-3 py-1 text-xs sm:text-sm font-semibold w-max mb-6 rounded-sm select-none">
                WELCOME TO
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-green-900">
                THE <br />
                IMAGE{" "}
                <span className="inline-block relative">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-serif">I</span>
                  <span className="absolute left-1/2 top-1/2 text-xs sm:text-sm font-serif text-green-900 select-none transform -translate-x-1/2 -translate-y-1/2">
                    Subtansandae
                  </span>
                </span>
                LAND
              </h1>
            </div>
            
            {/* Right Section */}
            <div className="flex flex-col justify-center px-4 sm:px-6 md:px-12 py-10 sm:py-16 bg-green-50 border-l-0 md:border-l-4 border-green-800 rounded-r-lg">
              <div className="text-right text-xs sm:text-sm md:text-base text-green-900 mb-6 select-none">
                <p className="font-bold">SRIHARSHAVARDHINI</p>
                <p>Image Consultant</p>
                <p className="italic">AICI VP Membership, Delhi Chapter</p>
              </div>

              <p className="text-green-900 text-base sm:text-lg md:text-xl leading-relaxed mb-8">
                Your presence deserves to be as striking as your ambition. 
                Let us design the image that tells your story with poise, 
                power, and beauty.
              </p>

              <p className="text-green-900 font-semibold text-base sm:text-lg mb-6">
                Book Your Consultation Today
              </p>

              <button className="flex items-center gap-2 bg-green-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-green-700 transition w-max">
                <span className="text-xl">📅</span> BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Other Page Sections */}
      <section id="about" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <About />
      </section>

      <section id="our-services" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <OurServices />
      </section>

      <section id="appointments" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <Appointments />
      </section>

      <section id="faq" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <FAQ />
      </section>

      <section id="instagram" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <Instagram />
      </section>

      <section id="contact" className="scroll-mt-[80px] max-w-4xl mx-auto my-10 px-4 sm:px-6">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}
