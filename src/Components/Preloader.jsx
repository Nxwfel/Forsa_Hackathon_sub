import React from 'react'
import {motion , AnimatePresence} from 'framer-motion'
import Algerie_telecom from '../Assets/Algerie_Telecom.svg'
const Preloader = () => {
  return (
    <AnimatePresence>
        <div className='h-screen w-screen justify-center items-center flex flex-col bg-white'>
            <motion.img
            initial={{opacity:0, scale:0.5 , y:100}}
            animate={{opacity:1, scale:1 , y:0}}
            transition={{type:'spring', stiffness:100, delay:0.6}}
            src={Algerie_telecom} alt="Preloader" className='size-[50vh] -mt-[15vh] animate-spin-slow'/>
            <div className='h-[5vh] w-[40vw] rounded-full border-1 border-gray-100 p-1'>
                <motion.div
                initial={{width:0}}
                animate={{width:'100%'}}
                transition={{duration:2.2, delay:.5, ease:'easeInOut'}} 
                className='h-full bg-green-400 rounded-full'></motion.div>
                <motion.div
                initial={{width:0}}
                animate={{width:'100%'}}
                transition={{duration:2.2,delay:.7 , ease:'easeInOut'}} 
                className='bg-[#1f235a] rounded-full h-full -mt-[3.5vh]'></motion.div>
            </div>
        </div>
    </AnimatePresence>
  )
}

export default Preloader