export default function Rating({ value = 4.5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="ratings">
      {Array.from({ length: full }).map((_, i) => (
        <a key={i} href="#"><i className="fa fa-star" /></a>
      ))}
      {half && <a href="#"><i className="fa fa-star-half" /></a>}
    </div>
  );
}
