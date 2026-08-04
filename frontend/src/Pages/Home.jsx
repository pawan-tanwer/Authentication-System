import React from 'react'
import Navbar from '../components/home/Navbar'
import Left from '../components/home/Left'
import Right from '../components/home/Right'

const Home = () => {
  return (
    <div className='w-full h-auto bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A] flex gap-10 p-20 px-24'>
      <Left/>
      <Right/>
    </div>
  )
}

export default Home
