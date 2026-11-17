import ParallaxSection from '../common/ParallaxSection';

export default function VideoBanner({ onPlay }) {
  return (
    <ParallaxSection image="/assets/video1.jpg" overlay={0.5} className="video-sec3 sec-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="video-content">
              <a href="#" className="play-btn bg-info rounded-circle text-primary icon-xl" onClick={(e) => { e.preventDefault(); onPlay?.(); }}>
                <span><i className="fa fa-play" /></span>
              </a>
              <h2 className="display-1 fw-bold">Change the Experience of Transportation</h2>
            </div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
