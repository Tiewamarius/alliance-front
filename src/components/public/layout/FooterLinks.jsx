export default function FooterLinks({ title, links, className = '' }) {
  return (
    <div className={`footer-widget ${className}`}>
      <h3 className="widget-title">{title}</h3>
      <ul>
        {links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
  );
}
