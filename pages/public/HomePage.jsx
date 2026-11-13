import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/public/layout/Footer';
import CanvasMenu from '../components/public/layout/CanvasMenu';
import SearchPopup from '../components/public/layout/SearchPopup';
import ScrollTop from '../components/public/layout/ScrollTop';
import Hero from '../components/public/sections/Hero';
import Services from '../components/public/sections/Services';
import TextMarquee from '../components/public/sections/TextMarquee';
import About from '../components/public/sections/About';
import Stats from '../components/public/sections/Stats';
import BrandsCarousel from '../components/public/sections/BrandsCarousel';
import Process from '../components/public/sections/Process';
import Solutions from '../components/public/sections/Solutions';
import VideoBanner from '../components/public/sections/VideoBanner';
import RecentWork from '../components/public/sections/RecentWork';
import WhyUs from '../components/public/sections/WhyUs';
import Reviews from '../components/public/sections/Reviews';
import Blog from '../components/public/sections/Blog';

export default function HomePage() {
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} onBurger={() => setCanvasOpen(true)} />
      <Hero />
      <Services />
      <TextMarquee />
      <About />
      <Stats />
      <BrandsCarousel />
      <Process />
      <Solutions />
      <VideoBanner />
      <RecentWork />
      <WhyUs />
      <Reviews />
      <Blog />
      <Footer />
      <CanvasMenu open={canvasOpen} onClose={() => setCanvasOpen(false)} />
      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ScrollTop />
    </>
  );
}
