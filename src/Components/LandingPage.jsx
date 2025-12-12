import React, { useState } from 'react'
import Logo from '../Assets/Algerie_Telecom.svg'
import { AnimatePresence, motion } from 'framer-motion'

const LandingPage = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const isActive = isFocused || query.trim().length > 0

  const handleSubmit = () => {
    if (!query.trim() || loading) return
    setLoading(true)
    // ici tu pourras brancher ton appel API / chatbot
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const exampleQuestions = [
    { question: 'Comment puis-je vérifier ma consommation de données ?' },
    { question: 'Quels sont les forfaits Internet disponibles ?' },
    { question: "Comment puis-je activer un nouveau service ?" },
  ]

  return (
      <AnimatePresence>
        <motion.div
            className="bg-white flex flex-col justify-center items-center overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* léger fond décoratif */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#1f235a]/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-[#292f81]/10 blur-3xl" />
          </div>

          <div className=" w-[60vw] flex flex-col justify-center items-center">
            {/* Titre principal animé */}
            <motion.div
                className="flex flex-col justify-center items-center"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
            <span className="text-7xl mt-[5vh] font-semibold text-[#1f235a] flex justify-center items-center">
              Assistant Intelligent
            </span>

              <span className="text-7xl -mt-10 font-semibold text-[#1f235a] flex justify-center items-center">
              D'
              <motion.img
                  src={Logo}
                  alt=""
                  className="size-[30vh]"
                  initial={{ scale: 0.9, rotate: -3, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  whileHover={{ scale: 1.03, rotate: 2 }}
              />
            </span>
            </motion.div>

            {/* Barre de recherche / question avec UX améliorée */}
            <motion.div
                className={`relative h-[9vh] w-[50vw] mt-[7vh] rounded-[2.5rem] border backdrop-blur-sm flex items-center transition-all duration-300 ${
                    isActive
                        ? 'border-[#1f235a] shadow-[0_0_25px_rgba(31,35,90,0.25)] bg-white'
                        : 'border-gray-300/70 bg-white/60 shadow-sm'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Label flottant */}
              <motion.span
                  className="absolute max-md:text-sm left-6 pointer-events-none poppins"
                  animate={
                    isActive
                        ? {
                          y: -18,
                          scale: 0.8,
                          color: '#1f235a',
                        }
                        : {
                          y: 0,
                          scale: 1,
                          color: 'rgba(156,163,175,0.8)', // gray-400
                        }
                  }
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                Posez votre question ici...
              </motion.span>

              <input
                  type="text"
                  className="poppins text-gray-800 h-full w-full bg-transparent px-5 pt-5 text-md outline-none rounded-[2.5rem]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
              />

              {/* Bouton d'envoi animé */}
              <motion.button
                  onClick={handleSubmit}
                  className="mr-4 flex items-center justify-center rounded-full p-2 hover:bg-[#1f235a]/5 transition-colors"
                  whileTap={{ scale: 0.9 }}
              >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="gray"
                    className="size-[2.5vw] max-md:size-[5vw] hover:stroke-[#1f235a] cursor-pointer"
                    animate={
                      loading
                          ? { rotate: 360 }
                          : { rotate: 0 }
                    }
                    transition={
                      loading
                          ? { repeat: Infinity, duration: 0.8, ease: 'linear' }
                          : { duration: 0.3 }
                    }
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </motion.svg>
              </motion.button>

              {/* Ligne d'aide */}
              <div className="absolute max-md:hidden -bottom-6 left-2 text-xs text-gray-400 poppins">
                Appuyez sur Entrée ou cliquez sur la flèche pour lancer l’assistant.
              </div>
            </motion.div>

            {/* Suggestions de questions */}
            <div className="flex justify-center items-center mt-10 max-md:flex-col">
              {exampleQuestions.map((item, index) => (
                  <motion.button
                      type="button"
                      key={index}
                      onClick={() => setQuery(item.question)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                      className="w-full flex flex-col p-3 shadow-lg rounded-xl border border-gray-200/70 justify-center items-center m-4 bg-white/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#1f235a] hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                  >
                    {item.question}
                  </motion.button>
              ))}
            </div>

            {/* Cartes d’offres mises en avant */}
            <div className="w-full h-fit mt-6 space-y-4">
              {[
                'Offre De 100GB',
                'Offre Fibre Pro',
                'Offre Famille 200GB',
                'Offre Nuit Illimitée',
              ].map((title, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="w-full h-[20vh] shadow-xl flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] overflow-hidden"
                  >
                    <div className="h-full flex items-center">
                      <motion.img
                          src={Logo}
                          alt=""
                          className="size-[10vw] ml-[2vw]"
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      />
                    </div>
                    <div className="flex flex-col text-white justify-center ml-4">
                      <h1 className="font-semibold text-3xl">
                        {title}
                      </h1>
                      <p className="font-light mt-1 text-sm">
                        En convention avec : DTP
                      </p>
                      <p className="font-light text-sm">
                        Une promotion exclusive pour nos clients des travaux publics.
                      </p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
  )
}

export default LandingPage
