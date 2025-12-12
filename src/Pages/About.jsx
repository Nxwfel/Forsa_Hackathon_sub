import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AlgerieTelecom from '../Assets/Algerie_Telecom.svg'
gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const leftSideRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const leftSide = leftSideRef.current
    const container = containerRef.current

    // Pin the left side while scrolling through this section only
    const pinTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: leftSide,
      pinSpacing: false
    })

    return () => {
      pinTrigger.kill()
    }
  }, [])

  const sections = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "Réponse Ultra-Rapide",
      stat: "< 3 secondes",
      description: "Notre assistant intelligent traite vos demandes et fournit des réponses précises en moins de 3 secondes, garantissant une expérience utilisateur fluide et efficace.",
      color: "from-[#1f235a] to-[#292f81]"
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
      ),
      title: "Multilingue",
      stat: "Arabe & Français",
      description: "Communiquez dans votre langue préférée. Notre assistant maîtrise parfaitement l'arabe et le français, offrant une expérience personnalisée et accessible à tous.",
      color: "from-[#088141] to-[#0aa352]"
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      title: "Précision Optimale",
      stat: "85% de précision",
      description: "Bénéficiez des meilleures offres avec un taux de précision de 85%. Notre IA analyse vos besoins et recommande les solutions les plus adaptées à votre profil.",
      color: "from-[#FFC400] to-[#FFC400]"
    }
  ]

  return (
    <div ref={containerRef} className='relative bg-white w-full flex'>
      {/* Left Side - Will be pinned by GSAP */}
      <div 
        ref={leftSideRef}
        className='w-[50%] h-screen flex items-center justify-center bg-white'
      >
        <motion.img 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          src={AlgerieTelecom}
          alt="Algerie Telecom Logo" 
          className='w-[35vw] h-auto'
        />
      </div>

      {/* Right Side - Scrollable Sections */}
      <div className='w-[50%]'>

        {/* Feature Sections */}
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className='min-h-screen flex flex-col justify-center p-[5vw]'
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className='space-y-6'
            >
              {/* Icon with gradient background */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-xl`}
              >
                {section.icon}
              </motion.div>

              {/* Title */}
              <h2 className='text-5xl font-bold text-black'>
                {section.title}
              </h2>

              {/* Stat Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${section.color} text-white font-semibold text-xl shadow-lg`}
              >
                {section.stat}
              </motion.div>

              {/* Description */}
              <p className='text-xl text-gray-700 leading-relaxed max-w-xl'>
                {section.description}
              </p>

              {/* Progress Bar or Visual Element */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.4, duration: 1 }}
                className='h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden'
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: section.id === 3 ? '85%' : '100%' }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${section.color}`}
                />
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About