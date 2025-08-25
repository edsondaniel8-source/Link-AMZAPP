import { useBookings } from "../hooks/useBookings";
import { useAuth } from "../hooks/useAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useState } from "react";

const TestBooking = () => {
  const { createBooking } = useBookings();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      // Check if auth is available
      if (!auth) {
        throw new Error("Firebase authentication not available");
      }

      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const testRideBooking = async () => {
    console.log("Testing booking system...");
    if (!user) {
      alert("Please log in to create bookings!");
      return;
    }

    try {
      const result = await createBooking("ride", {
        pickup: "Maputo City",
        destination: "Matola",
        date: new Date().toISOString(),
        passengers: 2,
      });

      console.log("Booking result:", result);

      if (result.success) {
        alert("✅ Booking test successful! Check Firebase console.");
      } else {
        alert("❌ Booking failed: " + result.error?.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Booking failed with unexpected error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Booking System</h2>
      <p>User status: {user ? "Logged in" : "Not logged in"}</p>

      {!user ? (
        <div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "8px",
                margin: "5px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "8px",
                margin: "5px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: "10px 15px",
              backgroundColor: loading ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </button>

          <p style={{ color: "red", marginTop: "10px" }}>
            ⚠️ Use the same credentials you created in Firebase Console
          </p>
        </div>
      ) : (
        <button
          onClick={testRideBooking}
          style={{
            padding: "10px 15px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Test Create Booking
        </button>
      )}
    </div>
  );
};

export default TestBooking;
