export default function FooterBottom() {
  return (
    <div className="footer-bottom">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <p className="text-info copy-right mb-0 order-2 order-md-1">
            Copyright © {new Date().getFullYear()} <a href="/">Transhub</a> All Rights Reserved.
          </p>
          <nav className="footer-nav order-1 order-md-2">
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms &amp; Condition</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
