import SectionIntro from '../common/SectionIntro';
import ProcessStep from './ProcessStep';

const text = "Simply provide details about your shipment, and we'll give you a transparent quote.";
const steps = [
  { count: '01', icon: '/assets/process-1.png', title: 'Get a Quote' },
  { count: '02', icon: '/assets/process-2.png', title: 'Book Your Shipment' },
  { count: '03', icon: '/assets/process-3.png', title: 'Delivery & Support' },
];

export default function Process() {
  return (
    <section className="process-sec3 sec-padding">
      <div className="container">
        <SectionIntro center className="mb-5 pb-5" subtitle="About Our Company" title="Valuable Process For Our Customers" />
        <div className="row">
          {steps.map((s) => <div key={s.count} className="col-md-4"><ProcessStep {...s} text={text} /></div>)}
        </div>
      </div>
    </section>
  );
}
