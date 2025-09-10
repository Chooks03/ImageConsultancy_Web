"use client";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-vertical-stripes-lighter">
      {/* WELCOME TO box outside the white rectangle */}
      <div className="relative w-full flex justify-start z-20" style={{marginTop: '4rem'}}>
        <span className="bg-green-900 text-white px-7 py-3 text-lg sm:text-xl font-medium rounded select-none tracking-wider shadow ml-8">
          WELCOME TO
        </span>
      </div>
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto py-16">
        {/* Left: White box with IMAGE ISLAND */}
        <div className="bg-white rounded-lg shadow-xl px-8 py-10 flex flex-col items-start" style={{ minWidth: '420px', maxWidth: '520px' }}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-green-900 leading-tight tracking-wide flex flex-wrap items-center">
            THE&nbsp;
            <span style={{marginRight: '0.25em'}}>IMAGE</span>
            <span className="inline-flex items-center justify-center">
              I
              <img src="/WhatsApp_Image_2025-08-06_at_00.12.04_9d5caab6-removebg-preview.png" alt="Logo S" className="w-8 h-8 md:w-10 md:h-10 align-middle mx-0" style={{verticalAlign: 'middle'}} />
               LAND
            </span>
          </h1>
        </div>

        {/* Right: Consultant info, reduced width, no partition */}
        <div className="flex flex-col justify-center items-center bg-transparent px-4 py-10 md:py-0 md:px-8" style={{ maxWidth: '400px', minWidth: '320px' }}>
          <div className="w-full text-right text-green-900 mb-6 select-none leading-normal bg-[#e6f4ec] rounded-lg px-4 py-3 shadow-sm">
            <p className="font-bold text-lg md:text-xl">
              SRIHARSHAVARDHINI
            </p>
            <p className="md:text-lg">Image Consultant</p>
            <p className="italic md:text-md">AICI VP Membership, Delhi Chapter</p>
          <p className="text-green-900 text-center text-xl md:text-2xl font-normal leading-relaxed mb-8 w-full" style={{ letterSpacing: "0.5px" }}>
            Your presence deserves to be as striking as your ambition.<br />
            Let us design the image that tells your story with poise,
            power, and beauty.
          </p>
          <p className="text-green-900 font-bold mb-6 text-lg md:text-xl w-full text-center">
            Book Your Consultation Today
          </p>
          
          <button className="flex items-center gap-2 bg-green-900 text-white px-6 py-3 rounded-full hover:bg-green-700 transition w-max text-lg font-semibold shadow mx-auto">
            <span className="text-xl">📅</span>
            <span>BOOK NOW</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
