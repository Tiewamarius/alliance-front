export default function SolutionCard({ icon, title, text = 'Save money by optimizing your shipments.' }) {
  return (
    <div className="solution-card" style={{ backgroundImage: 'url(/assets/solution-card-bg.png)' }}>
      <div className="sol-icon">{icon}</div>
      <h3 className="display-4">{title}</h3>
      <p>{text}</p>
    </div>
  );
}
