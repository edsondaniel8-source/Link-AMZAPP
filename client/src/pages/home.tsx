import { useState } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import RideOfferModal from "@/components/RideOfferModal";
import RideResults from "@/components/RideResults";
import StayResults from "@/components/StayResults";
import DealsOfTheDay from "@/components/DealsOfTheDay";
import FeaturedEvents from "@/components/FeaturedEvents";

export default function Home() {
  const [activeService, setActiveService] = useState<"rides" | "stays">("rides");
  const [searchParams, setSearchParams] = useState<any>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleSubmitOffer = (offerData: any) => {
    console.log('Ride offer submitted:', offerData);
    // TODO: Implement API call to submit ride offer
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeService={activeService} 
        onServiceChange={setActiveService} 
        onOfferRide={() => setShowOfferModal(true)}
      />
      
      {/* Hero Banner with Search */}
      {!searchParams && (
        <HeroBanner 
          activeService={activeService}
          onServiceChange={setActiveService}
          onSearch={setSearchParams}
        />
      )}

      {/* Promotional Banner */}
      {!searchParams && (
        <section className="bg-green-50 py-8 mx-4 md:mx-8 my-8 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Promoção
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  Encontre as melhores ofertas de {activeService === "rides" ? "viagens" : "hospedagem"}!
                </h3>
                <p className="text-gray-600 mt-1">
                  Viaje de forma inteligente e económica.
                </p>
              </div>
              <div className="hidden md:flex items-center">
                <div className="flex space-x-2">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {activeService === "rides" ? "🚗" : "🏨"} %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Deals of the Day Section */}
      {!searchParams && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DealsOfTheDay />
        </section>
      )}

      {/* Restaurant functionality removed from platform */}


      {/* Featured Events Section */}
      {!searchParams && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FeaturedEvents />
        </section>
      )}

      {/* Results Section */}
      {searchParams && (
        <>
          {/* Back to Search Button */}
          <div className="bg-gray-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => setSearchParams(null)}
                className="flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Voltar à pesquisa
              </button>
            </div>
          </div>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeService === "rides" ? (
              <RideResults searchParams={searchParams} />
            ) : (
              <StayResults searchParams={searchParams} />
            )}
          </main>
        </>
      )}

      {/* Features Section */}
      {!searchParams && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Viagens com preços baixos para você
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Procure, clique e viaje!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-money-bill-wave text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Viagens com preços baixos para você
                </h3>
                <p className="text-gray-600">
                  Não importa para onde você vá, com ônibus ou carpool: encontre a viagem perfeita entre os milhares de destinos e rotas a preços baixos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-friends text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Confie em quem viaja com você
                </h3>
                <p className="text-gray-600">
                  Sabemos a importância de se sentir à vontade para viajar. Por isso, analisamos avaliações, perfis e IDs antes de você viajar e estamos sempre lá quando você precisar.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Procure, clique e viaje!
                </h3>
                <p className="text-gray-600">
                  Reservar uma viagem nunca foi tão fácil! Nossa tecnologia nos permite oferecer facilidade de uso e simplicidade em toda a plataforma ou app.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => window.location.href = "/"}
            className="flex flex-col items-center justify-center text-primary"
          >
            <i className="fas fa-home text-lg mb-1"></i>
            <span className="text-xs">Início</span>
          </button>
          <button
            onClick={() => window.location.href = "/events"}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
          >
            <i className="fas fa-calendar text-lg mb-1"></i>
            <span className="text-xs">Eventos</span>
          </button>
          <button
            onClick={() => setShowOfferModal(true)}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
          >
            <i className="fas fa-plus-circle text-lg mb-1"></i>
            <span className="text-xs">Oferecer</span>
          </button>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
          >
            <i className="fas fa-user text-lg mb-1"></i>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>

      {/* Ride Offer Modal */}
      <RideOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleSubmitOffer}
      />
    </div>
  );
}
