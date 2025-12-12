import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
// 👉 Change to your real backend URL
const API_URL = "http://localhost:8000/api/offers";

// 🔹 Filtering logic
function filterOffers(offers, filters) {
  const { query, sector, partner, offerType, validFrom, validTo } = filters;
  const q = query.trim().toLowerCase();

  return offers.filter((o) => {
    const matchesQuery =
      !q ||
      o.name?.toLowerCase().includes(q) ||
      o.partner?.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q);

    const matchesSector = !sector || o.sector === sector;
    const matchesPartner =
      !partner ||
      o.partner?.toLowerCase().includes(partner.trim().toLowerCase());
    const matchesType = !offerType || o.type === offerType;

    const fromOK = !validFrom || (o.validFrom && o.validFrom >= validFrom);
    const toOK = !validTo || (o.validTo && o.validTo <= validTo);

    return (
      matchesQuery &&
      matchesSector &&
      matchesPartner &&
      matchesType &&
      fromOK &&
      toOK
    );
  });
}

// Local fallback data
const FALLBACK_OFFERS = [
  {
    id: 1,
    name: "Pack Fibre Entreprise",
    partner: "Algérie Télécom",
    sector: "Entreprise",
    type: "Internet",
    validFrom: "2024-01-01",
    validTo: "2025-12-31",
    description:
      "Connexion fibre dédiée pour entreprises avec support 24/7 et SLA garanti.",
  },
  {
    id: 2,
    name: "Solution Cloud Éducation",
    partner: "Ministère de l'Éducation",
    sector: "Éducation",
    type: "Cloud",
    validFrom: "2023-06-01",
    validTo: "2026-06-01",
    description:
      "Plateforme cloud pour établissements scolaires avec stockage sécurisé.",
  },
  {
    id: 3,
    name: "Offre Administration Connectée",
    partner: "Ministère de l'Intérieur",
    sector: "Administration",
    type: "Réseau privé",
    validFrom: "2024-03-01",
    validTo: "2027-03-01",
    description:
      "Réseau privé sécurisé pour la mise en réseau des administrations.",
  },
];

