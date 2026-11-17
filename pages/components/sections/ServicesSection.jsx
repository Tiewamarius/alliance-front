
import { Link } from "react-router-dom";

import {
    FaShip,
    FaTruck,
    FaPlane,
    FaTrain,
    FaAnglesRight,
} from "react-icons/fa6";

const services = [
    {
        id: 1,
        title: "Transport maritime",
        image: "/assets/Solution1.jpg",
        icon: FaShip,
        description:
            "Boostez l'efficacité de votre entreprise",
        link: "/services/transport-maritime",
    },
    {
        id: 2,
        title: "Transport routier",
        image: "/assets/Solution1.jpg",
        icon: FaTruck,
        description:
            "Des solutions de transport routier fiables et flexibles pour assurer la livraison de vos marchandises dans les meilleurs délais.",
        link: "/services/transport-routier",
    },
    {
        id: 3,
        title: "Transport aérien",
        image: "/assets/Solution1.jpg",
        icon: FaPlane,
        description:
            "Accélérez vos expéditions avec nos solutions de fret aérien adaptées à vos marchandises urgentes et internationales.",
        link: "/services/transport-aerien",
    },
    {
        id: 4,
        title: "Transport ferroviaire",
        image: "/assets/Solution1.jpg",
        icon: FaTrain,
        description:
            "Optimisez vos opérations logistiques grâce à des solutions de transport ferroviaire économiques et efficaces.",
        link: "/services/transport-ferroviaire",
    },
];

export default function ServicesSection() {
    return (
        <section className="services-3 sec-padding overflow-hidden">
            <div className="container ct-container">

                {/* INTRODUCTION */}

                <div className="sec-intro mx-auto text-center">

                    <span className="sub-title fadeInUp">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="18"
                            fill="none"
                            viewBox="0 0 30 18"
                            aria-hidden="true"
                        >
                            <path
                                fill="#fd5523"
                                d="M8.125 15.429h-2.5a.62.62 0 0 1-.442-.189.65.65 0 0 1 0-.909.62.62 0 0 1 .442-.188h2.5c.166 0 .325.068.442.188a.65.65 0 0 1 0 .91.62.62 0 0 1-.442.188m20.313 0h-1.563a.62.62 0 0 1-.442-.189.65.65 0 0 1 0-.909.62.62 0 0 1 .442-.188h1.044l.842-4.618c-.011-2.364-1.973-4.382-4.386-4.382h-4.104l-1.989 9h3.593c.166 0 .325.068.442.188a.653.653 0 0 1 0 .91.62.62 0 0 1-.442.188H17.5a.61.61 0 0 1-.488-.242.65.65 0 0 1-.122-.543L19.162 4.36a.65.65 0 0 1 .22-.361.6.6 0 0 1 .39-.14h4.603C27.476 3.857 30 6.452 30 9.642l-.949 5.261a.65.65 0 0 1-.214.377.6.6 0 0 1-.4.148"
                            />

                            <path
                                fill="#fd5523"
                                d="M24.375 18c-1.722 0-3.125-1.441-3.125-3.214s1.403-3.215 3.125-3.215c1.723 0 3.125 1.442 3.125 3.215S26.098 18 24.375 18m0-5.143c-1.034 0-1.875.866-1.875 1.929s.841 1.928 1.875 1.928 1.875-.865 1.875-1.928-.841-1.929-1.875-1.929M10.625 18C8.903 18 7.5 16.559 7.5 14.786s1.403-3.215 3.125-3.215c1.723 0 3.125 1.442 3.125 3.215S12.348 18 10.625 18m0-5.143c-1.034 0-1.875.866-1.875 1.929s.841 1.928 1.875 1.928 1.875-.865 1.875-1.928c0-1.064-.841-1.929-1.875-1.929m-2.5-9h-5a.62.62 0 0 1-.442-.188.65.65 0 0 1 0-.91.62.62 0 0 1 .442-.188h5c.166 0 .325.068.442.189a.65.65 0 0 1 0 .909.62.62 0 0 1-.442.188m0 3.857h-6.25a.62.62 0 0 1-.442-.188.65.65 0 0 1 0-.91.62.62 0 0 1 .442-.187h6.25c.166 0 .325.067.442.188a.65.65 0 0 1 0 .909.62.62 0 0 1-.442.188m0 3.857h-7.5a.62.62 0 0 1-.442-.188.65.65 0 0 1 0-.909.62.62 0 0 1 .442-.188h7.5c.166 0 .325.067.442.188a.65.65 0 0 1 0 .91.62.62 0 0 1-.442.187"
                            />

                            <path
                                fill="#fd5523"
                                d="M17.5 15.429h-4.375a.62.62 0 0 1-.442-.189.65.65 0 0 1 0-.909.62.62 0 0 1 .442-.188H17l2.84-12.857H5.625a.62.62 0 0 1-.442-.189.65.65 0 0 1 0-.909A.62.62 0 0 1 5.625 0h15a.61.61 0 0 1 .488.241.65.65 0 0 1 .122.543L18.11 14.927a.65.65 0 0 1-.22.36.6.6 0 0 1-.39.142"
                            />
                        </svg>

                        Nos solutions
                    </span>

                    <h2 className="sec-title">
                        Boostez l'efficacité de votre entreprise
                        {/* <br /> */}
                        {/* pour développer votre activité */}
                    </h2>

                </div>

                {/* CARTES DES SERVICES */}

                <div className="row">

                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <div
                                className="col-xl-3 col-md-6"
                                key={service.id}
                            >
                                <div
                                    className="service-entry bg-cover round"
                                    style={{
                                        backgroundImage: `url("${service.image}")`,
                                    }}
                                >

                                    <div className="serv-txt rounded-4">

                                        <div className="serv-heading">

                                            <span className="serv-icon">
                                                <Icon />
                                            </span>

                                            <div className="d-flex align-items-center justify-content-between serv-title">

                                                <h3 className="display-4">
                                                    <Link to={service.link}>
                                                        {service.title}
                                                    </Link>
                                                </h3>

                                                <span>
                                                    <FaAnglesRight />
                                                </span>

                                            </div>

                                        </div>

                                        <p>
                                            {service.description}
                                        </p>

                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}
