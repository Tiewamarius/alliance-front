import SocialShare from '../common/SocialShare';

export default function FooterAbout() {
  return (
    <div className="footer-widget about-footer">
      <div className="f-logo"><a href="/"><img src="/assets/logo-w.svg" alt="Logo" /></a></div>
      <p>Our dedication lies in embracing challenges and pioneering innovation within the more attractive advertising sector.</p>
      <SocialShare prefix="fab" />
    </div>
  );
}
