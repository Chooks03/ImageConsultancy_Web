"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IndianRupee, Trash2, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type ServiceType = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

type BookingType = {
  id: string;
  bookingId: string;
  date: Date;
  userId: string;
  service: ServiceType;
  amount?: number;
  status?: "pending" | "booked" | "cancelled";
  paymentStatus?: string;
  cancelledAt?: Date;
  createdAt?: Date;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<BookingType[]>([]);

  useEffect(() => {
    const cartStr = sessionStorage.getItem("cartItems");
    if (cartStr) {
      try {
        const parsed: BookingType[] = JSON.parse(cartStr).map((item: any) => ({
          ...item,
          date: new Date(item.date),
          cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : undefined,
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        }));
        setCartItems(parsed);
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    sessionStorage.setItem("cartItems", JSON.stringify(updated));
    toast({ title: "Removed", description: "Booking removed from cart." });
  };

  const proceedToPayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add bookings to cart first.",
        variant: "destructive",
      });
      return;
    }
    // Use 'pendingList' key to match payment page expectation
    sessionStorage.setItem("pendingList", JSON.stringify(cartItems));
    router.push("/payment");
  };

  const totalPrice = cartItems.reduce((sum, b) => sum + (b.amount ?? 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-10 font-serif text-green-900">
      <main className="max-w-4xl mx-auto flex flex-col space-y-12">
        <h1 className="text-6xl font-extrabold mb-6 text-center tracking-wide text-green-800 drop-shadow-lg">
          Your Booking Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-green-900 italic text-xl font-semibold tracking-wide mt-20">
            Your cart is empty. Add some style today!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8">
              {cartItems.map(item => (
                <Card
                  key={item.id}
                  className="rounded-2xl shadow-2xl border border-green-800 bg-gradient-to-tr from-green-50 to-green-100 p-6 flex flex-col hover:scale-[1.02] transition-transform duration-300"
                >
                  <CardContent>
                    <p className="text-4xl font-bold text-green-900">{item.service.name}</p>
                    <p className="text-green-900 mt-1 tracking-wide">{format(item.date, "PPP")}</p>
                    <p className="text-green-900 mb-3 tracking-wide">{format(item.date, "p")}</p>
                    <p className="flex items-center text-green-900 font-extrabold text-2xl mt-4">
                      <IndianRupee className="w-7 h-7 mr-3 text-green-700" />
                      {item.amount?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-green-800 text-base mt-3 italic font-medium tracking-wide">
                      Booking ID: <span className="font-semibold">{item.bookingId}</span>
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      color="red"
                      className="flex items-center space-x-2 border-red-700 text-red-700 hover:bg-red-800 hover:text-white"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Remove</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center border-t-4 border-green-800 pt-6">
              <span className="text-3xl font-bold tracking-wide uppercase text-green-900">
                Total
              </span>
              <span className="flex items-center gap-3 text-4xl font-extrabold text-green-900 drop-shadow-md">
                <IndianRupee className="w-8 h-8 text-green-700" />
                {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mx-auto max-w-2xl text-center text-green-900 text-xl font-semibold italic tracking-wider mt-10 mb-4">
              Secure your style now — don’t miss the chance to shine!
            </p>

            <Button
              className="w-full bg-gradient-to-r from-green-800 to-green-900 text-white py-6 rounded-xl font-extrabold shadow-2xl hover:brightness-105 transition-transform active:scale-95"
              onClick={proceedToPayment}
            >
              Proceed to Payment
            </Button>

            {/* Back to Appointments Button */}
            <section className="flex justify-center mt-10">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-green-700 text-green-700 hover:bg-green-100"
                onClick={() => router.push("/appointments")}
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Appointments
              </Button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
