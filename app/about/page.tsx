"use client";

import React, { useEffect, useState } from "react";

// Typing animation hook
function useTypedText(text: string, start: boolean, speed = 30): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    let timeoutIds: NodeJS.Timeout[] = [];
    for (let i = 0; i <= text.length; i++) {
      const timeoutId = setTimeout(() => setDisplayed(text.slice(0, i)), i * speed);
      timeoutIds.push(timeoutId);
    }
    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [text, start, speed]);
  return displayed;
}

const aboutSections = [
  {
    text: `Hi I'm Sriharshavardhini, an Image Consultant based in Tamil Nadu. I have started my fashion journey from being a freelancing model during my college days. I have a degree in Aeronautical Engineering and have walked several runways simultaneously. I also had a corporate job and used to work as a Developer on a German based IT firm for around a year.`,
    className: "text-[#14532d] font-medium",
    bg: "bg-green-100 bg-opacity-70",
  },
  {
    text: `But fashion was always a part of me even when I'm working I used to style my hair and even coloured it purple blonde. Then I got married and had a baby, that's when the real challenge begins. It's really hard to build a right wardrobe for a mom which is comfortable as well as fashionable.`,
    className: "text-[#14532d]",
    bg: "bg-[#b7e5c2] bg-opacity-60",
  },
  {
    text: `So I started working on myself and curated looks and styles based on my lifestyle and that's how I landed in this amazing career as an image consultant. I took a professional course on being a image consultant. Now I'm a certified image consultant and a colour analyst. Learning from my past experiences I want to provide a personalised consultation service depending on your needs and necessities.`,
    className: "text-[#14532d]",
    bg: "bg-[#c9d6b1] bg-opacity-70",
  },
];

const visionSections = [
  {
    text: `The main vision of my image consultation service is to be sustainably fashionable. We live in a digital world where mass consumption becomes a threat which we forgot to notice. We buy random clothing and accessories just because it's available online and it's easier to make a purchase these days. But we never consider whether the particular item we bought suits our body type or our skin-tone or our climatic conditions.`,
    className: "text-[#14532d] font-semibold",
    bg: "bg-[#d9f0e1] bg-opacity-70",
  },
  {
    text: `We barely pay attention to the fabric composition; we don't mind the fabric used in the making of that particular item. Some fabrics may have endocrine disruptors. So overall people have a wardrobe full of clothes that they can't wear which is a serious problem to oneself both economically and environmentally. All those waste clothes and accessories are just being dumped somewhere but still on earth. This is a serious threat to our planet.`,
    className: "text-[#14532d]",
    bg: "bg-[#b7e5c2] bg-opacity-50",
  },
  {
    text: `My vision is not to make you spend more money on clothes but it is to prevent you from spending your money on the wrong clothes. My vision is to build a wardrobe with the clothes and accessories you already have and to improvise it according to your need.`,
    className: "text-[#14532d]",
    bg: "bg-[#6c935c] bg-opacity-40",
  },
  {
    text: `Our fashion choices should never affect our planets; let's be responsible and economical.`,
    className: "text-white",
    bg: "bg-[#14532d] bg-opacity-70",
  },
];

