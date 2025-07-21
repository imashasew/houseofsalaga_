import React from 'react'
import './Home.css'
import Hero from '../../Components/Hero/Hero'
import TrendingSection from '../../Components/TrendingSection/TrendingSection'
import NewArrivals from '../../Components/NewArrivals/NewArrivals'
import Testimonials from '../../Components/Testimonials/Testimonials'
import Footer from '../../Components/Footer/Footer'
import Header from '../../Components/Header/Header'

function Home() {
  return (
    <div>
        <Header/>
        <Hero/>
        <TrendingSection />
        <NewArrivals/>
        <Testimonials/>
        <Footer/>
        
      
    </div>
  )
}

export default Home