const Search = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  const [filters, setFilters] = useState({
    query: "",
    sector: "",
    partner: "",
    offerType: "",
    validFrom: "",
    validTo: "",
  });

  const showToast = (message, type = "info") => {
    setToast({ visible: true, type, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Load offers once
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de récupérer les offres depuis l'API. Données locales utilisées."
        );
        showToast("Erreur API – utilisation des données locales", "error");
        setOffers(FALLBACK_OFFERS);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const filteredOffers = useMemo(
    () => filterOffers(offers, filters),
    [offers, filters]
  );

  const handleInputChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleQuickKeyword = (keyword) => {
    setFilters((prev) => ({ ...prev, query: keyword }));
  };

  const handleSearchClick = () => {
    showToast("Filtrage mis à jour", "info");
  };

  const handleViewOffer = (offer) => {
    showToast(`Fiche non disponible pour "${offer.name}"`, "info");
  };

  const handleDownloadPdf = (offer) => {
    if (!offer.pdfUrl) {
      showToast("Aucun PDF disponible pour cette offre.", "error");
      return;
    }

    window.open(offer.pdfUrl, "_blank");
    showToast("Téléchargement lancé.", "success");
  };

  const toastColors = {
    info: "bg-[#1F235A] text-white",
    success: "bg-[#088141] text-white",
    error: "bg-red-600 text-white",
  };

  return (
    <AnimatePresence>
    <section
      id="search"
      className="relative h-full w-full text-[#1F235A] py-6 px-6 md:px-10 overflow-y-auto overflow-x-hidden"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={`min-w-[260px] max-w-xs px-4 py-3 rounded-xl shadow-lg flex items-start gap-3 ${toastColors[toast.type]}`}
            >
              <span className="mt-0.5">
                {toast.type === "success" && "✅"}
                {toast.type === "error" && "⚠️"}
                {toast.type === "info" && "ℹ️"}
              </span>
              <p className="text-sm">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER → FIXES HORIZONTAL SCROLL */}
      <div className="w-full h-full flex flex-col gap-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl poppins font-bold mb-2">
            Recherche d'offres & conventions
          </h2>
          <p className="text-sm text-[#666] max-w-xl">
            Filtrez les offres par mots-clés, partenaires, secteurs ou dates.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-[#1F235A1A] rounded-2xl p-4 shadow-sm w-full"
        >
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
              <input
                type="text"
                placeholder="Nom d'offre, partenaire, secteur…"
                value={filters.query}
                onChange={handleInputChange("query")}
                className="w-full bg-[#f9fafc] border border-[#1F235A33] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33] transition-all"
              />
            </div>

            <motion.button
              onClick={handleSearchClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F235A] hover:bg-[#088141] text-white px-5 py-2.5 rounded-xl transition-colors"
            >
              Rechercher
            </motion.button>
          </div>

          {/* Quick tags */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["fibre", "éducation", "administration", "cloud"].map((k, index) => (
              <motion.button
                key={k}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.1, backgroundColor: '#F0F3FA' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickKeyword(k)}
                className="px-3 py-1 rounded-full border border-[#1F235A33] bg-white"
              >
                {k}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 w-full">
          {[
            { 
              label: "Secteur", 
              field: "sector", 
              type: "select",
              options: ["Tous", "Entreprise", "Éducation", "Administration"]
            },
            { 
              label: "Partenaire", 
              field: "partner", 
              type: "input"
            },
            { 
              label: "Type d'offre", 
              field: "offerType", 
              type: "select",
              options: ["Tous", "Internet", "Cloud", "Réseau privé"]
            },
            { 
              label: "Validité", 
              field: "validity", 
              type: "date"
            }
          ].map((filter, index) => (
            <motion.div 
              key={filter.field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-4 border"
            >
              <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">
                {filter.label}
              </p>
              {filter.type === "select" && filter.field === "sector" && (
                <select
                  value={filters.sector}
                  onChange={handleInputChange("sector")}
                  className="w-full bg-[#f9fafc] border rounded-xl px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[#1F235A33]"
                >
                  {filter.options.map(opt => (
                    <option key={opt} value={opt === "Tous" ? "" : opt}>{opt}</option>
                  ))}
                </select>
              )}
              {filter.type === "input" && (
                <input
                  type="text"
                  value={filters.partner}
                  onChange={handleInputChange("partner")}
                  className="w-full bg-[#f9fafc] border rounded-xl px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[#1F235A33]"
                  placeholder="Nom…"
                />
              )}
              {filter.type === "select" && filter.field === "offerType" && (
                <select
                  value={filters.offerType}
                  onChange={handleInputChange("offerType")}
                  className="w-full bg-[#f9fafc] border rounded-xl px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-[#1F235A33]"
                >
                  {filter.options.map(opt => (
                    <option key={opt} value={opt === "Tous" ? "" : opt}>{opt}</option>
                  ))}
                </select>
              )}
              {filter.type === "date" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.validFrom}
                    onChange={handleInputChange("validFrom")}
                    className="flex-1 bg-[#f9fafc] border rounded-xl px-2 py-2 text-xs transition-all focus:ring-2 focus:ring-[#1F235A33]"
                  />
                  <input
                    type="date"
                    value={filters.validTo}
                    onChange={handleInputChange("validTo")}
                    className="flex-1 bg-[#f9fafc] border rounded-xl px-2 py-2 text-xs transition-all focus:ring-2 focus:ring-[#1F235A33]"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Results */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl border p-4 shadow-sm w-full"
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Résultats</h3>
            <motion.span 
              key={filteredOffers.length}
              initial={{ scale: 1.2, color: '#088141' }}
              animate={{ scale: 1, color: '#666' }}
              className="text-sm"
            >
              {filteredOffers.length} offre(s)
            </motion.span>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-[#1F235A] border-t-transparent rounded-full"
              />
            </motion.div>
          )}

          {!loading && filteredOffers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-[#666]">
                Aucune offre trouvée. Essayez d'élargir votre recherche.
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 10px 30px rgba(31, 35, 90, 0.15)',
                    borderColor: '#1F235A66'
                  }}
                  className="rounded-2xl border bg-[#f9fafc] p-4"
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{offer.name}</h4>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className="text-xs px-3 py-1 rounded-full bg-[#08814112] border border-[#08814166] text-[#088141]"
                    >
                      {offer.type}
                    </motion.span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-[#555] my-2">
                    {[
                      `Secteur : ${offer.sector}`,
                      `Partenaire : ${offer.partner}`,
                      `${offer.validFrom} → ${offer.validTo}`
                    ].map((tag, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.15 + i * 0.05 }}
                        className="px-2 py-1 bg-white border rounded-full"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <p className="text-sm mb-3">{offer.description}</p>

                  <div className="flex gap-3 text-xs">
                    <motion.button
                      onClick={() => handleViewOffer(offer)}
                      whileHover={{ scale: 1.05, backgroundColor: '#088141' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-xl bg-[#1F235A] text-white transition-colors"
                    >
                      Voir
                    </motion.button>

                    <motion.button
                      onClick={() => handleDownloadPdf(offer)}
                      whileHover={{ scale: 1.05, backgroundColor: '#f4f4f4' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-xl border bg-white"
                    >
                      PDF
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
    </AnimatePresence>
  );
};

export default Search;