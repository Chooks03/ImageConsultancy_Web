"use client";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-vertical-stripes">

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 mx-auto shadow-none md:shadow-xl bg-white bg-opacity-100 md:rounded-none overflow-visible md:my-20">

        {/* ✅ Left Section (Simplified) */}
        <div className="flex flex-col justify-center items-start h-full py-12 px-4 sm:px-12 bg-transparent">
          <span className="bg-green-900 text-white px-7 py-3 text-lg sm:text-xl font-medium mb-8 rounded select-none tracking-wider shadow">
            WELCOME TO
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-green-900 leading-tight tracking-wide">
            IMAGE ISLAND
          </h1>
        </div>

        {/* ✅ Right Section (unchanged) */}
        <div className="flex flex-col justify-center md:items-center items-start bg-[#e6f4ec]/90 border-l-0 md:border-l-4 border-green-800 py-12 px-4 sm:px-12">
          <div className="w-full md:w-4/5 text-right text-green-900 mb-6 select-none leading-normal">
            <p className="font-bold text-lg md:text-xl">
              SRIHARSHAVARDHINI
            </p>
            <p className="md:text-lg">Image Consultant</p>
            <p className="italic md:text-md">AICI VP Membership, Delhi Chapter</p>
          </div>
          <p className="text-green-900 text-left text-xl md:text-2xl font-normal leading-relaxed mb-8 md:w-4/5" style={{ letterSpacing: "0.5px" }}>
            Your presence deserves to be as striking as your ambition.<br />
            Let us design the image that tells your story with poise,
            power, and beauty.
          </p>
          <p className="text-green-900 font-bold mb-6 text-lg md:text-xl md:w-4/5">
            Book Your Consultation Today
          </p>
          <button className="flex items-center gap-2 bg-green-900 text-white px-6 py-3 rounded-full hover:bg-green-700 transition w-max text-lg font-semibold shadow">
            <span className="text-xl">📅</span>
            <span>BOOK NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
