import React from 'react'
import HomePage  from './HomePage'
import About from './About'
const LandingPage = () => {
  return (
    <div className='min-h-screen w-screen overflow-x-hidden'>
        <HomePage/>
        <About/>
    </div>
  )
}

export default LandingPage