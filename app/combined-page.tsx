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
import Home from "./home/page";

export default function CombinedPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-purple-50">
      
      {/* Home Page Section (replacing welcome section) */}
      <section id="home" className="scroll-mt-[80px] max-w-6xl mx-auto my-10 px-4 sm:px-6">
        <Home />
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
