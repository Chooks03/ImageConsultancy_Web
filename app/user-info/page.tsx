"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

    const storedBookings = localStorage.getItem("bookings");
    if (!storedBookings) {
      setPreviousAppointments([]);
      setUpcomingAppointments([]);
      return;
    }

    const allBookingsRaw = JSON.parse(storedBookings);

    const allBookings: Booking[] = allBookingsRaw.map((b: any) => ({
      bookingId: b.bookingId,
      date: new Date(b.date),
      service: b.service,
      paymentStatus: b.paymentStatus,
      userEmail: b.userEmail,
      userName: b.userName,
      userPhone: b.userPhone,
    }));

    const now = new Date();

    setPreviousAppointments(allBookings.filter((b) => b.date < now && b.paymentStatus === "Completed"));
    setUpcomingAppointments(allBookings.filter((b) => b.date >= now && b.paymentStatus === "Completed"));
  }, [user]);

  async function sendCancellationEmails(booking: Booking) {
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
          adminEmail: "admin@example.com", // replace accordingly
        }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return true;
    } catch (err) {
      console.error("Failed to send cancellation emails:", err);
      return false;
    }
  }

  async function handleCancelAppointment(bookingId: string) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    const storedBookings = localStorage.getItem("bookings");
    if (!storedBookings) return;

    let bookings = JSON.parse(storedBookings);

    const toCancel = bookings.find((b: any) => b.bookingId === bookingId);
    if (!toCancel) return;

    const emailSent = await sendCancellationEmails(toCancel);
    if (!emailSent) {
      alert("Failed to send cancellation emails. Try again later.");
      return;
    }

    bookings = bookings.filter((b: any) => b.bookingId !== bookingId);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    setUpcomingAppointments((prev) => prev.filter((b) => b.bookingId !== bookingId));
    alert("Appointment cancelled successfully and emails sent.");
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-green-900 bg-green-50">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-green-900 bg-green-50">
        Please log in to view your profile.
      </div>
    );

  const displayName =
    user.username ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Unknown User";

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6 bg-green-50 text-green-900 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 tracking-wide drop-shadow-md">Your Profile</h1>

      <Card className="mb-10 shadow-lg border border-green-200 rounded-lg bg-white backdrop-blur-sm bg-opacity-40">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            <span className="font-semibold">Username:</span> {displayName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email ?? "Not Provided"}
          </p>
          <p>
            <span className="font-semibold">Contact Number:</span> {user.phone ?? "Not Provided"}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-10 shadow-lg border border-green-200 rounded-lg bg-white backdrop-blur-sm bg-opacity-40">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-green-700 italic">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-green-200">
              {upcomingAppointments.map((appt) => (
                <li key={appt.bookingId} className="py-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                  <div>
                    <p className="text-lg font-semibold">{appt.service.name}</p>
                    <p className="text-sm text-green-600">{format(appt.date, "PPP")} at {format(appt.date, "p")}</p>
                  </div>
                  <div className="flex items-center mt-3 sm:mt-0 space-x-4">
                    <div className="flex items-center text-green-800 font-semibold">
                      <IndianRupee className="mr-1 w-5 h-5" />
                      {appt.service.price.toLocaleString("en-IN")}
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(appt.bookingId)}>
                      Cancel
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-green-200 rounded-lg bg-white backdrop-blur-sm bg-opacity-40">
        <CardHeader>
          <CardTitle>Previous Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {previousAppointments.length === 0 ? (
            <p className="text-green-700 italic">No previous appointments.</p>
          ) : (
            <ul className="divide-y divide-green-200">
              {previousAppointments.map((appt) => (
                <li key={appt.bookingId} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{appt.service.name}</p>
                    <p className="text-sm text-green-600">{format(appt.date, "PPP")} at {format(appt.date, "p")}</p>
                  </div>
                  <div className="flex items-center text-green-800 font-semibold">
                    <IndianRupee className="mr-1 w-5 h-5" />
                    {appt.service.price.toLocaleString("en-IN")}
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
