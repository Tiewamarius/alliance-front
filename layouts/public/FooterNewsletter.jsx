export default function FooterNewsletter() {
  return (
    <div className="d-md-flex justify-content-between align-items-center footer-top">
      <div className="subs-head"><h2 className="display-4 text-white sec-title">Subscribe Our Newsletter</h2></div>
      <div className="subs-widget">
        <form className="position-relative" onSubmit={(e) => e.preventDefault()}>
          <input type="email" name="email" placeholder="Your Email" />
          <button className="btn btn-primary rounded-5">Subscribe <i className="fa fa-arrow-right" /><span /></button>
        </form>
      </div>
    </div>
  );
}
