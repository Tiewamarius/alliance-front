import WhyUsContent from './WhyUsContent';
import QuoteForm from './QuoteForm';

export default function WhyUs() {
  return (
    <section className="why-us3 sec-padding" style={{ backgroundImage: 'url(/assets/whu-us-bg.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <img src="/assets/slide-anim.png" className="abs-img bottom-0" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6"><WhyUsContent /></div>
          <div className="col-lg-6"><QuoteForm /></div>
        </div>
      </div>
    </section>
  );
}
