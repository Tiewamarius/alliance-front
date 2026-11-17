export default function MarqueeItem({ label, icon = '/assets/marquee-star.png' }) {
  return (
    <div className="text-item">
      <img src={icon} alt="" />
      <h3 className="display-1">{label}</h3>
    </div>
  );
}
