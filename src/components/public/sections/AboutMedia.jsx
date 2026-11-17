import Counter from '../common/Counter';

export default function AboutMedia({ years = 25 }) {
  return (
    <div className="about-media3 position-relative">
      <div className="feat-img position-relative">
        <img src="/assets/about-ft.jpg" className="img-fluid round" alt="about" />
        <div className="experien-stat">
          <p className="text-info m-0"><Counter end={years} />+ Years Experience</p>
        </div>
      </div>
      <div className="d-flex ab-sm-ft align-items-center gap-4">
        <img className="round img-fluid" src="/assets/about-ft2.png" alt="about" />
        <img className="img-fluid" src="/assets/about-ft3.png" alt="about" />
      </div>
      <div className="ab-stat2"><img src="/assets/ab-st2.png" alt="" /></div>
    </div>
  );
}
