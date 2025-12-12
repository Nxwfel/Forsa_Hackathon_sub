// src/Components/Offers.jsx
import React, { useState, useEffect } from "react";
import logo from "../Assets/Algerie_Telecom.svg";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOffres } from "../api/offresApi";

// 🔹 Helper: map raw backend offer → "Internet" | "Mobile" | "Fibre" | "Autre"
function inferCategory(o) {
  const text = (
      (o.name || "") +
      " " +
      (o.summary || "") +
      " " +
      (o.customer_segment || "") +
      " " +
      (Array.isArray(o.keywords) ? o.keywords.join(" ") : "")
  ).toLowerCase();

  if (text.includes("fibre")) return "Fibre";
  if (text.includes("mobile") || text.includes("gsm") || text.includes("4g"))
    return "Mobile";
  if (text.includes("internet") || text.includes("adsl") || text.includes("data"))
    return "Internet";

  return "Autre";
}

const Offers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["Tous", "Internet", "Mobile", "Fibre"];

  useEffect(() => {
    const load = async () => {
      console.log("[Offers] Loading offers from backend…");
      try {
        setLoading(true);
        setError("");

        const data = await fetchOffres({});
        console.log("[Offers] Raw backend data:", data);

        const normalized = (data || []).map((o, idx) => {
          const cat = inferCategory(o);
          return {
            id: o.id ?? idx,
            title: o.name || "Offre sans titre",
            partner: o.customer_segment || "N/A",
            description: o.summary || "",
            category: cat,
          };
        });

        setOffers(normalized);
      } catch (err) {
        console.error("[Offers] Failed to load offers:", err);
        setError("Impossible de récupérer les offres depuis l'API.");
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredOffers =
      selectedCategory === "Tous"
          ? offers
          : offers.filter((offer) => offer.category === selectedCategory);

  return (
      <div className="bg-white min-h-full py-10">
        {/* Responsive container */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1f235a] mb-3">
              Nos Offres
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Découvrez toutes nos offres et promotions
            </p>
          </motion.div>

          {error && (
              <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
          )}

          {loading && (
              <p className="text-center text-gray-500 mb-6">
                Chargement des offres...
              </p>
          )}

          {!loading && (
              <>
                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center gap-3 mb-10 flex-wrap"
                >
                  {categories.map((category, index) => (
                      <motion.button
                          key={category}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.08 }}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                              selectedCategory === category
                                  ? "bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg scale-[1.03]"
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

                {/* Offers list */}
                <AnimatePresence mode="wait">
                  <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 gap-6"
                  >
                    {filteredOffers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ delay: Math.min(index * 0.05, 0.35) }}
                            whileHover={{
                              scale: 1.01,
                              boxShadow: "0 20px 40px rgba(0,0,0,0.10)",
                            }}
                            className="w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] shadow-xl"
                        >
                          {/* responsive card layout */}
                          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-5 sm:p-6">
                            {/* image */}
                            <div className="flex items-center justify-center sm:justify-start sm:w-40">
                              <img
                                  src={logo}
                                  alt={offer.title}
                                  className="h-20 sm:h-24 w-auto object-contain"
                              />
                            </div>

                            {/* content */}
                            <div className="flex-1 text-white text-center sm:text-left">
                              <h2 className="font-semibold text-2xl sm:text-3xl">
                                {offer.title}
                              </h2>
                              <p className="font-light mt-1 text-sm sm:text-base">
                                En convention avec : {offer.partner}
                              </p>
                              <p className="font-light mt-2 text-sm sm:text-base opacity-95">
                                {offer.description}
                              </p>

                              <div className="mt-3">
                          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm">
                            {offer.category}
                          </span>
                              </div>
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
                        className="text-center py-16"
                    >
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
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
