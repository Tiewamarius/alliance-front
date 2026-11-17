import BlogMeta from './BlogMeta';

export default function BlogListItem({ image, title, href = '/single-post', ...meta }) {
  return (
    <article className="blog-list">
      <div className="blog-thumb"><a href={href}><img src={image} alt={title} className="rounded-4" /></a></div>
      <div className="blog-txt">
        <BlogMeta {...meta} />
        <h3 className="display-4"><a href={href}>{title}</a></h3>
      </div>
    </article>
  );
}
