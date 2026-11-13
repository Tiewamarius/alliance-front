import Button from '../common/Button';

const hours = [['Week Days', '09.00 - 7.00'], ['Saturday', '08.00 - 2.00'], ['Sunday', 'Day Off']];

export default function OpeningHours() {
  return (
    <div className="footer-widget contact-widget">
      <h3 className="widget-title">Opening Hours</h3>
      <div className="opening-inner">
        {hours.map(([day, time]) => (
          <div key={day} className="d-flex align-items-center justify-content-between mb-3">
            <span>{day}</span><span>{time}</span>
          </div>
        ))}
      </div>
      <Button href="/contact" variant="info" size="xs" className="mt-4" arrow={false}>Contact Us </Button>
    </div>
  );
}
