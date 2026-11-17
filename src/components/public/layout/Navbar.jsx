import { useState } from 'react';
import NavMenu from './NavMenu';
import NavCTA from './NavCTA';

export default function Navbar({ onSearch, onBurger }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="header-nav-wrapper header-sticky">
      <nav className="navbar navbar-expand-xl">
        <div className="container ct-container">
          <a className="navbar-brand" href="/"><img src="/assets/logo.svg" alt="logo" className="img-fluid" /></a>
          <button className="navbar-toggler offcanvas-nav-btn" type="button" onClick={() => setOpen(true)}>
            Menu <i className="fa fa-bars" />
          </button>
          <NavCTA onSearch={onSearch} onBurger={onBurger} />
          <div className={`offcanvas offcanvas-start offcanvas-nav ${open ? 'show' : ''}`}>
            <div className="offcanvas-header">
              <a href="/"><img src="/assets/logo.svg" alt="Logo" /></a>
              <button type="button" className="btn-close bg-primary" aria-label="Close" onClick={() => setOpen(false)} />
            </div>
            <div className="offcanvas-body pt-0 align-items-center justify-content-between">
              <NavMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
