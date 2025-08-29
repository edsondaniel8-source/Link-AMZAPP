import { useState, useEffect } from "react";
import { addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { getBookingsRef } from "../lib/firestore";
import { useAuth } from "./useAuth";
import { Booking } from "../types/booking";

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Create new booking
  const createBooking = async (
    type: "ride" | "hotel" | "event",
    details: any,
  ) => {
    if (!user) {
      return { success: false, error: new Error("User not authenticated") };
    }
    try {
      const bookingData: Omit<Booking, "id"> = {
        userId: user!.uid,
        type,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        details,
      };

      const bookingsCollection = await getBookingsRef();
      const docRef = await addDoc(bookingsCollection, bookingData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Booking error:", error);
      return { success: false, error };
    }
  };

  // Listen to user's bookings
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // ← ADD ASYNC FUNCTION INSIDE useEffect
    const fetchBookings = async () => {
      try {
        const bookingsRef = await getBookingsRef();
        const q = query(
          bookingsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const userBookings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];
          setBookings(userBookings);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return { bookings, loading, createBooking };
};
