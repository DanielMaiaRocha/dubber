import React from 'react'
import Navbar from '../components/Navbar'
import ProfileFuncsCard from '../components/ProfileFuncsCard'
import MyCard from '../components/MyCard'
import Footer from '../components/Footer'

const MyCardPage = () => {
  return (
    <div>
        <Navbar />
        <ProfileFuncsCard />
        <MyCard />
        <Footer />
    </div>
  )
}

export default MyCardPage