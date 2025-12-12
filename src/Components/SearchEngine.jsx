// src/Components/Search.jsx (or SearchEngine.jsx depending on file name)
import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchOffres } from "../api/offresApi";


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

  // 🔹 Load offers once, only from backend
  useEffect(() => {
    const loadOffers = async () => {
      console.log("[Search] Loading offers from backend…");
      try {
        setLoading(true);
        setError("");

        const data = await fetchOffres({});
        console.log("[Search] Raw backend data:", data);

        const normalized = (data || []).map((o, idx) => ({
          id: o.id ?? idx,
          name: o.name,
          partner: o.customer_segment || "N/A",
          sector: o.geography || "Non spécifié",
          type:
            (o.keywords && o.keywords[0]) ||
            "Offre", // fake a 'type' from first keyword
          validFrom: o.start_date,
          validTo: o.end_date,
          description: o.summary || "",
          pdfUrl: o.source_path || undefined,
        }));

        console.log("[Search] Normalized offers:", normalized);
        setOffers(normalized);
      } catch (err) {
        console.error("[Search] Failed to load offers:", err);
        setError("Impossible de récupérer les offres depuis l'API.");
        showToast("Erreur API – aucune donnée locale utilisée", "error");
        setOffers([]); // 🚫 no local fallback
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

  const activeFilterCount = useMemo(() => {
    const { query, sector, partner, offerType, validFrom, validTo } = filters;
    return [query, sector, partner, offerType, validFrom, validTo].filter(
      (v) => v && v.toString().trim() !== ""
    ).length;
  }, [filters]);

  return (
    <section
      id="search"
      className="relative min-h-screen w-full text-[#1F235A] bg-gradient-to-br from-[#F3F5FC] via-white to-[#E7F3F0] py-6 px-4 md:px-8"
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

      {/* ... everything below (header, filters, results) stays exactly as you had it ... */}
      {/* I’ll leave your JSX unchanged from here down, since only the data source had to move */}
      {/* (You can paste the rest of your original Search component JSX after this comment) */}
      {/* ------------- REST OF YOUR COMPONENT UNCHANGED ------------- */}
      {/* Header */}
      {/* Search bar, filters, results, cards... */}
      {/* (Use the same code you already posted, no change needed below) */}
      {/* ------------------------------------------------------------ */}
    </section>
  );
};

export default Search;
