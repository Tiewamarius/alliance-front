import ParallaxSection from '../common/ParallaxSection';
import Button from '../common/Button';
import StatItem from './StatItem';

export default function Stats() {
  return (
    <ParallaxSection image="/assets/stat-bg2.jpg" overlay={0.2} className="stat-sec3 sec-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-6">
            <div className="stat-entries d-flex flex-wrap align-items-center bg-info round justify-content-between">
              <StatItem end={25} suffix="%" label="Faster Order Processing" />
              <StatItem end={98} suffix="%" label="Fulfillment Accuracy" />
              <StatItem end={500} suffix="K" label="Orders Shipped Annually" />
              <div className="s-item"><Button href="/contact">Contact Us</Button></div>
            </div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
