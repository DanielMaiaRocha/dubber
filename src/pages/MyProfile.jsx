import React from 'react'
import Navbar from '../components/Navbar'
import ProfileFuncs from '../components/ProfileFuncs'
import ProfileHero from '../components/ProfileHero'
import Footer from '../components/Footer'

const MyProfile = () => {
  return (
    <div>
        <Navbar />
        <ProfileFuncs />
        <ProfileHero />
        <Footer />
    </div>
  )
}

export default MyProfile