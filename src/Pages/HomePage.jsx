import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from '../Assets/Algerie_Telecom.svg'
import Robot from '../Assets/robot.svg'
import LogoLoop from '../Animations/LogoLoop.jsx';
import Ensia from '../Assets/ensia.png'
import Huawei from '../Assets/huawei.svg'
import AlgerieTelecom from '../Assets/Algerie_Telecom.svg'
import Particles from '../Components/Particles.jsx';
import {Link as Scroll} from 'react-scroll';
import {Link} from 'react-router-dom'
const HomePage = () => {
    const [showchatbot, setShowchatbot] = useState(false);


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
    }, [])

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
            <motion.h1
            initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.1}}
            className='font-semibold text-sm  text-[#088141] cursor-pointer'>Assistant</motion.h1>
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
            <div class="flex items-center justify-center mt-[5vh]">
                
            <div class="relative group">
                <button
                onClick={() => {
                    setShowchatbot(!showchatbot)
                }}
                class="relative inline-block p-px font-semibold leading-6 text-white bg-[#17c769] shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                >
                <span
                    class="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                ></span>

                <span class="relative z-10 block px-6 py-3 rounded-xl bg-[#088141]">
                    <div class="relative z-10 flex items-center space-x-2">
                    <span class="transition-all duration-500 group-hover:translate-x-1"
                        >Découvrer Nos Offres</span>
                    <svg
                        class="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                        data-slot="icon"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        clip-rule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        fill-rule="evenodd"
                        ></path>
                    </svg>
                    </div>
                </span>
                </button>
            </div>
            </div>
            {showchatbot && (
             <div  className='h-[50vh] w-[27vw] rounded-xl border border-neutral-400/30 m-3 shadow-lg flex flex-col justify-between items-center absolute right-0 bottom-0'>
              <div className='h-[8vh] w-full border-b border-b-gray-200 justify-between items-center flex'>
                 <div className='flex justify-center items-center'>
                    <img src={Robot} alt="" className='size-6 mx-3'/>
                    <h1>Assistant Intelligent</h1>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
                  onClick={()=>{
                    setShowchatbot(!showchatbot);
                 }} 
                 className="size-[2vw] mr-3 cursor-pointer hover:stroke-red-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                 </svg>
              </div>
              <div className='w-full px-1 flex justify-between items-center'>
                <div class="relative w-60 group">
                    <span
                        class="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-[#088141] to-[#22dd79] opacity-70 transition-all duration-300 group-focus-within:opacity-100"
                    ></span>
                    <input
                        type="text"
                        id="input"
                        placeholder=""
                        class="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white  border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 delay-200 placeholder-transparent"
                    />
                    <label
                        for="input"
                        class="absolute left-6 top-3.5 text-sm text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-indigo-500 peer-focus:font-semibold cursor-text"
                    >
                        Write Here
                    </label>
                    </div>
              <div className='h-[6vh] w-[7vh]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-[3vw] stroke-[#088141] hover:scale-110 hover:-rotate-12 cursor-pointer transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
             </div>
              
            </div>
            )}

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