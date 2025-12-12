import React , {useState} from 'react'
import Logo from '../Assets/Algerie_Telecom.svg'
import { AnimatePresence , motion } from 'framer-motion'
const LandingPage = () => {
  const [loading , setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isFocused || query.trim().length > 0
  return (
    <AnimatePresence>
      <div className='bg-white flex flex-col justify-center items-center'>
        <div className=" w-[60vw] flex flex-col justify-center items-center">
            <div className='flex'>
              <span className='text-7xl mt-[5vh] font-semibold text-[#1f235a] flex justify-center items-center'>
                Assistant Intelligent
              </span>

            </div>
            <span className='text-7xl -mt-10 font-semibold text-[#1f235a] flex justify-center items-center'>D'<img src={Logo} alt="" className='size-[30vh]'/> </span>
            <div
                className={`h-[9vh] w-[50vw] flex justify-between items-center mt-[7vh] rounded-3xl border transform transition-all duration-300 ${
                    isActive
                        ? 'border-[#1f235a] bg-gray-100 shadow-lg scale-[1.02]'
                        : 'border-gray-300 bg-white'
                }`}
            >
              <input
                  type="text"
                  placeholder="Posez votre question ici..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="poppins text-gray-700 h-full w-full bg-transparent px-5 text-md outline-none rounded-3xl"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-[2.5vw] hover:stroke-[#1f235a] mr-4 cursor-pointer hover:-rotate-30 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </div>
            <div className='flex justify-center items-center'>
               {[
                { question: "Comment puis-je vérifier ma consommation de données ?"},
                { question: "Quels sont les forfaits Internet disponibles ?" },
                { question: "Comment puis-je activer un nouveau service ?"},

               ].map((item , index) => (
                <motion.div
                initial={{opacity:0 , y:10}}
                animate={{opacity:1 , y:0}}
                transition={{delay: index * 0.2}}
                key={index} className='w-full flex flex-col p-3 shadow-lg rounded-xl border border-gray-300/50 justify-center items-center m-10 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl hover:border-[#1f235a] hover:bg-gray-50 cursor-pointer'>
                {item.question}
                </motion.div>
               ))}
            </div>
            <div className='w-full h-fit'>
              <motion.div
              initial={{opacity:0 , x:10}}
              whileInView={{opacity:1 , x:0}}

              className='w-full h-[20vh] flex rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]'>
                <img src={Logo} alt="" className='size-[10vw] ml-[2vw]'/>
                <div className='flex flex-col text-white'>
                  <h1 className='font-semibold text-4xl mt-[3vh]'>Offre De 100GB</h1>
                  <p className='font-light '>On convension avec : DTP</p>
                  <p className='font-light '>On offre cet promotions pour les clients de traveaux public</p>
                </div>

              </motion.div>
                <motion.div
              initial={{opacity:0 , x:-10}}
              whileInView={{opacity:1 , x:0}} className='w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]'>
                <img src={Logo} alt="" className='size-[10vw] ml-[2vw]'/>
                <div className='flex flex-col text-white'>
                  <h1 className='font-semibold text-4xl mt-[3vh]'>Offre De 100GB</h1>
                  <p className='font-light '>On convension avec : DTP</p>
                  <p className='font-light '>On offre cet promotions pour les clients de traveaux public</p>
                </div>

              </motion.div>
                            <motion.div
              initial={{opacity:0 , x:10}}
              whileInView={{opacity:1 , x:0}}
              className='w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]'>
                <img src={Logo} alt="" className='size-[10vw] ml-[2vw]'/>
                <div className='flex flex-col text-white'>
                  <h1 className='font-semibold text-4xl mt-[3vh]'>Offre De 100GB</h1>
                  <p className='font-light '>On convension avec : DTP</p>
                  <p className='font-light '>On offre cet promotions pour les clients de traveaux public</p>
                </div>

              </motion.div>
                            <motion.div
              initial={{opacity:0 , x:-10}}
              whileInView={{opacity:1 , x:0}}
              className='w-full h-[20vh] shadow-xl flex mt-[3vh] rounded-2xl bg-gradient-to-tr from-[#1f235a] to-[#292f81]'>
                <img src={Logo} alt="" className='size-[10vw] ml-[2vw]'/>
                <div className='flex flex-col text-white'>
                  <h1 className='font-semibold text-4xl mt-[3vh]'>Offre De 100GB</h1>
                  <p className='font-light '>On convension avec : DTP</p>
                  <p className='font-light '>On offre cet promotions pour les clients de traveaux public</p>
                </div>

              </motion.div>


            </div>
          </div>

      </div>
    </AnimatePresence>
  )
}

export default LandingPage