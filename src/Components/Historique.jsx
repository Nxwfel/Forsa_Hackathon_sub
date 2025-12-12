import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Historique = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample chat history data
  const chatHistory = [
    {
      id: 1,
      question: "Comment puis-je vérifier ma consommation de données ?",
      response: "Pour vérifier votre consommation de données, vous pouvez utiliser l'application mobile Algérie Télécom ou composer le *600# depuis votre téléphone.",
      timestamp: "2024-12-11 14:30",
      category: "Consommation",
      offers: [
        {
          title: "Offre De 100GB",
          partner: "DTP",
          description: "Promotion pour les clients de travaux public"
        }
      ]
    },
    {
      id: 2,
      question: "Quels sont les forfaits Internet disponibles ?",
      response: "Nous proposons plusieurs forfaits Internet : Fibre Optique de 10Mbps à 100Mbps, ADSL de 4Mbps à 20Mbps, et 4G LTE avec différentes options de données.",
      timestamp: "2024-12-11 13:15",
      category: "Forfaits",
      offers: [
        {
          title: "Fibre Optique Premium",
          partner: "Résidentiel",
          description: "Installation gratuite et 6 mois à prix réduit"
        },
        {
          title: "Pack Famille 200GB",
          partner: "Familles",
          description: "Internet illimité pour toute la famille"
        }
      ]
    },
    {
      id: 3,
      question: "Comment puis-je activer un nouveau service ?",
      response: "Pour activer un nouveau service, vous pouvez visiter l'une de nos agences, appeler notre service client au 12, ou utiliser votre espace client en ligne.",
      timestamp: "2024-12-11 10:45",
      category: "Services",
      offers: []
    },
    {
      id: 4,
      question: "Quel est le prix de la fibre optique ?",
      response: "Les prix de la fibre optique varient selon le débit : 10Mbps à partir de 1990 DA/mois, 20Mbps à 2990 DA/mois, et 100Mbps à 5990 DA/mois.",
      timestamp: "2024-12-10 16:20",
      category: "Tarifs",
      offers: [
        {
          title: "Fibre 1Gbps",
          partner: "Gaming",
          description: "La vitesse ultime pour les gamers"
        }
      ]
    },
    {
      id: 5,
      question: "Comment résilier mon abonnement ?",
      response: "Pour résilier votre abonnement, vous devez vous rendre dans une agence Algérie Télécom avec votre pièce d'identité et votre dernière facture.",
      timestamp: "2024-12-10 11:30",
      category: "Services",
      offers: []
    }
  ]

  const filteredHistory = chatHistory.filter(chat =>
    chat.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.response.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-gray-50 min-h-screen py-10'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-6xl font-bold text-[#1f235a] mb-4'>Historique</h1>
          <p className='text-xl text-gray-600'>Consultez vos conversations et résultats précédents</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8'
        >
          <div className='relative'>
            <input
              type="text"
              placeholder='Rechercher dans l historique...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full h-14 px-5 pr-12 rounded-2xl border-2 border-gray-200 focus:border-[#1f235a] outline-none transition-all bg-white shadow-sm'
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Chat History List */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white rounded-2xl shadow-lg p-4 max-h-[75vh] overflow-y-auto'
            >
              <h2 className='text-2xl font-semibold text-[#1f235a] mb-4 sticky top-0 bg-white pb-2'>
                Conversations ({filteredHistory.length})
              </h2>
              <div className='space-y-3'>
                {filteredHistory.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedChat?.id === chat.id
                        ? 'bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 flex-shrink-0 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm line-clamp-2 mb-1'>
                          {chat.question}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className={`text-xs ${selectedChat?.id === chat.id ? 'text-white/80' : 'text-gray-500'}`}>
                            {chat.timestamp}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedChat?.id === chat.id
                              ? 'bg-white/20'
                              : 'bg-[#1f235a]/10 text-[#1f235a]'
                          }`}>
                            {chat.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Selected Chat Details */}
          <div className='lg:col-span-2'>
            <AnimatePresence mode='wait'>
              {selectedChat ? (
                <motion.div
                  key={selectedChat.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='bg-white rounded-2xl shadow-lg p-6'
                >
                  {/* Question */}
                  <div className='mb-6'>
                    <div className='flex items-start gap-3 mb-3'>
                      <div className='bg-[#1f235a] p-2 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-500 mb-1'>Votre question</p>
                        <p className='text-lg font-medium text-gray-800'>{selectedChat.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div className='mb-6 bg-gray-50 rounded-xl p-4'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-gradient-to-r from-[#1f235a] to-[#292f81] p-2 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-500 mb-2'>Réponse de l'assistant</p>
                        <p className='text-gray-700 leading-relaxed'>{selectedChat.response}</p>
                      </div>
                    </div>
                  </div>

                  {/* Related Offers */}
                  {selectedChat.offers.length > 0 && (
                    <div>
                      <h3 className='text-xl font-semibold text-[#1f235a] mb-4 flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        Offres Recommandées
                      </h3>
                      <div className='space-y-4'>
                        {selectedChat.offers.map((offer, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg'
                          >
                            <div className='bg-white p-3 rounded-lg'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1f235a" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                              </svg>
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-semibold text-lg mb-1'>{offer.title}</h4>
                              <p className='text-sm text-white/90'>En convension avec : {offer.partner}</p>
                              <p className='text-sm text-white/80'>{offer.description}</p>
                            </div>
                            <button className='bg-white text-[#1f235a] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all'>
                              Voir
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className='mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500'>
                    <span className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {selectedChat.timestamp}
                    </span>
                    <span className='px-3 py-1 bg-[#1f235a]/10 text-[#1f235a] rounded-full'>
                      {selectedChat.category}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='bg-white rounded-2xl shadow-lg p-12 text-center h-full flex flex-col items-center justify-center'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                  <h3 className='text-2xl font-semibold text-gray-700 mb-2'>Sélectionnez une conversation</h3>
                  <p className='text-gray-500'>Choisissez une conversation dans la liste pour voir les détails</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-2xl shadow-lg p-12 text-center mt-8'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 mx-auto text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <h3 className='text-2xl font-semibold text-gray-700 mb-2'>Aucun résultat trouvé</h3>
            <p className='text-gray-500'>Essayez une recherche différente</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Historique