export default function ProjectCard({ image, title, category = 'Transport', href = '/single-casestudy' }) {
  return (
    <div className="pt-item">
      <img className="img-fluid" src={image} alt={title} />
      <div className="pt-hover">
        <div className="pt-inner">
          <a className="icon-lg bg-dark text-info rounded-2" href={href}><i className="fa fa-arrow-right" /></a>
          <div className="pt-footer">
            <span className="cat-meta text-info"><a className="text-reset" href="#">{category}</a></span>
            <h3 className="display-4 text-info"><a className="text-reset" href={href}>{title}</a></h3>
          </div>
        </div>
      </div>
    </div>
  );
}
