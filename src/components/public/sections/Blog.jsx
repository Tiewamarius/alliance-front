import SectionIntro from '../common/SectionIntro';
import Button from '../common/Button';
import BlogFeatured from './BlogFeatured';
import BlogListItem from './BlogListItem';

const featured = { image: '/assets/f-blog.jpg', title: 'Offered Coverage Flexibility in logistic Exports & Imports' };
const list = [
  { image: '/assets/bl-s1.png', title: 'Offered Coverage Flexibility in logistic Exports & Imports' },
  { image: '/assets/bl-s2.png', title: 'The Advantages of a Digital Supply Strategy' },
  { image: '/assets/bl-s3.png', title: 'How To Get Hired In Supply Chain & Logistics?' },
];

export default function Blog() {
  return (
    <section className="blog-3 sec-padding">
      <div className="container">
        <div className="d-sm-flex align-items-start justify-content-between mb-5 mb-sm-0">
          <SectionIntro subtitle="News Highlight" title="Check Our Latest Blog Post" />
          <Button href="/blog" className="fadeInUp">View all Posts </Button>
        </div>
        <div className="row">
          <div className="col-lg-5"><BlogFeatured {...featured} /></div>
          <div className="col-lg-7">
            <div className="blog-list-wrap">
              {list.map((b) => <BlogListItem key={b.image} {...b} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
