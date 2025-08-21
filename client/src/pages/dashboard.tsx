import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import logoPath from "@assets/link-a-logo.png";
import type { Booking } from "@shared/schema";

export default function Dashboard() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/user/mock-user-id"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentBookings = bookings.filter(
    booking => booking.status === "confirmed" || booking.status === "pending"
  );
  const pastBookings = bookings.filter(booking => booking.status === "completed");

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <img 
                    src={logoPath} 
                    alt="Link-A" 
                    className="h-10 w-10 mr-3"
                  />
                  <h1 className="text-2xl font-bold text-primary">Link-A Mz</h1>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="text-gray-medium hover:text-dark font-medium">
                  Back to Search
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark">My Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">No bookings yet</h3>
              <p className="text-gray-medium mb-4">
                Start planning your trip by searching for rides or accommodations
              </p>
              <Link href="/">
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                  Start Booking
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Current Bookings */}
            {currentBookings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-dark mb-4">Current & Upcoming</h3>
                <div className="space-y-4">
                  {currentBookings.map((booking) => (
                    <Card key={booking.id} data-testid={`booking-card-${booking.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              booking.type === "ride" ? "bg-primary bg-opacity-10" : "bg-secondary bg-opacity-10"
                            }`}>
                              <i className={`fas ${
                                booking.type === "ride" ? "fa-car text-primary" : "fa-bed text-secondary"
                              } text-xl`}></i>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium px-2 py-1 rounded ${
                                  booking.type === "ride" ? "bg-primary text-white" : "bg-secondary text-white"
                                }`}>
                                  {booking.type === "ride" ? "Ride" : "Stay"}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  booking.status === "confirmed" 
                                    ? "bg-success bg-opacity-10 text-success" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <p className="text-dark font-medium mt-1">
                                {booking.type === "ride" ? "Ride Booking" : "Accommodation Booking"}
                              </p>
                              <p className="text-sm text-gray-medium">
                                ${booking.totalPrice}
                                {booking.checkInDate && booking.checkOutDate && (
                                  <> • {booking.nights} nights</>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              data-testid={`modify-booking-${booking.id}`}
                              className="text-primary text-sm font-medium hover:underline"
                            >
                              Modify
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-dark mb-4">Trip History</h3>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} data-testid={`past-booking-card-${booking.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              booking.type === "ride" ? "bg-gray-100" : "bg-gray-100"
                            }`}>
                              <i className={`fas ${
                                booking.type === "ride" ? "fa-car" : "fa-bed"
                              } text-gray-400 text-xl`}></i>
                            </div>
                            <div>
                              <p className="text-dark font-medium">
                                {booking.type === "ride" ? "Ride" : "Stay"} • Completed
                              </p>
                              <p className="text-sm text-gray-medium">
                                ${booking.totalPrice}
                                {booking.createdAt && (
                                  <> • {new Date(booking.createdAt).toLocaleDateString()}</>
                                )}
                              </p>
                              <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400 text-xs">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i key={star} className="fas fa-star"></i>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-medium ml-1">Rated</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              data-testid={`rebook-${booking.id}`}
                              className="text-primary text-sm font-medium hover:underline"
                            >
                              Book Again
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}