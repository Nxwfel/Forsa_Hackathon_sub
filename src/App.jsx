import { useState } from "react";
import LandingPage from "./Components/LandingPage.jsx";
import Offers from "./Components/Offers.jsx";
import logo from "./Assets/Algerie_Telecom.svg";
import Historique from "./Components/Historique.jsx";
import DataIntegration from "./Components/DataIntegration.jsx";
import SearchEngine from "./Components/SearchEngine.jsx";
import { AnimatePresence, motion } from "framer-motion";

const NAV = [
  {
    key: "Chatbot",
    label: "Chatbot",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="w-7 h-7">
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
    ),
  },
  {
    key: "Search",
    label: "Recherche",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    ),
  },
  {
    key: "Offres",
    label: "Offres",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="w-7 h-7">
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
          />
        </svg>
    ),
  },


  {
    key: "Historique",
    label: "Historique",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
  },
  {
    key: "DataIntegration",
    label: "Integration",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="w-7 h-7">
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
    ),
  },
];

function App() {
  const [tab, setTab] = useState("Chatbot");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
      <div className="h-screen w-screen flex bg-white p-3 px-4 gap-4 overflow-hidden">
        {/* SIDEBAR */}
        <motion.aside
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
            animate={{ width: isExpanded ? 220 : 76 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="h-full rounded-2xl border border-gray-300/60 bg-white shadow-sm overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-center pt-5 pb-4">
            <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          </div>

          <nav className="flex-1 px-2">
            <ul className="flex flex-col gap-3 mt-4">
              {NAV.map((item) => {
                const active = tab === item.key;

                return (
                    <li key={item.key}>
                      <button
                          type="button"
                          onClick={() => setTab(item.key)}
                          className={`w-full rounded-xl py-3 transition-all flex flex-col items-center justify-center gap-1
                      ${active ? "bg-[#1f235a] text-white" : "bg-white text-[#1f235a] hover:bg-[#1f235a] hover:text-white"}
                    `}
                      >
                        <span className="text-current [&>svg]:stroke-current">{item.icon}</span>

                        <AnimatePresence>
                          {isExpanded && (
                              <motion.span
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="text-[12px] font-medium leading-none"
                              >
                                {item.label}
                              </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-3 pb-4">
            <div className="h-px bg-gray-200/80 mb-3" />
            <div className="text-[11px] text-gray-500 text-center">
              <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                    >
                      Idevelop - 2
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>

        {/* CONTENT */}
        <main className="flex-1 h-full w-full overflow-y-auto rounded-2xl">
          {tab === "Chatbot" && <LandingPage />}
          {tab === "Offres" && <Offers />}
          {tab === "Historique" && <Historique />}
          {tab === "DataIntegration" && <DataIntegration />}
          {tab === "Search" && <SearchEngine />}
        </main>
      </div>
  );
}

export default App;
