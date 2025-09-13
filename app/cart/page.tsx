"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ArrowLeft, IndianRupee, Shield, Info, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type ServiceType = {
  name: string;
  description: string;
  duration: number;
  price: number;
};

type Booking = {
  id: string;
  bookingId: string;
  date: Date;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  service: ServiceType;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
};

export default function PaymentPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [singleBooking, setSingleBooking] = useState<Booking | null>(null);
  const [cartBookings, setCartBookings] = useState<Booking[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const storedCart = window.sessionStorage.getItem("pendingBookingList");
    const storedBooking = window.sessionStorage.getItem("pendingBooking");

    if (storedCart) {
      const cart = JSON.parse(storedCart).map((b: any) => ({
        ...b,
        date: new Date(b.date),
      }));
      setCartBookings(cart);
      setSingleBooking(null);
    } else if (storedBooking) {
      const booking = JSON.parse(storedBooking);
      booking.date = new Date(booking.date);
      setSingleBooking(booking);
      setCartBookings(null);
    } else {
      router.push("/");
    }

    const storedBankDetails = window.localStorage.getItem("adminBankDetails");
    if (storedBankDetails) {
      setBankDetails(JSON.parse(storedBankDetails));
    }
  }, [router]);

  const generateBookingId = () => Math.random().toString(36).slice(2).toUpperCase();

  const sendEmailNotifications = async (booking: Booking) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          clientName: booking.userName,
          clientEmail: booking.userEmail,
          clientPhone: booking.userPhone,
          serviceName: booking.service.name,
          duration: booking.service.duration,
          amount: booking.service.price,
          date: format(new Date(booking.date), "EEEE, MMMM d"),
          time: format(new Date(booking.date), "h:mm a"),
          consultantName: "Sriharshini",
          consultantPhone: "+91 7826071703",
          studioAddress: "55C Velachery Rd, Chennai",
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
        }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return true;
    } catch {
      return false;
    }
  };

  const currentBooking = cartBookings ? cartBookings[currentIndex] : singleBooking;

  const handlePayment = async () => {
    if (!currentBooking || !user || paymentCompleted) return;

    setIsProcessing(true);
    try {
      const options = {
        key: "rzp_test_4IuEnRO8WHIF", // Replace with your Razorpay key
        amount: currentBooking.service.price * 100, // in paise
        currency: "INR",
        name: "Sriharshini",
        description: "Image Consultancy Service",
        handler: async (response: any) => {
          toast({
            title: "Payment Successful",
            description: "Payment ID: " + response.razorpay_payment_id,
          });

          const booking: Booking = {
            ...currentBooking,
            id: Date.now().toString(),
            bookingId: generateBookingId(),
            paymentMethod: "Card",
            paymentStatus: "Completed",
            createdAt: new Date(),
            userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            userEmail: user.email,
            userPhone: user.phone,
          };

          const existingBookings = JSON.parse(window.localStorage.getItem("bookings") || "[]");
          existingBookings.push(booking);
          window.localStorage.setItem("bookings", JSON.stringify(existingBookings));

          const emailSent = await sendEmailNotifications(booking);

          if (emailSent) {
            setCompletedBooking(booking);
            setShowSuccessDialog(true);
            setPaymentCompleted(true);
          } else {
            toast({
              title: "Email Failed",
              description: "Could not send confirmation email. Please contact support.",
              variant: "destructive",
            });
          }

          if (cartBookings) {
            const nextIndex = currentIndex + 1;
            if (nextIndex < cartBookings.length) {
              setCurrentIndex(nextIndex);
              setPaymentCompleted(false);
            } else {
              setShowSuccessDialog(false);
              window.sessionStorage.removeItem("pendingBookingList");
              router.push("/");
            }
          } else {
            window.sessionStorage.removeItem("pendingBooking");
            router.push("/");
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "Payment cancelled by user.",
              variant: "destructive",
            });
          },
        },
        prefill: {
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#22c55e",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "SDK Not Loaded",
          description: "Razorpay SDK not loaded. Please refresh and try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Payment Failed",
        description: "Error processing payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to continue.</div>;

  if (!currentBooking) return <div className="min-h-screen flex items-center justify-center">No booking found.</div>;

  const { service, date } = currentBooking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="container max-w-xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-green-700">Complete Payment</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-lg">{service.name}</h2>
              <p>{service.description}</p>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{service.duration} mins</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{date ? format(date, "PPP") : ""}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{date ? format(date, "p") : ""}</span>
              </div>
              <div className="flex justify-between">
                <span>Consultant:</span>
                <span>Sriharshini</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total:</span>
                <span className="text-green-600">
                  <IndianRupee className="inline-block w-5 h-5 mr-1" />
                  {service.price}
                </span>
              </div>
            </div>
            {bankDetails && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
                <div className="flex items-center space-x-4 text-green-700">
                  <Info className="w-5 h-5" />
                  <div>
                    <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
                    <p><strong>Account Number:</strong> ****{bankDetails.accountNumber.slice(-4)}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Payments secured by industry standards</span>
            </div>
            {!paymentCompleted && (
              <Button onClick={handlePayment} disabled={isProcessing} className="mt-6 w-full">
                {isProcessing ? "Processing..." : `Pay ₹${service.price}`}
              </Button>
            )}
          </CardContent>
        </Card>
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center space-y-2 text-green-600">
                <Check className="w-10 h-10" />
                Payment Successful
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center">
              <p className="mb-2 font-semibold">Booking ID: {completedBooking?.bookingId}</p>
              <p>Your {completedBooking?.service.name} appointment is confirmed</p>
              <p className="mb-4">{completedBooking ? format(completedBooking?.date, "PPP p") : ""}</p>
              <p>Check your email for details</p>
            </DialogDescription>
            <div className="px-4 pb-4">
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push("/");
                }}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
