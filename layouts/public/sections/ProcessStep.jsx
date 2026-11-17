export default function ProcessStep({ count, icon, title, text }) {
  return (
    <div className="process-entry text-center">
      <span className="icon mx-auto rounded-circle">
        <span className="count">{count}</span>
        <img src={icon} alt="Icon" />
      </span>
      <h3 className="display-4">{title}</h3>
      <p>{text}</p>
    </div>
  );
}
