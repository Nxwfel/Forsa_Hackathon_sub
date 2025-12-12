import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

        {/* MAIN CONTENT WRAPPER */}
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col gap-6">
          {/* Header */}
          <motion.header
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
            <div>
              <div className="inline-flex items-center rounded-full border border-[#1F235A1A] bg-[#1F235A0A] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#1F235A] mb-3">
                Moteur de recherche · Offres & Conventions
              </div>
              <h2 className="text-4xl md:text-5xl poppins font-bold mb-2 leading-tight">
                Recherche d&apos;offres & conventions
              </h2>
              <p className="text-sm text-[#666] max-w-xl">
                Filtrez les offres par mots-clés, partenaires, secteurs ou dates pour
                retrouver rapidement la bonne convention.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 text-xs text-[#666]">
            <span className="uppercase tracking-[0.18em] text-[#999]">
              Forsa · Assistant
            </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0881414D] bg-[#E7F6EF] px-3 py-1 text-[11px] font-medium text-[#088141]">
              <span className="h-2 w-2 rounded-full bg-[#088141] animate-pulse" />
              Base de connaissances en temps réel
            </span>
            </div>
          </motion.header>

          {/* Search Bar + quick tags */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/90 border border-[#1F235A1A] rounded-2xl p-4 md:p-5 shadow-sm w-full backdrop-blur-sm space-y-3"
          >
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
                🔍
              </span>
                <input
                    type="text"
                    placeholder="Nom d'offre, partenaire, secteur…"
                    value={filters.query}
                    onChange={handleInputChange("query")}
                    className="w-full bg-[#f9fafc] border border-[#1F235A33] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33] focus:border-[#1F235A] transition-all"
                />
              </div>

              <motion.button
                  onClick={handleSearchClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#1F235A] hover:bg-[#088141] transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm"
              >
                Rechercher
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 text-xs">
                {["fibre", "éducation", "administration", "cloud"].map(
                    (k, index) => (
                        <motion.button
                            key={k}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            whileHover={{ scale: 1.1, backgroundColor: "#F0F3FA" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickKeyword(k)}
                            className="px-3 py-1 rounded-full border border-[#1F235A26] bg-white hover:bg-[#F0F3FA] text-[#1F235A] transition-colors"
                        >
                          #{k}
                        </motion.button>
                    )
                )}
              </div>

              {/* Small info pill */}
              <div className="flex items-center gap-2 text-[11px] text-[#666]">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1F235A0D] text-[#1F235A] text-[10px] font-semibold">
                i
              </span>
                <span>
                {activeFilterCount > 0
                    ? `${activeFilterCount} filtre(s) actif(s)`
                    : "Aucun filtre avancé appliqué"}
              </span>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4 w-full">
            {/* Secteur */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">
                Secteur
              </p>
              <select
                  value={filters.sector}
                  onChange={handleInputChange("sector")}
                  className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              >
                <option value="">Tous</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Éducation">Éducation</option>
                <option value="Administration">Administration</option>
              </select>
            </motion.div>

            {/* Partenaire */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">
                Partenaire
              </p>
              <input
                  type="text"
                  value={filters.partner}
                  onChange={handleInputChange("partner")}
                  className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
                  placeholder="Nom…"
              />
            </motion.div>

            {/* Type d'offre */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">
                Type d&apos;offre
              </p>
              <select
                  value={filters.offerType}
                  onChange={handleInputChange("offerType")}
                  className="w-full bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1F235A33]"
              >
                <option value="">Tous</option>
                <option value="Internet">Internet</option>
                <option value="Cloud">Cloud</option>
                <option value="Réseau privé">Réseau privé</option>
              </select>
            </motion.div>

            {/* Validité */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-4 border border-[#1F235A14] shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[#088141] mb-2">
                Validité
              </p>
              <div className="flex gap-2 flex-nowrap">
                <input
                    type="date"
                    value={filters.validFrom}
                    onChange={handleInputChange("validFrom")}
                    className="basis-1/2 min-w-0 bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1F235A33]"
                />
                <input
                    type="date"
                    value={filters.validTo}
                    onChange={handleInputChange("validTo")}
                    className="basis-1/2 min-w-0 bg-[#f9fafc] border border-[#1F235A1F] rounded-xl px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-[#1F235A33]"
                />
              </div>
            </motion.div>
          </div>

          {/* Results */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/90 rounded-2xl border border-[#1F235A1A] p-4 md:p-5 shadow-sm w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Résultats</h3>
                {error && (
                    <p className="text-xs text-red-600 mt-1">
                      {error}
                    </p>
                )}
              </div>
              <motion.span
                  key={filteredOffers.length}
                  initial={{ scale: 1.2, color: "#088141" }}
                  animate={{ scale: 1, color: "#666" }}
                  className="inline-flex items-center gap-2 text-sm text-[#666]"
              >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1F235A0D] text-[#1F235A] text-xs font-semibold">
                {filteredOffers.length}
              </span>
                offre(s) correspondante(s)
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
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
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
                    Aucune offre trouvée. Essayez d&apos;élargir votre recherche ou de
                    réinitialiser certains filtres.
                  </p>
                </motion.div>
            )}

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {!loading &&
                    filteredOffers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.05,
                            }}
                            whileHover={{
                              scale: 1.02,
                              boxShadow:
                                  "0 10px 30px rgba(31, 35, 90, 0.15)",
                              borderColor: "#1F235A66",
                            }}
                            className="rounded-2xl border border-[#1F235A14] bg-[#f9fafc] p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-sm md:text-base">
                                  {offer.name}
                                </h4>
                                <p className="text-xs text-[#666]">
                                  {offer.partner} · {offer.sector}
                                </p>
                              </div>
                              <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 + 0.1 }}
                                  className="text-[11px] px-3 py-1 rounded-full bg-[#08814112] border border-[#08814166] text-[#088141] whitespace-nowrap"
                              >
                                {offer.type}
                              </motion.span>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[11px] text-[#555] my-3">
                              {[
                                `Secteur : ${offer.sector}`,
                                `Partenaire : ${offer.partner}`,
                                `${offer.validFrom} → ${offer.validTo}`,
                              ].map((tag, i) => (
                                  <motion.span
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        delay:
                                            index * 0.05 + 0.15 + i * 0.05,
                                      }}
                                      className="px-2 py-1 bg-white border border-[#E0E3EE] rounded-full"
                                  >
                                    {tag}
                                  </motion.span>
                              ))}
                            </div>

                            <p className="text-sm text-[#444]">
                              {offer.description}
                            </p>
                          </div>

                          <div className="flex gap-3 text-xs mt-4">
                            <motion.button
                                onClick={() => handleViewOffer(offer)}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#088141",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 rounded-xl bg-[#1F235A] text-white transition-colors"
                            >
                              Voir
                            </motion.button>

                            <motion.button
                                onClick={() => handleDownloadPdf(offer)}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#f4f4f4",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 rounded-xl border border-[#1F235A26] bg-white transition-colors"
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
  );
};

export default Search;
