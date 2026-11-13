export default function FormField({ id, label, type = 'text', placeholder, options, col = 'col-lg-6' }) {
  return (
    <div className={`${col} form-group`}>
      <label htmlFor={id}>{label}</label>
      {options ? (
        <select id={id} name={id} defaultValue="">
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} name={id} type={type} placeholder={placeholder} />
      )}
    </div>
  );
}
