export default function NavDropdown({ label, items }) {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" role="button" aria-expanded="false" href="#">{label}</a>
      <ul className="dropdown-menu">
        {items.map((item) =>
          item.children ? (
            <li key={item.label} className="dropdown-submenu dropend">
              <a className="dropdown-item dropdown-toggle" aria-expanded="false" href="#">{item.label}</a>
              <ul className="dropdown-menu">
                {item.header && <li className="dropdown-header">{item.header}</li>}
                {item.children.map((c) => (
                  <li key={c.label}><a className="dropdown-item" href={c.href}>{c.label}</a></li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={item.label} className={item.current ? 'current' : ''}>
              <a className="dropdown-item" href={item.href}>
                {item.label}
                {item.badge && <span className="badge bg-dark ms-2">{item.badge}</span>}
              </a>
            </li>
          )
        )}
      </ul>
    </li>
  );
}
