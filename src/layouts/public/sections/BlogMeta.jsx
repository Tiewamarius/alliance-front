export default function BlogMeta({ author = 'Adam Smith', date = '07 Nov,2025' }) {
  return (
    <div className="blog-meta d-flex gap-4">
      <span><a href="#"><i className="fa-regular fa-user" />{author}</a></span>
      <span><a href="#"><i className="fa-regular fa-calendar" />{date}</a></span>
    </div>
  );
}
