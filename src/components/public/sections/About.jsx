import SectionIntro from '../common/SectionIntro';
import Button from '../common/Button';
import QuickCall from '../common/QuickCall';
import AboutMedia from './AboutMedia';
import AboutTabs from './AboutTabs';

export default function About() {
  return (
    <section className="about-sec3 sec-padding bg-cover" style={{ backgroundImage: 'url(/assets/about-bg.jpg)' }}>
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-7 mx-lg-auto"><AboutMedia /></div>
          <div className="col-xl-7">
            <div className="about-content3">
              <SectionIntro subtitle="About Our Company" title="Our services increase the productivity of your work.">
                <p>Our global logistics expertise, advanced supply chain technology &amp; customized logistics solutions will help you analyze, develop, and implement successful</p>
              </SectionIntro>
              <AboutTabs />
              <div className="d-sm-flex align-items-center about-cta gap-5 mt-5">
                <Button href="/about">About Us</Button>
                <QuickCall />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
