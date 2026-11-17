export default function ServiceCard({ title, text, image, icon, href = '/single-service' }) {
  return (
    <div className="service-entry bg-cover round" style={{ backgroundImage: `url(${image})` }}>
      <div className="serv-txt rounded-4">
        <div className="serv-heading">
          <span className="serv-icon"><img src={icon} alt="icon" /></span>
          <div className="d-flex align-items-center justify-content-between serv-title">
            <h3 className="display-4"><a href={href}>{title}</a></h3>
            <span><i className="fa-solid fa-angles-right" /></span>
          </div>
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
}
