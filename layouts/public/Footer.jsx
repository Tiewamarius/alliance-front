import ParallaxSection from './common/ParallaxSection';
import FooterNewsletter from './FooterNewsletter';
import FooterAbout from './FooterAbout';
import FooterLinks from './FooterLinks';
import OpeningHours from './OpeningHours';
import FooterBottom from './FooterBottom';

const quick = [
  { label: 'About Us', href: '/about' }, { label: 'Our Services', href: '/services' },
  { label: 'Project', href: '/projects' }, { label: "FAQ's", href: '/faq' },
  { label: 'Our Blog', href: '/blog' }, { label: 'Contact Us', href: '/contact' },
];
const services = ['Ship Fright Shipping', 'Less Than Truckload', 'Container Freight', 'Adult Health', 'Rail Freight Shipping', 'Air Fright Trucking']
  .map((label) => ({ label, href: '/single-service' }));

export default function Footer() {
  return (
    <ParallaxSection as="footer" image="/assets/footer-bg.jpg" overlay={0.9} className="footer bg-cover">
      <div className="container">
        <FooterNewsletter />
        <div className="row footer-widgets">
          <div className="col-lg-4 col-sm-6 mb-5 mb-lg-0"><FooterAbout /></div>
          <div className="col-lg-2 col-sm-4 offset-sm-1 offset-lg-0"><FooterLinks title="Quick Links" links={quick} /></div>
          <div className="col-lg-3 ps-lg-5 col-sm-6"><FooterLinks title="Our Services" links={services} /></div>
          <div className="col-lg-3 col-sm-4 offset-sm-1 offset-lg-0"><OpeningHours /></div>
        </div>
      </div>
      <FooterBottom />
    </ParallaxSection>
  );
}
