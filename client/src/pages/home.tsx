import { useState } from "react";
import Header from "@/components/Header";
import RideSearch from "@/components/RideSearch";
import StaySearch from "@/components/StaySearch";
import RideResults from "@/components/RideResults";
import StayResults from "@/components/StayResults";

export default function Home() {
  const [activeService, setActiveService] = useState<"rides" | "stays">("rides");
  const [searchParams, setSearchParams] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header activeService={activeService} onServiceChange={setActiveService} />
      
      {/* Search Section */}
      <section className="bg-gray-light py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeService === "rides" ? (
            <RideSearch onSearch={setSearchParams} />
          ) : (
            <StaySearch onSearch={setSearchParams} />
          )}
        </div>
      </section>

      {/* Results Section */}
      {searchParams && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeService === "rides" ? (
            <RideResults searchParams={searchParams} />
          ) : (
            <StayResults searchParams={searchParams} />
          )}
        </main>
      )}

      {/* Trip Planning Section */}
      <section className="bg-gray-light py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark">Plan Your Complete Trip</h2>
            <p className="text-gray-medium mt-2">Combine rides and stays for seamless travel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-route text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Smart Routing</h3>
              <p className="text-gray-medium">Book rides to and from your accommodation automatically</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-check text-secondary text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Sync Bookings</h3>
              <p className="text-gray-medium">Coordinate arrival times with your check-in schedule</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-piggy-bank text-success text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Bundle Savings</h3>
              <p className="text-gray-medium">Get discounts when booking rides and stays together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-2 h-16">
          <button
            data-testid="mobile-nav-rides"
            onClick={() => setActiveService("rides")}
            className={`flex flex-col items-center justify-center ${
              activeService === "rides" ? "text-primary" : "text-gray-medium"
            }`}
          >
            <i className="fas fa-car text-lg mb-1"></i>
            <span className="text-xs">Rides</span>
          </button>
          <button
            data-testid="mobile-nav-stays"
            onClick={() => setActiveService("stays")}
            className={`flex flex-col items-center justify-center ${
              activeService === "stays" ? "text-primary" : "text-gray-medium"
            }`}
          >
            <i className="fas fa-bed text-lg mb-1"></i>
            <span className="text-xs">Stays</span>
          </button>
        </div>
      </div>
    </div>
  );
}
