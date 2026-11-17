import SectionIntro from '../common/SectionIntro';
import ServiceCard from './ServiceCard';

const text = 'Lorain Air freight service deliver Logistic knowledge opportunity optimize every mile on every lane. Get full-service';
const services = [
  { title: 'Sea Transport', image: '/assets/serv5.jpg', icon: '/assets/serv-icon-1.png' },
  { title: 'Road Flight', image: '/assets/serv6.jpg', icon: '/assets/serv-icon-2.png' },
  { title: 'Skyline Express', image: '/assets/serv7.jpg', icon: '/assets/serv-icon-3.png' },
  { title: 'Railway Logistic', image: '/assets/serv8.jpg', icon: '/assets/serv-icon-4.png' },
];

export default function Services() {
  return (
    <section className="services-3 sec-padding overflow-hidden">
      <div className="container ct-container">
        <SectionIntro center subtitle="What to expect" title="Boost Your Business Efficiency" />
        <div className="row">
          {services.map((s) => (
            <div key={s.title} className="col-xl-3 col-md-6"><ServiceCard {...s} text={text} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
