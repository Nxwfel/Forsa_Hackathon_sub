// src/Components/LandingPage.jsx
import React, { useState } from "react";
import Logo from "../Assets/Algerie_Telecom.svg";
import { AnimatePresence, motion } from "framer-motion";
import useChatWebSocket from "../hooks/useChatWebSocket";

const LandingPage = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || query.trim().length > 0;

  // temp username – later you can use real user info
  const username = "frontend-user";

  // enable WS as soon as LandingPage is mounted
  const { messages, sendMessage, connected } = useChatWebSocket(
    username,
    true
  );

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

  return (
    <AnimatePresence>
      <div className="bg-white flex flex-col justify-center items-center">
        <div className="ml-[20vw] w-[60vw] flex flex-col justify-center items-center">
          {/* Header */}
          <div className="flex">
            <span className="text-7xl mt-[5vh] font-semibold text-[#1f235a] flex justify-center items-center">
              Assistant Intelligent{" "}
              <span
                className={`ml-3 text-2xl ${
                  connected ? "text-green-500" : "text-red-500"
                }`}
              >
                ●
              </span>
            </span>
          </div>
          <span className="text-7xl -mt-10 font-semibold text-[#1f235a] flex justify-center items-center">
            D&apos;<img src={Logo} alt="" className="size-[30vh]" />{" "}
          </span>

          {/* Chat input */}
          <div className="h-[9vh] w-[50vw] flex justify-between items-center mt-[7vh] rounded-3xl border border-gray-300 bg-white/70 backdrop-blur">
            <input
              type="text"
              placeholder="Posez votre question ici..."
              className="poppins text-gray-700 h-full w-full bg-transparent px-5 text-md outline-none rounded-3xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="gray"
              className="size-[2.5vw] hover:stroke-[#1f235a] mr-4 cursor-pointer hover:-rotate-30 transition-all"
              onClick={handleSend}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          {/* Messages area */}
          <div className="w-[50vw] max-h-[40vh] mt-4 mb-6 overflow-y-auto rounded-2xl border border-gray-200/60 bg-gray-50/60 p-4 space-y-2">
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
                        ? "inline-block bg-[#1f235a] text-white px-3 py-2 rounded-2xl max-w-[70%] text-sm"
                        : "inline-block bg-white text-gray-800 px-3 py-2 rounded-2xl shadow-sm max-w-[70%] text-sm"
                    }
                  >
                    {m.text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Suggested questions */}
          <div className="flex justify-center items-center">
            {[
              {
                question: "Comment puis-je vérifier ma consommation de données ?",
              },
              {
                question: "Quels sont les forfaits Internet disponibles ?",
              },
              {
                question: "Comment puis-je activer un nouveau service ?",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="w-full flex flex-col p-3 shadow-lg rounded-xl border border-gray-300/50 justify-center items-center m-10 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#1f235a] hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setQuery(item.question);
                  sendMessage(item.question);
                }}
              >
                {item.question}
              </motion.div>
            ))}
          </div>

          {/* Static offers cards (you can later connect to backend) */}
          <div className="w-full h-fit">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full h-[20vh] flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]"
            >
              <img src={Logo} alt="" className="size-[10vw] ml-[2vw]" />
              <div className="flex flex-col text-white">
                <h1 className="font-semibold text-4xl mt-[3vh]">
                  Offre De 100GB
                </h1>
                <p className="font-light ">On convension avec : DTP</p>
                <p className="font-light ">
                  On offre cet promotions pour les clients de traveaux public
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]"
            >
              <img src={Logo} alt="" className="size-[10vw] ml-[2vw]" />
              <div className="flex flex-col text-white">
                <h1 className="font-semibold text-4xl mt-[3vh]">
                  Offre De 100GB
                </h1>
                <p className="font-light ">On convension avec : DTP</p>
                <p className="font-light ">
                  On offre cet promotions pour les clients de traveaux public
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]"
            >
              <img src={Logo} alt="" className="size-[10vw] ml-[2vw]" />
              <div className="flex flex-col text-white">
                <h1 className="font-semibold text-4xl mt-[3vh]">
                  Offre De 100GB
                </h1>
                <p className="font-light ">On convension avec : DTP</p>
                <p className="font-light ">
                  On offre cet promotions pour les clients de traveaux public
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]"
            >
              <img src={Logo} alt="" className="size-[10vw] ml-[2vw]" />
              <div className="flex flex-col text-white">
                <h1 className="font-semibold text-4xl mt-[3vh]">
                  Offre De 100GB
                </h1>
                <p className="font-light ">On convension avec : DTP</p>
                <p className="font-light ">
                  On offre cet promotions pour les clients de traveaux public
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default LandingPage;
