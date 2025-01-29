import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroMainPage from '../components/HeroMainPage'
import CardSection from '../components/CardSection'


const MainPage = () => {
  return (
    <div>
        <Navbar />
        <HeroMainPage />
        <CardSection />
        <Footer />
    </div>
  )
}

export default MainPage