import ParallaxSection from '../common/ParallaxSection';
import HeroContent from './HeroContent';


import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="jarallax hero-3">
            {/* OVERLAY */}
            <div
                className="jarallax-overlay"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgb(0, 0, 0)",
                    opacity: 0.8,
                    zIndex: 0,
                }}
            />

            <div
                className="jarallax-content"
                style={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div className="container ct-container">
                    <div className="row align-items-center">

                        {/* TEXTE À GAUCHE */}
                        <div className="col-lg-4">
                            <div>
                                <div className="hero-content">

                                    <span className="lead text-uppercase round">
                                        Plan, transport and finish
                                    </span>

                                    <h3 className="display-1 text-info fw-bold">
                                        Choisissez votre prochaine grande étape
                                    </h3>

                                    <p>
                                        Streamlining your logistics with
                                        transportation solutions, timely
                                        deliveries and exceptional service
                                        worldwide.
                                    </p>

                                    {/* BOUTON ET STATISTIQUES */}
                                    <div className="hero-cta d-sm-flex align-items-center">

                                        <Link
                                            className="btn btn-primary"
                                            to="/devis"
                                        >
                                            Free Quote!
                                            <i className="fa fa-arrow-right ms-2" />
                                        </Link>

                                        <div className="d-flex align-items-center ms-sm-4">
                                            <img
                                                src="/assets/clients-CpZ9oRtL.png"
                                                alt="Nos clients"
                                            />

                                            <div className="stat-count d-flex gap-4 align-items-center">
                                                <span className="icon-lg bg-info fw-bold rounded-circle text-primary">
                                                    2.5M
                                                </span>

                                                <h2 className="display-6 fw-bold text-info m-0">
                                                    Orders Completed
                                                </h2>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IMAGE À DROITE */}
                        <div className="col-lg-8">
                            <div>
                                <div className="hero-media">
                                    <img
                                        src="./assets/hero2.png"
                                        className="img-fluid"
                                        alt="Solutions de transport et logistique"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* IMAGE DE FOND */}
            <div
                className="jarallax-container"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    zIndex: -100,
                    clipPath: "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)",
                }}
            >
                <img src="./assets/hero1.jpg"
                    alt=""
                    aria-hidden="true"
                    style={{
                        objectFit: "cover",
                        objectPosition: "50% 50%",
                        maxWidth: "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        pointerEvents: "none",
                    }}
                />
            </div>
        </section>
    );
}

