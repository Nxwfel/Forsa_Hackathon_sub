import React from 'react'

const Footer = () => {
  return (
    <div 
      className='relative h-[800px]'
      style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}
    >
      <div className='fixed bottom-0 h-[800px] w-full flex flex-col justify-center text-center items-center'>
        <h1 className='poppins text-8xl text-[#1F235A] font-semibold'>
            Essayer l'Assistant Maintenant !
        </h1>
        <button
        class="cursor-pointer mt-[7vh] bg-gradient-to-b from-teal-500 to-green-600 px-6 py-3 rounded-xl border-[1px] border-green-300-500 text-white font-medium group"
        >
        <div class="relative overflow-hidden">
            <p
            class="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
            >
            Essayer Maintenant
            </p>
            <p
            class="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
            >
            Essayer Maintenant
            </p>
        </div>
        </button>

      </div>
    </div>
  )
}

export default Footer