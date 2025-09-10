"use client";
import React, { useEffect, useRef } from "react";

const tickIcon = (
  <span
    className="inline-block"
    style={{
      fontSize: "1.5em",
      lineHeight: "1",
      fontWeight: "bold",
      verticalAlign: "middle",
      color: "#14532d", // dark green tick for visibility
      filter: "drop-shadow(0 1px 0 #8fbc8f)",
    }}
    aria-label="Included"
    title="Included"
  >
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#14532d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  </span>
);
const addOn = (
  <span className="italic text-[#6c935c] font-semibold">Add-on</span>
);

const comparisonData = [
  { feature: "Undertone & season analysis", classic: tickIcon, signature: tickIcon, elite: tickIcon },
  { feature: "Colours to avoid", classic: tickIcon, signature: tickIcon, elite: tickIcon },
  { feature: "Best shades for you", classic: tickIcon, signature: tickIcon, elite: tickIcon },
  { feature: "Top colour combinations", classic: tickIcon, signature: tickIcon, elite: tickIcon },
  { feature: "Makeup shades (lip, blush, eye)", classic: null, signature: tickIcon, elite: tickIcon },
  { feature: "Jewellery & accessory finishes", classic: null, signature: tickIcon, elite: tickIcon },
  { feature: "Suggested hair colour options", classic: addOn, signature: tickIcon, elite: tickIcon },
  { feature: "Outfit styling examples", classic: null, signature: tickIcon, elite: tickIcon },
  { feature: "Capsule wardrobe guide", classic: null, signature: null, elite: tickIcon },
  { feature: "Digital swatch card", classic: tickIcon, signature: tickIcon, elite: tickIcon },
];

const servicePackages = [
  { name: "Shape & Style", price: "₹4,500", details: "Figure analysis, individual style advice. Add-ons available" },
  { name: "Wardrobe Edit & Refresh", price: "₹8,500", details: "Full wardrobe audit, 5–7 styled looks, shopping list essentials" },
  { name: "Personal Shopping", price: "₹10,000", details: "Curated online shopping, styling advice with purchase" },
  { name: "The Style Makeover", price: "₹15,000", details: "Colour + Body + Wardrobe, moodboard, 10 styled looks, lookbook" },
  { name: "Monthly Style Coaching", price: "₹7,000/month", details: "2 styling calls, unlimited WhatsApp, seasonal updates, event styling priority" },
  { name: "Bridal & Trousseau Styling", price: "From ₹20,000", details: "Bespoke occasion styling for weddings & trousseau" },
  { name: "Executive/Public Figure Styling", price: "From ₹25,000", details: "Custom styling for professionals & high-profile clients" },
  { name: "Travel Wardrobe & Capsule Planning", price: "From ₹4,000", details: "Personalized travel wardrobe/capsule planning" },
];

const Services: React.FC = () => {
  const comparisonTableRef = useRef<HTMLTableElement>(null);
  const serviceTableRef = useRef<HTMLTableElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const tables = [comparisonTableRef.current, serviceTableRef.current];
    tables.forEach((table, tIdx) => {
      if (!table) return;
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      rows.forEach((row, i) => {
        (row as HTMLElement).style.opacity = "0";
        (row as HTMLElement).style.transform = "translateY(30px)";
        setTimeout(() => {
          (row as HTMLElement).style.transition =
            "opacity 1.2s cubic-bezier(.4,0,.2,1), transform 1.2s cubic-bezier(.4,0,.2,1)";
          (row as HTMLElement).style.opacity = "1";
          (row as HTMLElement).style.transform = "translateY(0)";
        }, 400 + i * 300 + tIdx * 600);
      });
    });
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#d4f1d4] px-2 sm:px-6 md:px-10 py-10"
    >
      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto rounded-xl shadow-2xl p-6 sm:p-10 bg-white/90 border border-[#6c935c] backdrop-blur-md">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 text-center break-words"
            style={{ color: "#14532d" }}
          >
            Services
          </h1>
          <section className="mb-10">
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-6 text-center break-words"
              style={{ color: "#14532d" }}
            >
              Colour Analysis <span style={{ color: "#6c935c" }}>Comparison Packages</span>
            </h2>
            <div className="overflow-auto rounded-lg border border-[#6c935c]">
              <table
                ref={comparisonTableRef}
                className="min-w-full border-collapse"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr className="bg-[#6c935c] text-white">
                    <th className="py-3 px-3 font-medium text-left">You Get</th>
                    <th className="py-3 px-4 font-bold text-center">
                      Classic
                      <br />
                      <span className="text-[#a2d18f]">₹3,500</span>
                    </th>
                    <th className="py-3 px-4 font-bold text-center">
                      Signature
                      <br />
                      <span className="text-[#a2d18f]">₹6,500</span>
                    </th>
                    <th className="py-3 px-4 font-bold text-center">
                      Elite
                      <br />
                      <span className="text-[#a2d18f]">₹12,000</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr
                      key={row.feature}
                      className={`${
                        idx % 2 === 1 ? "bg-[#a2d18f]/30" : "bg-[#d4f1d4]/30"
                      } text-[#14532d] font-medium`}
                    >
                      <td className="py-2 px-3 align-top break-words">{row.feature}</td>
                      <td className="py-2 px-4 text-center align-middle">{row.classic ?? ""}</td>
                      <td className="py-2 px-4 text-center align-middle">{row.signature ?? ""}</td>
                      <td className="py-2 px-4 text-center align-middle">{row.elite ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-6 text-center break-words"
              style={{ color: "#14532d" }}
            >
              <span style={{ color: "#6c935c" }}>Style Service Packages</span>
            </h2>
            <div className="overflow-auto rounded-lg border border-[#6c935c]">
              <table
                ref={serviceTableRef}
                className="min-w-full border-collapse"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr className="bg-[#6c935c] text-white">
                    <th className="py-3 px-3 font-medium text-left">Package</th>
                    <th className="py-3 px-4 font-bold text-center">Price</th>
                    <th className="py-3 px-4 font-bold text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {servicePackages.map((pkg, idx) => (
                    <tr
                      key={pkg.name}
                      className={`${
                        idx % 2 === 1 ? "bg-[#a2d18f]/40" : "bg-[#d4f1d4]/40"
                      } text-[#14532d] font-medium`}
                    >
                      <td className="py-2 px-3 align-top break-words">{pkg.name}</td>
                      <td className="py-2 px-4 text-center align-top break-words">{pkg.price}</td>
                      <td className="py-2 px-4 align-top break-words">{pkg.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <style jsx>{`
        tr {
          will-change: opacity, transform;
        }
        @media (max-width: 640px) {
          th, td {
            white-space: normal !important;
            font-size: 0.875rem;
            padding: 0.5rem;
          }
          /* Make table horizontally scrollable */
          div.overflow-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
