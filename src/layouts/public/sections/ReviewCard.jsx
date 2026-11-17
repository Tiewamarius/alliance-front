import Rating from '../common/Rating';

export default function ReviewCard({ text, name, role, avatar, rating = 4.5 }) {
  return (
    <div className="review-entry">
      <div className="rev-content position-relative bg-white rounded-4">
        <p>"{text}"</p>
        <Rating value={rating} />
        <div className="rev-icon icon bg-primary position-absolute">
          <i className="fa-solid fa-quote-left text-white" />
        </div>
      </div>
      <div className="rev-author d-flex align-items-center">
        <div className="author-thumb icon me-3"><img src={avatar} alt={name} /></div>
        <div className="author-info">
          <h3 className="mb-0 display-5">{name}</h3>
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
}
