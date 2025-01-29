import React from 'react'
import Navbar from '../components/Navbar'
import ProfileFuncsCard from '../components/ProfileFuncsCard'
import Footer from '../components/Footer'
import MyCard from '../components/MyCard'

const MyCard = () => {
  return (
    <div>
        <Navbar />
        <ProfileFuncsCard />
        <MyCard />
        <Footer />
    </div>
  )
}

export default MyCard