export default function HomePage() {
  const [aboutStep, setAboutStep] = useState(0);
  const [visionStep, setVisionStep] = useState(0);

  // Animate About section text per step
  const aboutTyped = aboutSections.map((section, i) =>
    useTypedText(section.text, aboutStep === i + 1)
  );
  // Animate Vision section text per step
  const visionTyped = visionSections.map((section, i) =>
    useTypedText(section.text, visionStep === i + 1)
  );

  // About animation controller
  useEffect(() => {
    if (aboutStep < aboutSections.length) {
      if (aboutStep === 0) {
        setTimeout(() => setAboutStep(1), 600);
      } else {
        const len = aboutSections[aboutStep - 1].text.length;
        setTimeout(() => setAboutStep(aboutStep + 1), len * 30 + 700);
      }
    }
  }, [aboutStep]);

  // Vision animation controller
  useEffect(() => {
    if (aboutStep === aboutSections.length && visionStep < visionSections.length) {
      if (visionStep === 0) {
        setTimeout(() => setVisionStep(1), 800);
      } else {
        const len = visionSections[visionStep - 1].text.length;
        setTimeout(() => setVisionStep(visionStep + 1), len * 30 + 700);
      }
    }
  }, [aboutStep, visionStep]);

  const showHighlight = aboutStep === aboutSections.length && visionStep > 2;
  const allTextDone = aboutStep === aboutSections.length && visionStep > visionSections.length;

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden w-full"
      style={{
        background: "linear-gradient(135deg, #14532d 0%, #6c935c 40%, #b7e5c2 80%, #d4f1d4 100%)",
      }}
    >
      <main className="w-full px-4 py-12 flex-1">
        <div className="w-full rounded-xl shadow-xl overflow-hidden border border-[#6c935c] bg-white/80 backdrop-blur-md">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start w-full">
            <div className="prose max-w-none flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-[#53885E] via-[#6c935c] to-[#a2d18f] bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                About Me
              </h1>
              <div className="md:float-left md:mr-10 mb-8 flex justify-center relative z-10">
                <img
                  src="/profile.png"
                  alt="Sriharshavardhini"
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#a2d18f] shadow-2xl"
                  style={{ shapeOutside: "circle()" }}
                />
              </div>
              <div className="relative z-0">
                {aboutSections.map((section, i) =>
                  aboutStep > i ? (
                    <div
                      key={i}
                      className={`${section.bg} ${section.className} rounded-xl px-4 py-3 mb-6 transition-all duration-700 shadow-sm`}
                      style={{ backdropFilter: "blur(2px)" }}
                    >
                      {aboutTyped[i]}
                    </div>
                  ) : null
                )}
              </div>

              <div className="my-12 border-t border-[#a2d18f]"></div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 mt-8 text-center bg-gradient-to-r from-[#14532d] via-[#6c935c] to-[#a2d18f] bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                Vision
              </h2>
              <div className="relative z-0">
                {visionSections.map((section, i) =>
                  visionStep > i ? (
                    <div
                      key={i}
                      className={`${section.bg} ${section.className} rounded-xl px-4 py-3 mb-6 transition-all duration-700 shadow-sm`}
                      style={{ backdropFilter: "blur(2px)" }}
                    >
                      {visionTyped[i]}
                    </div>
                  ) : null
                )}
              </div>

              {showHighlight && (
                <div className="bg-gradient-to-r from-[#d4f1d4] via-[#b7e5c2] to-[#6c935c] p-6 rounded-lg my-8 border border-[#6c935c] shadow-sm animate-fadein">
                  <p className="font-semibold text-[#14532d]">
                    Consumer expenditure on clothing and footwear stood at Rs 4.52 trillion in the financial year 2023-24.
                  </p>
                  <p className="font-semibold text-[#53885e] mt-3">
                    India's apparel market revenue stands at $165 billion. Indians spend an average of $2,500 per person annually on clothing, purchasing around 24.2 items each year.
                  </p>
                </div>
              )}

              {allTextDone && (
                <>
                  <div className="mb-6 bg-[#b7e5c2]/40 rounded-xl px-4 py-3 text-[#14532d]">
                    My vision is not to make you spend more money on clothes but it is to prevent you from spending your money on the wrong clothes. My vision is to build a wardrobe with the clothes and accessories you already have and to improvise it according to your need.
                  </div>
                  <div className="mb-6 bg-[#14532d]/70 rounded-xl px-4 py-3 text-white">
                    Our fashion choices should never affect our planets; let's be responsible and economical.
                  </div>
                  <p className="text-2xl font-semibold text-[#a2d18f] mt-10 text-center italic">
                    From Styling to Saving the planet! A Sustainable Styling approach!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .animate-fadein {
          animation: fadein 1s;
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
