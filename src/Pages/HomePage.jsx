import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from '../Assets/Algerie_Telecom.svg'
import LogoLoop from '../Animations/LogoLoop.jsx';
import Ensia from '../Assets/ensia.png'
import Huawei from '../Assets/huawei.svg'
import AlgerieTelecom from '../Assets/Algerie_Telecom.svg'
import Particles from '../Components/Particles.jsx';
import Preloader from '../Components/Preloader.jsx'
import {Link as Scroll} from 'react-scroll';
import {Link} from 'react-router-dom'

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  // Alternative with image sources
  const imageLogos = [
    { src: Huawei , alt: "Company 1"},
    { src: AlgerieTelecom, alt: "Company 2"},
    { src: Ensia, alt: "Company 3"},
  ];

  const heroRef = useRef(null)
  const navRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    // Set timeout for preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); // 3 seconds - adjust this value as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    // Only run GSAP animations after loading is complete
    if (!loading && heroRef.current && titleRef.current) {
      // Floating animation for hero elements
      gsap.to(heroRef.current, {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      })

      // Blur effect on scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          const progress = self.progress
          gsap.to(heroRef.current, {
            filter: `blur(${progress * 10}px)`,
            opacity: 1 - progress * 0.5
          })
        }
      })

      // Parallax effect for title
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 1
        },
        y: 100,
        opacity: 0.3
      })
    }
  }, [loading])

  // Show preloader while loading
  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-start items-center overflow-x-hidden'>
      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className='w-[40vw] h-[10vh] z-10 rounded-full justify-center items-center gap-[2vw] flex'>
        <Scroll to="About" smooth={true} duration={500}>
          <motion.h1
            initial={{scale:1,y:-10, opacity:0}}
            animate={{y:0, opacity:1}}
            whileHover={{scale:1.1}}
            className='font-semibold text-sm text-[#088141] cursor-pointer'>A propos</motion.h1>
        </Scroll>
        <motion.img
          initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.1}}
          src={Logo} alt=""  className='size-[5vw] mt-[2vh] cursor-pointer'/>
        <Link to={'/dashboard'}>
          <motion.h1
            initial={{scale:1,y:-10, opacity:0}}
            animate={{y:0, opacity:1}}
            whileHover={{scale:1.1}}
            className='font-semibold text-sm  text-[#088141] cursor-pointer'>Assistant</motion.h1>
        </Link>
      </div>
      <div ref={heroRef} className='w-[80vw] h-[70vh] rounded-3xl mt-[20vh] flex flex-col justify-center items-center'>
        <motion.h1
          initial={{scale:1.2, opacity:0}}
          animate={{scale:1, opacity:1}}
          transition={{delay:0.4}}
          className='text-[#1F235A] poppins font-bold text-7xl text-center' >Decouvré Nos Offres Vous mème</motion.h1>
        <div className='flex justify-center items-center gap-[1vw] mt-[2vh]'>
          <motion.h1
            initial={{scale:1.2, opacity:0}}
            animate={{scale:1, opacity:1}}
            transition={{delay:0.4}}
            className='text-[#1F235A]/30 poppins font-bold text-md'>----- Un Pas Vers Vous Avec Notre Assistant Basé sur AI</motion.h1>
        </div>
        <div className="flex items-center justify-center mt-[5vh]">
          <div className="relative group">
            <Link to={'/dashboard'}>
              <button
                className="relative inline-block p-px font-semibold leading-6 text-white bg-[#17c769] shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                <span
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                ></span>

                <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#088141]">
                  <div className="relative z-10 flex items-center space-x-2">
                    <span className="transition-all duration-500 group-hover:translate-x-1"
                    >Découvrer Nos Offres</span>
                    <svg
                      className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                      data-slot="icon"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </span>
              </button>
            </Link>
          </div>
        </div>

        <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}} className='w-[80vw] mt-[15vh]'>
          {/* Basic horizontal loop */}
          <LogoLoop
            logos={imageLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage