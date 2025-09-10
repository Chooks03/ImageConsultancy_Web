"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleBookNowClick = () => {
    if (user) {
      router.push("/appointments");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-vertical-stripes-lighter px-4 sm:px-6 md:px-10">
      {/* WELCOME TO box outside the white rectangle */}
      <div className="relative w-full flex justify-start z-20 mt-16 sm:mt-20">
        <span className="bg-green-900 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-xl font-medium rounded select-none tracking-wider shadow ml-4 sm:ml-8 max-w-max">
          WELCOME TO
        </span>
      </div>
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto py-16 gap-10 md:gap-20">
        {/* Left: White box with IMAGE ISLAND */}
        <div className="bg-white rounded-lg shadow-xl px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-start w-full max-w-sm sm:max-w-md md:max-w-lg min-w-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-green-900 leading-tight tracking-wide flex flex-wrap items-center">
            THE&nbsp;
            <span className="mr-1">IMAGE</span>
            <span className="inline-flex items-center justify-center">
              I
              <img
                src="/WhatsApp_Image_2025-08-06_at_00.12.04_9d5caab6-removebg-preview.png"
                alt="Logo S"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 align-middle mx-0"
                style={{ verticalAlign: "middle" }}
              />
              LAND
            </span>
          </h1>
        </div>

        {/* Right: Consultant info, adaptive width */}
        <div
          className="flex flex-col justify-center items-center bg-transparent px-4 py-8 sm:py-10 md:py-0 md:px-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-center md:text-left"
          style={{ minWidth: "320px" }}
        >
          <div className="w-full text-center md:text-right text-green-900 mb-6 select-none leading-normal bg-[#e6f4ec] rounded-lg px-4 py-3 shadow-sm">
            <p className="font-bold text-lg sm:text-xl">SRIHARSHAVARDHINI</p>
            <p className="sm:text-lg">Image Consultant</p>
            <p className="italic sm:text-base mb-4">
              AICI VP Membership, Delhi Chapter
            </p>
            <p
              className="text-green-900 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-full"
              style={{ letterSpacing: "0.5px" }}
            >
              Your presence deserves to be as striking as your ambition.
              <br />
              Let us design the image that tells your story with poise, power,
              and beauty.
            </p>
            <p className="text-green-900 font-bold mb-6 text-lg sm:text-xl max-w-full">
              Book Your Consultation Today
            </p>

            <button
              onClick={handleBookNowClick}
              className="flex items-center gap-2 bg-green-900 text-white px-6 py-3 rounded-full hover:bg-green-700 transition w-max text-lg font-semibold shadow mx-auto md:mx-0"
            >
              <span className="text-xl">📅</span>
              <span>BOOK NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
