import { useState } from 'react'
import LandingPage from './Components/LandingPage.jsx'
import Offers from './Components/Offers.jsx'
import logo from './Assets/Algerie_Telecom.svg'
import Historique from './Components/Historique.jsx'
import DataIntegration from './Components/DataIntegration.jsx'
import SearchEngine from './Components/SearchEngine.jsx'
import { motion } from 'framer-motion'
function App() {
   const [tab , setTab] = useState('Chatbot')
  return (
    <div className='h-screen w-screen justify-start items-start flex p-3 px-4 bg-white'>
      <motion.div 
      initial={{width:'4vw' , borderRadius:'1.5vw' , color:'[#1f235a]'}}
      whileHover={{width:'15vw' , borderRadius:'2vw' , color:'#fff'}}
      className='min-h-fit pb-[8vh] w-[5vw] flex flex-col jusitfy-between pl-1 border-1 border-gray-300/60 overflow-hidden'>
        <img src={logo} alt="" className='mt-5 m-2'/>
        <ul className='h-full w-full gap-10 items-start flex flex-col mt-[25vh] pl-[.4vw] pr-2 '>
        <motion.li
        initial={{backgroundColor:'#fff', color:'#1f235a' , stroke:'#1f235a'}}
        whileHover={{backgroundColor:'#1f235a', color:'#fff' , stroke:'#fff'}}
        onClick={() => {
          setTab('Chatbot')
        }}
        className='flex items-center justify-center gap-5 cursor-pointer min-w-full overflow-x-hidden rounded-lg py-1'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="size-[2.5vw] ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <span className='text-[1vw] '>Chatbot</span>
        </motion.li>
        <motion.li
        initial={{backgroundColor:'#fff', color:'#1f235a' , stroke:'#1f235a'}}
        whileHover={{backgroundColor:'#1f235a', color:'#fff' , stroke:'#fff'}}
        onClick={() => {
          setTab('Offres')
        }}
         className='flex items-center justify-center gap-5 cursor-pointer min-w-full overflow-x-hidden rounded-lg py-1'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}  className="size-[2.5vw] ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>

          <span className='text-[1vw]'>Offres</span>
        </motion.li>
        <motion.li
        initial={{backgroundColor:'#fff' , color:'#1f235a' , stroke:'#1f235a'}}
        whileHover={{backgroundColor:'#1f235a' , color:'#fff' , stroke:'#fff'}}
        onClick={() => {
          setTab('Historique')
        }}
         className='flex items-center justify-center rounded-lg py-1 cursor-pointer gap-5 min-w-full overflow-x-hidden'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}  className="size-[2.5vw] ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className='text-[1vw]'>Historique</span>
        </motion.li>
        <motion.li
        initial={{backgroundColor:'#fff' , color:'#1f235a' , stroke:'#1f235a'}}
        whileHover={{backgroundColor:'#1f235a' , color:'#fff' , stroke:'#fff'}}
        onClick={() => {
          setTab('DataIntegration')
        }}
         className='flex items-center justify-center rounded-lg py-1 cursor-pointer gap-5 min-w-full overflow-x-hidden'>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-[2.5vw]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>

          <span className='text-[1vw]'>Integration</span>
        </motion.li>
        <motion.li
        initial={{backgroundColor:'#fff' , color:'#1f235a' , stroke:'#1f235a'}}
        whileHover={{backgroundColor:'#1f235a' , color:'#fff' , stroke:'#fff'}}
        onClick={() => {
          setTab('Search')
        }}
         className='flex items-center justify-center rounded-lg py-1 cursor-pointer gap-5 min-w-full overflow-x-hidden'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-[2.5vw]">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
          <span className='text-[1vw]'>Recherche</span>
        </motion.li>
        </ul>
      </motion.div>
      <div className='relative'>
      { tab === 'Chatbot' && (
        <div className=''>

        <LandingPage />

        </div>
      )
      }
      { tab === 'Offres' && (
        <div className=''>
           <Offers />
        </div>
      )
      }
      { tab === 'Historique' && (
        <div className=''>
           <Historique />
        </div>
      )
      }
      { tab === 'DataIntegration' && (
        <div className=''>
           <DataIntegration />
        </div>
      )
      }
      { tab === 'Search' && (
        <div className=''>
           <SearchEngine />
        </div>
      )
      }
      </div>
    </div>
  )
}

export default App
