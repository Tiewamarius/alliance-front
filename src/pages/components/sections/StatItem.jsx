import Counter from '../common/Counter';

export default function StatItem({ end, suffix = '', label }) {
  return (
    <div className="s-item">
      <h3 className="display-1 fw-bold"><Counter end={end} suffix={suffix} /></h3>
      <p>{label}</p>
    </div>
  );
}
