export default function QuickCall({ phone = '148 359 505 285', iconClass = 'bg-dark text-info', linkClass = 'h6 text-primary', className = '' }) {
  return (
    <div className={`quick-call d-flex align-items-center ${className}`}>
      <span className={`${iconClass} icon-lg rounded-circle`}>
        <i className="fa-solid fa-phone-volume" />
      </span>
      <div className="conn-txt ms-3">
        <p className="m-0">Call Us Any Time:</p>
        <a className={linkClass} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
      </div>
    </div>
  );
}
