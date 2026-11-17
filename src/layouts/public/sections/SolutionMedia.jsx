export default function SolutionMedia({ onPlay }) {
  return (
    <div className="sol-box">
      <div className="sol-media d-flex gap-5">
        <img src="/assets/sol1.jpg" alt="Solution" className="img-fluid round" />
        <img src="/assets/sol2.jpg" alt="Solution" className="img-fluid round" />
      </div>
      <a href="#" className="video-play-btn bg-info rounded-circle text-primary icon" onClick={(e) => { e.preventDefault(); onPlay?.(); }}>
        <span><i className="fa fa-play" /></span>
      </a>
    </div>
  );
}
