import React , {useState} from 'react'
import {motion} from 'framer-motion'
import Logo from '../Assets/Algerie_Telecom.svg'
const HomePage = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-start items-center overflow-x-hidden'>
      <div className='w-[40vw] h-[10vh] rounded-full justify-center items-center gap-[2vw] flex'>
          <motion.h1 
          initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.06}}
          className='font-bold text-sm text-[#1F235A] -mt-[1vh] cursor-pointer'>Acceuil</motion.h1>
            <motion.h1
            initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.06}}
            className='font-bold text-sm text-[#1F235A] cursor-pointer'>A propos</motion.h1>
            <motion.img
            initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.06}}
            src={Logo} alt=""  className='size-[5vw] cursor-pointer'/>
            <motion.h1
            initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.06}}
            className='font-bold text-sm  text-[#1F235A] cursor-pointer'>Contact</motion.h1>
          <motion.h1
          initial={{scale:1,y:-10, opacity:0}}
          animate={{y:0, opacity:1}}
          whileHover={{scale:1.06}}
          className='font-bold text-sm text-[#1F235A] -mt-[1vh] cursor-pointer'>Services</motion.h1>
      </div>
        <div className='w-[80vw] h-[70vh] rounded-3xl mt-[5vh] flex flex-col justify-center items-center'>
            <motion.h1
            initial={{scale:1.2, opacity:0}}
            animate={{scale:1, opacity:1}}
            transition={{delay:0.4}}
            className='text-[#1F235A]  tommorow font-bold text-7xl text-center' >Decouvré Nos Offres Vous mème</motion.h1>
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
            <div className='h-[50vh] w-[27vw] rounded-xl border border-neutral-400/30 m-3 shadow-lg flex flex-col justify-start items-center absolute right-0 bottom-0'>
              <div className='h-[8vh] w-full border-b justify-between items-center flex'>

              </div>
            </div>

        </div>

    </div>
  )
}

export default HomePage