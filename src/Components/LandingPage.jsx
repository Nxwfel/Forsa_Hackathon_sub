// src/Components/LandingPage.jsx
import React, { useState } from "react";
import Logo from "../Assets/Algerie_Telecom.svg";
import { AnimatePresence, motion } from "framer-motion";
import useChatWebSocket from "../hooks/useChatWebSocket";

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || query.trim().length > 0;

  const username = "frontend-user";

  const { messages, sendMessage, connected } = useChatWebSocket(username, true);

  const handleSend = () => {
    if (!query.trim()) return;
    sendMessage(query.trim());
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggested = [
    { question: "Comment puis-je vérifier ma consommation de données ?" },
    { question: "Quels sont les forfaits Internet disponibles ?" },
    { question: "Comment puis-je activer un nouveau service ?" },
  ];

  const offers = [
    { title: "Offre De 100GB", partner: "DTP" },
    { title: "Offre Mobile 50GB", partner: "Entreprises" },
    { title: "Fibre Optique Premium", partner: "Résidentiel" },
    { title: "Pack Famille 200GB", partner: "Familles" },
  ];

  return (
      <AnimatePresence>
        <div className="w-full min-h-full bg-white">
          {/* Page container */}
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold text-[#1f235a] leading-tight">
                Assistant Intelligent
              </h1>

              <div className="flex items-center justify-center gap-3 -mt-1 sm:-mt-2">
              <span className="text-4xl sm:text-5xl lg:text-7xl font-semibold text-[#1f235a]">
                D&apos;
              </span>
                <img
                    src={Logo}
                    alt="logo"
                    className="h-16 sm:h-20 lg:h-28 w-auto object-contain"
                />
              </div>

              {/* status */}
              <div className="mt-3">
              <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium border ${
                      connected
                          ? "bg-[#E7F6EF] text-[#088141] border-[#0881414D]"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
              >
                <span
                    className={`h-2 w-2 rounded-full ${
                        connected ? "bg-[#088141] animate-pulse" : "bg-gray-400"
                    }`}
                />
                {connected ? "Connecté" : "Connexion…"}
              </span>
              </div>
            </div>

            {/* Chat input */}
            <div className="mt-10 flex justify-center">
              <div
                  className={`w-full max-w-3xl flex items-center rounded-3xl border bg-white/70 backdrop-blur px-3 sm:px-4 py-2 sm:py-3 transition-all ${
                      isActive
                          ? "border-[#1f235a] shadow-lg"
                          : "border-gray-300 shadow-sm"
                  }`}
              >
                <input
                    type="text"
                    placeholder="Posez votre question ici..."
                    className="poppins text-gray-700 w-full bg-transparent px-2 sm:px-3 text-sm sm:text-base outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    type="button"
                    onClick={handleSend}
                    className="shrink-0 ml-2 sm:ml-3 rounded-full p-2 sm:p-2.5 hover:bg-[#1f235a0f] transition"
                    aria-label="Envoyer"
                    title="Envoyer"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={isActive ? "#1f235a" : "gray"}
                      className="w-7 h-7 sm:w-8 sm:h-8 hover:-rotate-12 transition-transform"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggested.map((item, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12 }}
                        className="text-left rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm hover:shadow-xl hover:border-[#1f235a] hover:-translate-y-1 transition-all"
                        onClick={() => {
                          setQuery(item.question);
                          sendMessage(item.question);
                        }}
                    >
                  <span className="text-sm sm:text-base text-[#111]">
                    {item.question}
                  </span>
                    </motion.button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-3xl max-h-[40vh] overflow-y-auto rounded-2xl border border-gray-200/60 bg-gray-50/60 p-4 space-y-2">
                {messages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center">
                      Commencez la conversation en posant une question ci-dessus.
                    </p>
                )}

                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={
                          m.from === "user"
                              ? "text-right"
                              : m.from === "backend"
                                  ? "text-left"
                                  : "text-center text-xs text-gray-400"
                        }
                    >
                      {m.from === "system" ? (
                          <span>{m.text}</span>
                      ) : (
                          <span
                              className={
                                m.from === "user"
                                    ? "inline-block bg-[#1f235a] text-white px-3 py-2 rounded-2xl max-w-[85%] sm:max-w-[70%] text-sm"
                                    : "inline-block bg-white text-gray-800 px-3 py-2 rounded-2xl shadow-sm max-w-[85%] sm:max-w-[70%] text-sm"
                              }
                          >
                      {m.text}
                    </span>
                      )}
                    </div>
                ))}
              </div>
            </div>

            {/* Offers cards */}
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-5">
                {offers.map((o, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? 12 : -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35 }}
                        className="w-full rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] shadow-xl overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 p-5 sm:p-6">
                        <div className="flex items-center justify-center sm:justify-start sm:w-40">
                          <img
                              src={Logo}
                              alt=""
                              className="h-20 sm:h-24 w-auto object-contain"
                          />
                        </div>

                        <div className="flex-1 text-white text-center sm:text-left">
                          <h3 className="font-semibold text-2xl sm:text-3xl">
                            {o.title}
                          </h3>
                          <p className="font-light mt-1">
                            En convention avec : {o.partner}
                          </p>
                          <p className="font-light mt-1">
                            Offre promotionnelle dédiée à certains segments clients.
                          </p>

                          <div className="mt-3">
                        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs">
                          Offre
                        </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatePresence>
  );
};

export default LandingPage;
