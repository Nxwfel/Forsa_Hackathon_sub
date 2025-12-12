
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from '../Assets/Algerie_Telecom.svg'
const Offers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["Tous", "Particuliers", "Résidentiels", "Gamers", "Fibre"];
  const API_BASE = "https://forsahackathonbackendek.onrender.com/";


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch(`${API_BASE}offres/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des offres");
        }

        const data = await response.json();
        
        const transformedOffers = data.map((offer) => ({
            id: offer.id,
            title: offer.name || "Offre sans nom",
            partner: offer.linked_conventions?.length
              ? offer.linked_conventions.map(c => c.document_name).join(", ")
              : "Algérie Télécom",
            description: offer.summary || "Aucune description disponible",
            category: offer.customer_segment || "général",
            geography: offer.geography || "",
            price: offer.price_info || "",
            conditions: offer.conditions || "",
            startDate: offer.start_date || "",
            endDate: offer.end_date || "",
            keywords: offer.keywords || [],
            }));


        setOffers(transformedOffers);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

const getCategoryMatch = (offer) => {
  const segment = (offer.category || "").toLowerCase();
  const keywords = (offer.keywords || []).map(k => k.toLowerCase());

  // --- Particuliers ---
  if (segment.includes("particulier")) return "Particuliers";

  // --- Résidentiels (includes locataire variations) ---
  if (
    segment.includes("résidentiel") ||
    segment.includes("residentiel") ||
    segment.includes("locataire")
  ) {
    return "Résidentiels";
  }

  // --- Gamers ---
  if (
    segment.includes("gamer") ||
    keywords.some(k => k.includes("gamer"))
  ) {
    return "Gamers";
  }

  // --- Fibre ---
  if (
    segment.includes("fibre") ||
    keywords.some(
      k =>
        k.includes("fibre") ||
        k.includes("ftth") ||
        k.includes("optique")
    )
  ) {
    return "Fibre";
  }

  // Default
  return "Tous";
};


const filteredOffers =
  selectedCategory === "Tous"
    ? offers
    : offers.filter((offer) => getCategoryMatch(offer) === selectedCategory);


  return (
    <div className="bg-white min-h-screen py-10">
      <div className=" w-[50vw] ml-[20vw] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-[#1f235a] mb-4">Nos Offres</h1>
          <p className="text-xl text-gray-600">
            Découvrez toutes nos offres et promotions
          </p>
        </motion.div>

        {error && (
          <div className="text-center text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 mb-4 py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f235a]"></div>
            <p className="mt-4">Chargement des offres...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center gap-4 mb-12 flex-wrap"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Offers Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-6"
              >
                {filteredOffers.slice(0, 6).map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{
                      opacity: 0,
                      x: index % 2 === 0 ? -20 : 20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                    className="w-full min-h- flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] shadow-xl cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center justify-center p-8 min-w-[160px]">
                      <img
                        src={Logo}
                        alt={offer.title}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    <div className="flex flex-col py-6 text-white justify-center flex-1 pr-6">
                      <h1 className="font-semibold text-4xl mb-2">
                        {offer.title}
                      </h1>
                      <p className="font-light text-sm mb-1 opacity-90">
                        En convention avec : {offer.partner}
                      </p>
                      <p className="font-light text-base mb-3 leading-relaxed">
                        {offer.description}
                      </p>
                      
                      {/* Price Information */}
                      {offer.price && (
                        <div className="mb-2">
                          <p className="font-medium text-sm flex items-start gap-2">
                            <span className="text-lg">💰</span>
                            <span className="flex-1">{offer.price}</span>
                          </p>
                        </div>
                      )}
                      
                      {/* Geography */}
                      {offer.geography && (
                        <p className="font-light text-sm mb-2 flex items-center gap-2">
                          <span>📍</span>
                          <span className="capitalize">{offer.geography}</span>
                        </p>
                      )}
                      
                      {/* Conditions */}
                      {offer.conditions && (
                        <div className="mb-3">
                          <p className="font-light text-xs opacity-80 line-clamp-2">
                            ℹ️ {offer.conditions.split('\n')[0]}
                          </p>
                        </div>
                      )}
                      
                      {/* Tags */}
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                          {offer.category}
                        </span>
                        {offer.keywords && offer.keywords.slice(0, 3).map((keyword, idx) => (
                          <span 
                            key={idx}
                            className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                        {offer.endDate && (
                          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                            Jusqu'au {new Date(offer.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {!loading && filteredOffers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Aucune offre disponible
                </h3>
                <p className="text-gray-500">
                  Aucune offre ne correspond à cette catégorie pour le moment.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Offers;
