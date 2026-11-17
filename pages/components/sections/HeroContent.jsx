import Button from '../common/Button';

export default function HeroContent() {
  return (
    <div className="hero-content">
      <span className="lead text-uppercase round">Plan, transport and finish</span>
      <h1 className="display-1 text-info fw-bold">Choose Your Next Big Step</h1>
      <p>Streamlining your logistics with transportation solutions, timely deliveries and exceptional service worldwide.</p>
      <div className="hero-cta d-sm-flex align-items-center">
        <Button href="/quote">Free Quote!</Button>
        <div className="d-flex align-items-center ms-sm-4">
          <img src="/assets/clients.png" alt="Clients" />
          <div className="stat-count d-flex gap-4 align-items-center">
            <span className="icon-lg bg-info fw-bold rounded-circle text-primary">2.5M</span>
            <h2 className="display-6 fw-bold text-info m-0">Order Complete</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
