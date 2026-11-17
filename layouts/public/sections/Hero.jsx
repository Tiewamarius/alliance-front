import ParallaxSection from '../common/ParallaxSection';
import HeroContent from './HeroContent';

export default function Hero() {
  return (
    <ParallaxSection image="/assets/home3-bg.jpg" overlay={0.8} className="hero-3">
      <div className="container ct-container">
        <div className="row align-items-center">
          <div className="col-lg-4"><HeroContent /></div>
          <div className="col-lg-8">
            <div className="hero-media"><img src="/assets/hero-3.png" className="img-fluid" alt="Hero" /></div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
