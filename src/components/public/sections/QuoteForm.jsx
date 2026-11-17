import FormField from './FormField';

export default function QuoteForm({ onSubmit }) {
  const handle = (e) => {
    e.preventDefault();
    onSubmit?.(Object.fromEntries(new FormData(e.target)));
  };
  return (
    <div className="quote-form rounded-4 fadeInUp">
      <h3>Request Quote Form</h3>
      <form onSubmit={handle}>
        <div className="row">
          <FormField id="name" label="Full Name" placeholder="Full Name" />
          <FormField id="email" label="Email Address" type="email" placeholder="Email" />
          <FormField id="phone" label="Phone" placeholder="+554 6487 244" />
          <FormField id="city" label="Delivery City" placeholder="Select City" options={['New York', 'London', 'Dubai', 'Abidjan']} />
          <FormField id="ftype" label="Freight" placeholder="Select Freight" options={['Sea', 'Road', 'Air', 'Rail']} />
          <FormField id="weight" label="Weight" placeholder="Weight" />
          <div className="col-12">
            <button className="btn btn-primary">Submit Request <i className="fa fa-arrow-right" /><span /></button>
          </div>
        </div>
      </form>
    </div>
  );
}
