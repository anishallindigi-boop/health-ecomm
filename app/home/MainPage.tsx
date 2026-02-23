import React from 'react'
import HeroSection from './HeroSection'
import CategoryIcons from './CategoryIcons'
import ProductsSection from './ProductsSection'
import BestsellersSection from './BestsellersSection'
import TrustSection from './TrustSection'
import TestimonialsSection from './TestimonialsSection'
import BlogSection from './BlogSection'
import ShippingBar from './ShippingBar'
import BmiCalculator from './BmiCalculator'


const MainPage = () => {
  return (
   <>
   <HeroSection/>
   <CategoryIcons/>
   <ProductsSection/>

   <BmiCalculator/>
   <BestsellersSection/>
   {/* <TrustSection/> */}
   <TestimonialsSection/>
   <BlogSection/>
   <ShippingBar/>
   </>
  )
}

export default MainPage