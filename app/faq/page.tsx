"use client";

import { useState, ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: string | ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "What is image consulting?",
    answer:
      "Image consulting is a professional service that helps you present your best self through personal style, wardrobe, grooming, and body language. At Sriharshavardhini Image Consultancy, we focus on enhancing your natural strengths and creating a style that feels authentic, confident, and effortless.",
  },
  {
    question: "How is a virtual consultation conducted?",
    answer:
      "All our consultations are conducted online via video call. You’ll receive a pre-session questionnaire, and during the session, we’ll analyze your colours, wardrobe, or style needs. This makes our services accessible no matter where you are located.",
  },
  {
    question: "Do I need to prepare anything for a consultation?",
    answer: (
      <div>
        <div><b>Colour Analysis:</b> Natural lighting photos or video call with minimal makeup.</div>
        <div><b>Wardrobe Edit:</b> Access to your closet during the call.</div>
        <div><b>Personal Shopping:</b> A list of your requirements, preferences, and budget.</div>
        <div>We’ll guide you through everything in advance.</div>
      </div>
    ),
  },
  {
    question: "How long does each service take?",
    answer: (
      <ul className="list-disc ml-6 space-y-1">
        <li><b>Colour Analysis:</b> 45–60 minutes</li>
        <li><b>Wardrobe Edit:</b> 2–3 hours (can be split across sessions)</li>
        <li><b>Body Shape Consultation:</b> 45 minutes</li>
        <li><b>Personal Shopping:</b> Time varies based on the package</li>
        <li><b>Style Makeover Packages:</b> Customized timeline based on your goals</li>
      </ul>
    ),
  },
  {
    question: "What if I don’t know which service I need?",
    answer:
      "Don’t worry! You can book a free discovery call where we’ll understand your lifestyle, preferences, and goals, and recommend the right package for you.",
  },
  {
    question: "Can you help with special occasions like weddings or events?",
    answer:
      "Absolutely. We offer custom styling for bridal, pre-wedding, red carpet, corporate, and other special events. These are tailored packages designed specifically for your needs.",
  },
  {
    question: "Do you work with men as well?",
    answer:
      "Yes, we caters to both men and women. Our styling principles adapt to your personality, profession, and lifestyle.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Our services start at ₹3,500. Package pricing varies depending on the type and duration of consultation. Please see our Services & Pricing page for details.",
  },
  {
    question: "Is this the same as a personal shopper or stylist?",
    answer:
      "Not exactly. While we do offer personal shopping and styling, image consulting goes deeper. It’s about creating a cohesive personal brand that aligns with your career, lifestyle, and aspirations—not just picking outfits.",
  },
  {
    question: "Will my style change completely?",
    answer:
      "Our goal is not to change you, but to refine and elevate your natural style. We’ll build on what already works for you, while introducing new ideas to expand your wardrobe and confidence.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Many clients choose our monthly coaching packages for continuous guidance with seasonal updates, wardrobe refreshes, and style confidence building.",
  },
  {
    question: "How do I book a session?",
    answer:
      "Simply visit our Book Now page, select your service, and choose a time slot that suits you. You’ll receive an email confirmation with next steps.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-800 flex flex-col">
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg p-12 border border-green-500">
          <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-emerald-300 via-lime-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-md">
            Frequently Asked Questions
          </h1>
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-green-500 last:border-b-0">
              <button
                className="w-full flex justify-between items-center text-lg py-6 font-semibold text-emerald-300 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 rounded-lg transition"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
                aria-controls={`faq-content-${idx}`}
              >
                <span>{faq.question}</span>
                <span className="text-2xl select-none">{openIdx === idx ? "−" : "+"}</span>
              </button>
              {openIdx === idx && (
                <div
                  id={`faq-content-${idx}`}
                  className="py-4 text-green-300 text-base leading-relaxed"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
