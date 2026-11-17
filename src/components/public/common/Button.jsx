export default function Button({ href = '#', variant = 'primary', size = '', arrow = true, className = '', children }) {
  return (
    <a className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} href={href}>
      {children}
      {arrow && <i className="fa fa-arrow-right" />}
      <span />
    </a>
  );
}
