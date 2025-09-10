"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // <-- CORRECT IMPORT
import { format } from "date-fns";
import { IndianRupee } from "lucide-react";

type Booking = {
  bookingId: string;
  date: Date;
  service: {
    name: string;
    price: number;
  };
  paymentStatus: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
};

export default function UserInfoPage() {
  const { user, isLoading } = useAuth();
  const [previousAppointments, setPreviousAppointments] = useState<Booking[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;

    const allBookingsRaw = localStorage.getItem("bookings");
    if (!allBookingsRaw) {
      setPreviousAppointments([]);
      setUpcomingAppointments([]);
      return;
    }

    const allBookings: Booking[] = JSON.parse(allBookingsRaw).map((b: any) => ({
      bookingId: b.bookingId,
      date: new Date(b.date),
      service: b.service,
      paymentStatus: b.paymentStatus,
      userEmail: b.userEmail,
      userName: b.userName,
      userPhone: b.userPhone,
    }));

    const now = new Date();

    setPreviousAppointments(
      allBookings.filter((b) => b.date < now && b.paymentStatus === "Completed")
    );

    setUpcomingAppointments(
      allBookings.filter((b) => b.date >= now && b.paymentStatus === "Completed")
    );
  }, [user]);

  // Function to send cancellation emails to client and admin
  const sendCancellationEmails = async (booking: Booking) => {
    try {
      const response = await fetch("/api/send-cancellation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          clientName: booking.userName,
          clientEmail: booking.userEmail,
          clientPhone: booking.userPhone,
          serviceName: booking.service.name,
          date: format(booking.date, "PPP"),
          time: format(booking.date, "p"),
          adminEmail: "admin@example.com", // Replace with your admin email
        }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return true;
    } catch (error) {
      console.error("Error sending cancellation emails:", error);
      return false;
    }
  };

  // Handle cancellation: remove booking and notify
  const handleCancelAppointment = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    const allBookingsRaw = localStorage.getItem("bookings");
    if (!allBookingsRaw) return;

    const allBookings: Booking[] = JSON.parse(allBookingsRaw);

    const bookingToCancel = allBookings.find((b) => b.bookingId === bookingId);
    if (!bookingToCancel) return;

    // Send cancellation emails
    const emailSent = await sendCancellationEmails(bookingToCancel);
    if (!emailSent) {
      alert("Failed to send cancellation emails. Please try again.");
      return;
    }

    // Remove booking from storage
    const updatedBookings = allBookings.filter((b) => b.bookingId !== bookingId);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    // Update state
    setUpcomingAppointments((prev) =>
      prev.filter((b) => b.bookingId !== bookingId)
    );

    alert("Appointment cancelled successfully and emails sent.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in to see your info.
      </div>
    );
  }

  const displayName =
    user.username ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Unknown User";

  return (
    <div className="min-h-screen bg-green-50 p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Your Profile</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-green-900">
          <p>
            <strong>Username:</strong> {displayName}
          </p>
          <p>
            <strong>Email:</strong> {user.email ?? "Not Provided"}
          </p>
          <p>
            <strong>Contact Number:</strong> {user.phone ?? "Not Provided"}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-green-700">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-green-200">
              {upcomingAppointments.map((a) => (
                <li
                  key={a.bookingId}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{a.service.name}</p>
                    <p className="text-sm text-green-700">
                      {format(a.date, "PPP p")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-green-900 font-semibold">
                      <IndianRupee className="w-5 h-5" />
                      <span>{a.service.price.toLocaleString("en-IN")}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(a.bookingId)}
                    >
                      Cancel
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {previousAppointments.length === 0 ? (
            <p className="text-green-700">No previous appointments.</p>
          ) : (
            <ul className="divide-y divide-green-200">
              {previousAppointments.map((a) => (
                <li
                  key={a.bookingId}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{a.service.name}</p>
                    <p className="text-sm text-green-700">
                      {format(a.date, "PPP p")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-900 font-semibold">
                    <IndianRupee className="w-5 h-5" />
                    <span>{a.service.price.toLocaleString("en-IN")}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
