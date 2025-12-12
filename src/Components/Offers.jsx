import React, { useState } from 'react'
import logo from '../Assets/Algerie_Telecom.svg'
import { motion, AnimatePresence } from 'framer-motion'

const Offers = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  
  // Sample offers data - you can replace this with your actual data
  const offers = [
    {
      id: 1,
      title: "Offre De 100GB",
      partner: "DTP",
      description: "On offre cet promotions pour les clients de traveaux public",
      category: "Internet",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    },
    {
      id: 2,
      title: "Offre Mobile 50GB",
      partner: "Entreprises",
      description: "Forfait spécial pour les entreprises avec données illimitées",
      category: "Mobile",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    },
    {
      id: 3,
      title: "Fibre Optique Premium",
      partner: "Résidentiel",
      description: "Installation gratuite et 6 mois à prix réduit",
      category: "Fibre",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    },
    {
      id: 4,
      title: "Pack Famille 200GB",
      partner: "Familles",
      description: "Internet illimité pour toute la famille",
      category: "Internet",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    },
    {
      id: 5,
      title: "Mobile Pro 100GB",
      partner: "Professionnels",
      description: "Communication illimitée pour les professionnels",
      category: "Mobile",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    },
    {
      id: 6,
      title: "Fibre 1Gbps",
      partner: "Gaming",
      description: "La vitesse ultime pour les gamers",
      category: "Fibre",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg/1200px-Alg%C3%A9rie_T%C3%A9l%C3%A9com_logo.svg.png"
    }
  ]

  const categories = ['Tous', 'Internet', 'Mobile', 'Fibre']

  const filteredOffers = selectedCategory === 'Tous' 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory)

  return (
    <div className='bg-white min-h-screen py-10'>
      <div className='w-[50vw] ml-[25vw] mx-auto px-6'>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-12'
        >
          <h1 className='text-6xl font-bold text-[#1f235a] mb-4'>Nos Offres</h1>
          <p className='text-xl text-gray-600'>Découvrez toutes nos offres et promotions</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='flex justify-center items-center gap-4 mb-12 flex-wrap'
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
                  ? 'bg-gradient-to-r from-[#1f235a] to-[#292f81] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Offers Grid */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='grid grid-cols-1 gap-6'
          >
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className='w-full min-h-[25vh] flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81] shadow-xl cursor-pointer overflow-hidden'
              >
                <img 
                  src={logo} 
                  alt={offer.title} 
                  className='size-[10vw] ml-[2vw] object-contain'
                />
                <div className='flex flex-col py-6 text-white justify-center flex-1 pr-6'>
                  <h1 className='font-semibold text-4xl'>{offer.title}</h1>
                  <p className='font-light mt-1'>En convension avec : {offer.partner}</p>
                  <p className='font-light'>{offer.description}</p>
                  <div className='mt-2'>
                    <span className='inline-block bg-white/20 px-3 py-1 rounded-full text-sm'>
                      {offer.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-20'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 mx-auto text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <h3 className='text-2xl font-semibold text-gray-700 mb-2'>Aucune offre disponible</h3>
            <p className='text-gray-500'>Aucune offre ne correspond à cette catégorie pour le moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Offers