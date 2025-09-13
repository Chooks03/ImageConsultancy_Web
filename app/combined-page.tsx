"use client";

import React, { useEffect, useState } from "react";
import About from "./about/page";
import Contact from "./contact/page";
import FAQ from "./faq/page";
import Instagram from "./instagram/page";
import Payment from "./payment/page";
import Signup from "./signup/page";
import Login from "./login/page";
import ForgotPassword from "./forgot-password/page";
import Appointments from "./appointments/page";
import OurServices from "./services/page";
import Footer from "../components/footer";
import Home from "./home/page";

export default function CombinedPage() {
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;
      const rect = header.getBoundingClientRect();
      setShowArrow(rect.bottom < 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-purple-50 overflow-x-hidden">
      {/* Each section fills viewport height using min-h-screen */}
      {/* Flex and centering to use full screen area */}

      <section
        id="home"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<Home />}</div>
      </section>

      <section
        id="about"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<About />}</div>
      </section>

      <section
        id="our-services"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<OurServices />}</div>
      </section>

      <section
        id="appointments"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<Appointments />}</div>
      </section>

      <section
        id="faq"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<FAQ />}</div>
      </section>

      <section
        id="instagram"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<Instagram />}</div>
      </section>

      <section
        id="contact"
        className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-[100vw] w-full">{<Contact />}</div>
      </section>

      <Footer />

      {/* Back To Top Button */}
      {showArrow && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 bg-green-900 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
