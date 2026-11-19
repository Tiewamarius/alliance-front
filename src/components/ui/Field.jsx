// Libellé + champ de formulaire.
export default function Field({ label, required = false, children, className = "" }) {
    return (
        <label className={`block space-y-1.5 ${className}`}>
            <span className="text-sm font-medium text-slate-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </span>
            {children}
        </label>
    );
}
