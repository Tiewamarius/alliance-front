import Button from '../common/Button';
import SocialShare from '../common/SocialShare';

const services = ['Air Fright', 'Warehousing', 'Sea Fright', 'Road Fright', 'Customs Brokerage'];

export default function CanvasMenu({ open, onClose }) {
  return (
    <div className={`canvas-menu d-flex flex-column ${open ? 'open' : ''}`}>
      <div className="d-flex justify-content-between w-100 mb-4">
        <div className="logo"><img src="/assets/logo.svg" alt="Logo" /></div>
        <button type="button" className="canvas-close" aria-label="Close" onClick={onClose}>
          <i className="fa fa-xmark" />
        </button>
      </div>
      <p>We are a reliable transport agency providing safe and timely logistics solutions. Our services cover local and long-distance transportation needs.</p>
      <div className="mt-3">
        <h5>Our Services</h5>
        <nav className="mt-4">
          <ul className="vertical-menu">
            {services.map((s) => <li key={s}><a href="/single-service">{s}</a></li>)}
          </ul>
        </nav>
      </div>
      <SocialShare className="mt-3" prefix="fab" icons={['facebook-f', 'x-twitter', 'instagram', 'pinterest', 'linkedin-in', 'youtube']} />
      <Button href="/quote" className="mt-5">Get a Quote </Button>
    </div>
  );
}
