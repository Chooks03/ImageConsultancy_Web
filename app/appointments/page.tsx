"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isAfter,
  addMinutes,
} from "date-fns";
import { IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ColourPackage {
  id: string;
  name: string;
  price: number;
  details: string[];
  duration: number;
}

interface StylePackage {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

type BlockedSlot = { date: string; time: string };

const colourPackages: ColourPackage[] = [
  {
    id: "classic",
    name: "Classic",
    price: 3500,
    details: [
      "Undertone & season analysis",
      "Colours to avoid",
      "Best shades for you",
      "Top colour combinations",
      "Digital swatch card",
    ],
    duration: 60,
  },
  {
    id: "signature",
    name: "Signature",
    price: 6500,
    details: [
      "Undertone & season analysis",
      "Colours to avoid",
      "Best shades for you",
      "Top colour combinations",
      "Makeup shades (lip, blush, eye)",
      "Jewellery & accessory finishes",
      "Suggested hair colour options",
      "Outfit examples",
      "Digital swatch card",
    ],
    duration: 90,
  },
  {
    id: "elite",
    name: "Elite",
    price: 12000,
    details: [
      "Undertone & season analysis",
      "Colours to avoid",
      "Best shades for you",
      "Top colour combinations",
      "Makeup shades (lip, blush, eye)",
      "Jewellery & accessory finishes",
      "Suggested hair colour options",
      "Outfit examples",
      "Capsule wardrobe guide",
      "Digital swatch card",
    ],
    duration: 120,
  },
];

const stylePackages: StylePackage[] = [
  {
    id: "shape-style",
    name: "Shape & Style",
    duration: 60,
    price: 4500,
    description: "Figure analysis, individual advice. Add-ons available",
  },
  {
    id: "wardrobe-edit-refresh",
    name: "Wardrobe Edit & Refresh",
    duration: 90,
    price: 8500,
    description: "Full wardrobe audit, 5-7 styled looks, essentials",
  },
  {
    id: "personal-shopping",
    name: "Personal Shopping",
    duration: 120,
    price: 10000,
    description: "Curated online shopping, styling advice",
  },
  {
    id: "style-makeover",
    name: "Style Makeover",
    duration: 150,
    price: 15000,
    description: "Colour + Body + Wardrobe, moodboard, 10 styled looks",
  },
  {
    id: "monthly-coaching",
    name: "Monthly Coaching",
    duration: 60,
    price: 7000,
    description: "2 calls, unlimited WhatsApp support",
  },
  {
    id: "bridal-styling",
    name: "Bridal Styling",
    duration: 180,
    price: 20000,
    description: "Bespoke event styling",
  },
  {
    id: "executive-styling",
    name: "Executive Styling",
    duration: 180,
    price: 25000,
    description: "Custom styling for professionals",
  },
  {
    id: "travel-planning",
    name: "Travel Planning",
    duration: 60,
    price: 4000,
    description: "Personalized travel wardrobe planning",
  },
];

export default function Appointments() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Select first package by default if available
  const defaultPackageId =
    colourPackages.length > 0
      ? colourPackages[0].id
      : stylePackages.length > 0
      ? stylePackages[0].id
      : "";

  const [selectedServiceId, setSelectedServiceId] = useState<string>(defaultPackageId);
  const [date, setDate] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

  const allServices: (ColourPackage | StylePackage)[] = [
    ...colourPackages,
    ...stylePackages,
  ];

  useEffect(() => {
    const bks = localStorage.getItem("bookings");
    if (bks) {
      const parsed = JSON.parse(bks)
        .filter((b: any) => b.service && b.date)
        .map((b: any) => ({
          ...b,
          date: new Date(b.date),
          cancelledAt: b.cancelled ? new Date(b.cancelledAt) : undefined,
          createdAt: b.createdAt ? new Date(b.createdAt) : undefined,
        }));
      setBookings(parsed);
    }

    const blockedRaw = localStorage.getItem("adminBlockedSlots");
    setBlockedSlots(blockedRaw ? JSON.parse(blockedRaw) : []);
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedServiceId) {
      setAvailableSlots([]);
      return;
    }
    const svc = allServices.find((s) => s.id === selectedServiceId);
    if (!svc) {
      setAvailableSlots([]);
      return;
    }

    const slots: Date[] = [];
    const start = 11;
    const end = 19;

    for (let hour = start; hour < end; hour++) {
      for (let min = 0; min < 60; min += svc.duration) {
        const slot = setMinutes(setHours(new Date(selectedDate), hour), min);
        if (!isAfter(slot, new Date())) continue;

        const slotDateStr = format(slot, "yyyy-MM-dd");
        const slotTimeStr = format(slot, "HH:mm");

        // Filter admin blocked slots
        if (blockedSlots.some(b => b.date === slotDateStr && b.time === slotTimeStr)) continue;

        slots.push(slot);
      }
    }

    const filtered = slots.filter(
      (slot) =>
        !bookings.some((booked) => {
          if (booked.cancelled) return false;
          if (!booked.service) return false;
          const bookedStart = booked.date;
          const bookedEnd = addMinutes(bookedStart, booked.service.duration);
          const slotEnd = addMinutes(slot, svc.duration);
          return slot < bookedEnd && slotEnd > bookedStart;
        })
    );

    setAvailableSlots(filtered);
    setSelectedSlot(null);
  }, [selectedDate, selectedServiceId, bookings, blockedSlots]);

  const onDateChange = (date?: Date) => {
    setDate(date);
    setSelectedDate(date ?? null);
  };

  const handleProceed = () => {
    if (!selectedSlot || !selectedServiceId || !user) return;
    const svc = allServices.find((s) => s.id === selectedServiceId);
    if (!svc) return;

    const pendingBooking = {
      id: String(Date.now()),
      bookingId: Math.random().toString(36).slice(2, 11).toUpperCase(),
      date: selectedSlot,
      userId: user.id,
      service: svc,
      amount: svc.price,
      paymentStatus: "pending",
      status: "pending",
      createdAt: new Date(),
    };

    sessionStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));
    setSelectedSlot(null);
    router.push("/payment"); // Redirects to payment page on Book Now
  };

  const handleAddToCart = () => {
    if (!selectedSlot || !selectedServiceId || !user) {
      toast({
        title: "Selection Required",
        description: "Please select service and time slot.",
        variant: "destructive",
      });
      return;
    }
    const svc = allServices.find((s) => s.id === selectedServiceId);
    if (!svc) return;

    const booking = {
      id: String(Date.now()),
      bookingId: Math.random().toString(36).slice(2, 11).toUpperCase(),
      date: selectedSlot,
      userId: user.id,
      service: svc,
      amount: svc.price,
      paymentStatus: "pending",
      status: "pending",
      createdAt: new Date(),
    };

    const existingCart = sessionStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    cart.push(booking);
    sessionStorage.setItem("cart", JSON.stringify(cart));

    toast({
      title: "Added to Cart",
      description: `${svc.name} at ${format(selectedSlot, "PPP p")} added to cart.`,
    });

    router.push("/cart"); // Redirects to cart page on Add to Cart
  };

  if (isLoading) return <div>Loading...</div>;

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#d7f4cc] font-serif">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white flex flex-col items-center space-y-7 border-2 border-green-700">
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 drop-shadow text-center">
            Please log in to book appointments
          </h2>
          <p className="text-green-700 text-md md:text-lg text-center">
            Unlock personalized style and colour consultations.
            <br />
            Sign in or create your account to continue.
          </p>
          <div className="flex w-full justify-center gap-5 mt-4">
            <button
              className="bg-gradient-to-r from-green-700 to-green-900 text-white font-semibold rounded-lg px-6 py-3 shadow transition hover:scale-105 hover:from-green-800 hover:to-green-900"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-green-900 font-semibold rounded-lg px-6 py-3 shadow transition hover:scale-105 hover:from-yellow-500 hover:to-yellow-700"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
          <span className="text-sm text-green-700 opacity-80 mt-2">
            Secure & fast booking for all style services
          </span>
        </div>
      </div>
    );

  const selectedSvc = allServices.find((s) => s.id === selectedServiceId);

  return (
    <div className="min-h-screen w-full bg-[#d7f4cc] p-4 md:p-10 font-serif text-black">
      <main className="max-w-6xl mx-auto flex flex-col space-y-14">
        <h1 className="text-4xl font-extrabold text-center text-green-900 drop-shadow-md">
          Book Your Appointment
        </h1>
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center text-green-800">
            Colour Comparison Packages
          </h2>
          <RadioGroup
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
          >
            {colourPackages.map((pkg) => (
              <label
                key={pkg.id}
                htmlFor={pkg.id}
                className="border border-green-700 rounded-xl p-6 cursor-pointer hover:bg-green-100 transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id={pkg.id}
                      value={pkg.id}
                      className="border-green-700 text-green-700"
                    />
                    <span className="text-xl font-semibold text-green-900">
                      {pkg.name}
                    </span>
                  </div>
                  <div className="flex items-center text-xl font-extrabold text-green-900">
                    <IndianRupee className="w-6 h-6" />
                    {pkg.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                  {pkg.details.map((det) => (
                    <li key={det}>{det}</li>
                  ))}
                </ul>
              </label>
            ))}
          </RadioGroup>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center text-green-800">
            Style Service Packages
          </h2>
          <RadioGroup
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4"
          >
            {stylePackages.map((pkg) => (
              <label
                key={pkg.id}
                htmlFor={pkg.id}
                className="border border-green-700 rounded-xl p-6 cursor-pointer hover:bg-green-100 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id={pkg.id}
                      value={pkg.id}
                      className="border-green-700 text-green-700"
                    />
                    <span className="text-xl font-semibold text-green-900">
                      {pkg.name}
                    </span>
                  </div>
                  <div className="flex items-center text-xl font-extrabold text-green-900">
                    <IndianRupee className="w-6 h-6" />
                    {pkg.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <p className="text-green-700 text-base">{pkg.description}</p>
              </label>
            ))}
          </RadioGroup>
        </section>
        <section className="flex flex-col lg:flex-row gap-10 px-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date ?? undefined}
                onSelect={onDateChange}
                disabled={(day) =>
                  day < addDays(new Date(), 2) || day > addDays(new Date(), 30)
                }
                className="rounded-md custom-calendar"
              />
            </CardContent>
          </Card>
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Select Time</CardTitle>
              <CardDescription>
                {selectedSvc && date
                  ? `Available ${selectedSvc.duration} min slots on ${format(
                      date,
                      "PPP"
                    )}`
                  : "Select service and date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSvc && date ? (
                availableSlots.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 rounded-md">
                    {availableSlots.map((slot) => (
                      <Button
                        size="lg"
                        key={slot.toISOString()}
                        onClick={() => setSelectedSlot(slot)}
                        variant={
                          slot.getTime() === selectedSlot?.getTime()
                            ? "default"
                            : "outline"
                        }
                        className={
                          slot.getTime() === selectedSlot?.getTime()
                            ? "bg-green-700 text-white"
                            : ""
                        }
                      >
                        {format(slot, "p")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-700 italic mt-4">
                    No available slots on this date.
                  </p>
                )
              ) : (
                <p className="text-green-700 italic mt-4">
                  Please select service and date first.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4">
              <Button
                onClick={handleProceed}
                disabled={!selectedSlot}
                className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg py-3 flex-grow mr-4"
              >
                Book Now
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSlot}
                className="bg-yellow-500 text-white rounded-lg py-3 flex-grow"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f0fdf4;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #166d00;
          border-radius: 3px;
        }
        .custom-calendar .rdp-day_selected,
        .custom-calendar .rdp-day:focus-visible {
          background: #166d00 !important;
          color: #fff !important;
          border-radius: 50% !important;
          font-weight: 700 !important;
          box-shadow: 0 0 2px #3332 !important;
        }
        .custom-calendar .rdp-day:hover {
          background: #fff !important;
          color: #166d00 !important;
          border-radius: 50% !important;
          font-weight: 700 !important;
          box-shadow: 0 0 2px #3332 !important;
        }
      `}</style>
    </div>
  );
}
