export default function PlaceholderPage({
    title,
    description = "Cette fonctionnalité sera connectée à l’API Alliance Transit.",
}) {
    return (
        <section className="content-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">ALLIANCE TRANSIT</p>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>

            <div className="content-card">
                <h2>{title}</h2>
                <p>
                    L’espace est initialisé. Les données seront affichées ici
                    dès que le service API correspondant sera connecté.
                </p>
            </div>
        </section>
    );
}