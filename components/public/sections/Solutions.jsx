import SectionIntro from '../common/SectionIntro';
import SolutionMedia from './SolutionMedia';
import SolutionCard from './SolutionCard';

// Remplacez ces icônes Font Awesome par vos SVG d'origine si vous le souhaitez.
const cards = [
  { icon: <i className="fa-solid fa-ship" />, title: 'Shipping Services' },
  { icon: <i className="fa-solid fa-diagram-project" />, title: 'Distributions Plan' },
  { icon: <i className="fa-solid fa-truck-fast" />, title: 'GPS Tracking' },
  { icon: <i className="fa-solid fa-boxes-stacked" />, title: 'Flexible Shipment' },
];

export default function Solutions() {
  return (
    <section className="solution-sec bg-shade overflow-hidden sec-padding position-relative">
      <img src="/assets/solution-sh.png" className="anim-img start-0 moveXS left-bottom" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-lg-5"><SolutionMedia /></div>
          <div className="col-lg-7 ps-lg-5">
            <div className="sol-content">
              <SectionIntro className="sol-header mb-5" subtitle="Our Solutions" title="Logistics service outsourcing advantages in 2025" />
              <div className="solution-wrap d-flex align-items-center justify-content-between">
                {cards.map((c) => <SolutionCard key={c.title} {...c} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
