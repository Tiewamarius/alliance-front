const defaults = ['facebook-f', 'x-twitter', 'instagram', 'linkedin-in'];

export default function SocialShare({ icons = defaults, prefix = 'fa-brands', label, className = '' }) {
  return (
    <div className={`social-share ${className}`}>
      {label && <span className="text-info d-none d-sm-inline">{label}</span>}
      {icons.map((icon) => (
        <a key={icon} href="#"><i className={`${prefix} fa-${icon}`} /></a>
      ))}
    </div>
  );
}
