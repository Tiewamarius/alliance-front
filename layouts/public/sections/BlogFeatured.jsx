import BlogMeta from './BlogMeta';

export default function BlogFeatured({ image, title, href = '/single-post', ...meta }) {
  return (
    <article className="blog-entry3">
      <div className="entry-thumb"><a href={href}><img src={image} alt={title} /></a></div>
      <div className="blog-txt">
        <BlogMeta {...meta} />
        <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
          <h3 className="display-4"><a href={href}>{title}</a></h3>
          <a className="read-more icon border rounded-2" href={href}><i className="fa fa-arrow-right" /></a>
        </div>
      </div>
    </article>
  );
}
