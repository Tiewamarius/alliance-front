import Button from './common/Button';

export default function NavCTA({ onSearch, onBurger }) {
  return (
    <div className="nav-cta d-none d-md-flex order-lg-3">
      <div className="d-flex align-items-center justify-content-between gap-4">
        <a className="icon-lg bg-light rounded-circle" href="#" onClick={(e) => { e.preventDefault(); onSearch?.(); }}>
          <i className="fa fa-search" />
        </a>
        <Button href="/donation">Free Quote </Button>
        <button className="burger-menu icon-lg bg-dark text-white rounded-circle" onClick={onBurger} aria-label="Open menu">
          <i className="fa fa-bars" />
        </button>
      </div>
    </div>
  );
}
