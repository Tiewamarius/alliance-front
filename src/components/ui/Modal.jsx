import { useEffect } from "react";
import { X } from "lucide-react";

// Fenêtre modale : se ferme avec Échap ; le défilement de la page est bloqué
// tant qu'elle est ouverte.
export default function Modal({
    title,
    subtitle,
    onClose,
    children,
    size = "max-w-4xl",
    actions,
}) {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();
        };

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className={`flex max-h-[94vh] w-full ${size} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
            >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
                    </div>

                    {actions}

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}
