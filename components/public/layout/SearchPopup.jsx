export default function SearchPopup({ open, onClose, onSubmit }) {
  return (
    <div className={`search-popup offcanvas offcanvas-top ${open ? 'show' : ''}`} id="offcanvas-search">
      <div className="container d-flex flex-row py-5 align-items-center position-relative">
        <button type="button" className="btn-close bg-primary rounded-5" aria-label="Close" onClick={onClose} />
        <div className="col-lg-9 mx-auto">
          <form className="search-form w-100 mb-5" onSubmit={(e) => { e.preventDefault(); onSubmit?.(e.target.elements.q.value); }}>
            <input name="q" type="text" className="form-control shadow-1" placeholder="Type keyword and hit enter" />
          </form>
        </div>
      </div>
    </div>
  );
}
