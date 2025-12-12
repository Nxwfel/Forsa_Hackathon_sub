import React from 'react'
import HomePage  from './HomePage'
import About from './About'
import Footer from './Footer'
import { useEffect } from 'react'
import Lenis from 'lenis';
const LandingPage = () => {
  useEffect( () => {
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])
  return (
    <div className='min-h-screen w-screen overflow-x-hidden'>
        <HomePage/>
        <About/>
        <Footer/>
    </div>
  )
}

export default LandingPage