import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const services = [
    {
      icon: Package,
      title: "Transport de colis",
      description:
        "Expédiez vos colis et marchandises avec un suivi adapté à vos besoins.",
    },
    {
      icon: Truck,
      title: "Livraison",
      description:
        "Suivez le parcours de vos expéditions jusqu'à leur livraison.",
    },
    {
      icon: Globe,
      title: "Réseau d'agences",
      description:
        "Retrouvez nos agences pour faciliter vos opérations de transport.",
    },
  ];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">ALLIANCE TRANSIT</p>

          <h1>
            Vos expéditions,
            <br />
            notre engagement.
          </h1>

          <p className="home-hero-description">
            Une solution de transport et de logistique pour gérer vos colis,
            vos expéditions et vos livraisons en toute simplicité.
          </p>

          <div className="home-hero-actions">
            <Link to="/suivi" className="btn btn-primary">
              Suivre un colis
              <ArrowRight size={18} />
            </Link>

            <Link to="/connexion" className="btn btn-secondary">
              Accéder à mon compte
            </Link>
          </div>

          <div className="home-trust-items">
            <span>
              <ShieldCheck size={18} />
              Suivi des expéditions
            </span>
            <span>
              <MapPin size={18} />
              Services logistiques
            </span>
          </div>
        </div>

        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-visual-card">
            <div className="home-visual-icon">
              <Package size={42} />
            </div>
            <p className="home-visual-label">ALLIANCE TRANSIT</p>
            <h2>Le transport simplifié</h2>
            <p>De l'expédition à la livraison.</p>
            <div className="home-visual-line" />
            <div className="home-visual-route">
              <MapPin size={20} />
              <span>Votre colis en mouvement</span>
              <Truck size={24} />
            </div>
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="page-heading">
          <div>
            <p className="eyebrow">NOS SOLUTIONS</p>
            <h2>Des services adaptés à vos besoins</h2>
            <p>
              Retrouvez les principales fonctionnalités d'Alliance Transit.
            </p>
          </div>
        </div>

        <div className="home-services-grid">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article className="home-service-card" key={service.title}>
                <div className="home-service-icon">
                  <Icon size={28} />
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <Link to="/services" className="home-service-link">
                  En savoir plus <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="eyebrow">ESPACE CLIENT</p>
          <h2>Gérez vos expéditions depuis un seul espace.</h2>
          <p>
            Connectez-vous pour retrouver les fonctionnalités disponibles
            selon votre compte.
          </p>
        </div>

        <Link to="/connexion" className="btn btn-primary">
          Se connecter <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}