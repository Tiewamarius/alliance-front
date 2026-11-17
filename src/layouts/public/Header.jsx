
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

import {
    FaBars,
    FaXmark,
    FaMagnifyingGlass,
    FaArrowRight,
    FaLocationDot,
    FaXTwitter,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaPhone,
    FaEnvelope,
    FaUser,
} from "react-icons/fa6";

const menuItems = [
    { key: "home", to: "/" },
    { key: "services", to: "/services" },
    // { key: "agencies", to: "/agences" },
    { key: "tracking", to: "/suivi" },
    { key: "about", to: "/a-propos" },
    { key: "contact", to: "/contact" },
];

const LOGO = "/assets/Logonew.jpg";

const PHONE = "+225 07 00 00 00 00";
const PHONE_LINK = "+2250700000000";
const EMAIL = "contact@alliancetransit.com";

export default function Header() {
    const { t } = useTranslation();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Changement de langue
    const changeLanguage = async (language) => {
        try {
            await i18n.changeLanguage(language);
            localStorage.setItem("alliance_language", language);
        } catch (error) {
            console.error(
                "Erreur lors du changement de langue :",
                error
            );
        }
    };

    // Fermeture du panneau latéral
    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    // Ouverture du panneau latéral
    const openDrawer = () => {
        setDrawerOpen(true);
    };

    // Gestion du scroll de la page
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Fermeture avec Échap et blocage du scroll derrière le panneau
    useEffect(() => {
        if (!drawerOpen) return;

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeDrawer();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [drawerOpen]);

    // Liens de navigation
    const renderMenuItem = (item) => (
        <li className="nav-item" key={item.to}>
            <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeDrawer}
            >
                {t(`header.menu.${item.key}`)}
            </NavLink>
        </li>
    );

    return (
        <header className="header header-3 alliance-header">
            <div className="sticky-height" />

            <div className="header-wrapper">

                {/* ================= TOPBAR ================= */}

                <div className="header-top bg-primary">
                    <div className="container ct-container">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="header-infos">
                                <ul className="d-none d-xl-flex flex-wrap align-items-center gap-4">

                                    <li className="d-flex align-items-center gap-2">
                                        <FaPhone size={14} />
                                        <a href={`tel:${PHONE_LINK}`}>
                                            {t("header.contact.phone")}
                                        </a>
                                    </li>

                                    <li className="d-flex align-items-center gap-2">
                                        <FaEnvelope size={14} />
                                        <a href={`mailto:${EMAIL}`}>
                                            {t("header.contact.email")}
                                        </a>
                                    </li>

                                    <li className="d-flex align-items-center gap-2">
                                        <FaLocationDot size={14} />
                                        <span>
                                            {t("header.contact.location")}
                                        </span>
                                    </li>

                                </ul>
                            </div>

                            {/* Réseaux sociaux */}

                            <div className="social-share ms-auto d-flex align-items-center gap-3">
                                <span className="text-info d-none d-sm-inline">
                                    {t("header.followUs")}
                                </span>

                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaFacebookF />
                                </a>

                                <a
                                    href="#"
                                    aria-label="X"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaXTwitter />
                                </a>

                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaInstagram />
                                </a>

                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaLinkedinIn />
                                </a>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ================= NAVBAR ================= */}

                <div
                    className={`header-nav-wrapper header-sticky ${
                        scrolled ? "scroll-on" : ""
                    }`}
                >
                    <nav className="navbar navbar-expand-xl">
                        <div className="container ct-container">

                            {/* LOGO */}

                            <Link
                                className="navbar-brand"
                                to="/"
                                onClick={closeDrawer}
                            >
                                <img
                                    src={LOGO}
                                    width={80}
                                    alt="Alliance Transit"
                                    className="img-fluid"
                                />
                            </Link>

                            {/* NAVIGATION DESKTOP */}

                            <div className="alliance-desktop-nav d-none d-xl-flex">
                                <ul className="navbar-nav align-items-center">
                                    {menuItems.map(renderMenuItem)}
                                </ul>
                            </div>

                            {/* ACTIONS À DROITE */}

                            <div className="nav-cta alliance-header-actions ms-auto">
                                <div className="d-flex align-items-center gap-3">

                                    {/* Sélecteur de langue */}

                                    <div
                                        className="alliance-language-switch"
                                        aria-label="Choisir la langue"
                                    >
                                        <button
                                            type="button"
                                            className={
                                                i18n.language.startsWith("fr")
                                                    ? "active"
                                                    : ""
                                            }
                                            aria-pressed={i18n.language.startsWith("fr")}
                                            onClick={() => changeLanguage("fr")}
                                        >
                                            FR
                                        </button>

                                        <span>|</span>

                                        <button
                                            type="button"
                                            className={
                                                i18n.language.startsWith("en")
                                                    ? "active"
                                                    : ""
                                            }
                                            aria-pressed={i18n.language.startsWith("en")}
                                            onClick={() => changeLanguage("en")}
                                        >
                                            EN
                                        </button>
                                    </div>

                                    {/* Recherche */}

                                    <button
                                        type="button"
                                        className="icon-lg bg-light rounded-circle alliance-search-btn d-none d-md-flex"
                                        aria-label={t("header.search")}
                                        onClick={() => {
                                            // À relier à la recherche du site.
                                        }}
                                    >
                                        <FaMagnifyingGlass />
                                    </button>

                                    {/* Demande de devis */}

                                    <Link
                                        className="btn btn-primary btn-hover alliance-quote-btn d-none d-md-inline-flex"
                                        to="/devis"
                                    >
                                        {t("header.requestQuote")}
                                        {/* <FaArrowRight className="ms-2" /> */}
                                    </Link>

                                    {/* Bouton menu latéral */}

                                    <button
                                        type="button"
                                        className="burger-menu icon-lg bg-dark text-white rounded-circle alliance-right-menu-btn"
                                        aria-label={t("header.openMenu")}
                                        aria-expanded={drawerOpen}
                                        aria-controls="alliance-right-drawer"
                                        onClick={openDrawer}
                                    >
                                        <FaBars />
                                    </button>

                                </div>
                            </div>

                        </div>
                    </nav>
                </div>
            </div>

            {/* ================= OVERLAY ================= */}

            <div
                className={`alliance-drawer-overlay ${
                    drawerOpen ? "is-visible" : ""
                }`}
                onClick={closeDrawer}
                aria-hidden="true"
            />

            {/* ================= PANNEAU LATÉRAL DROIT ================= */}

            <aside
                id="alliance-right-drawer"
                className={`alliance-right-drawer ${
                    drawerOpen ? "is-open" : ""
                }`}
                aria-hidden={!drawerOpen}
            >
                {/* EN-TÊTE */}

                <div className="alliance-drawer-header">

                    <Link to="/" onClick={closeDrawer}>
                        <img
                            src={LOGO}
                            alt="Alliance Transit"
                            className="alliance-drawer-logo"
                        />
                    </Link>

                    <button
                        type="button"
                        className="alliance-drawer-close"
                        onClick={closeDrawer}
                        aria-label={t("header.closeMenu")}
                    >
                        <FaXmark />
                    </button>

                </div>

                {/* CONTENU */}

                <div className="alliance-drawer-content">

                    {/* <p className="alliance-drawer-subtitle">
                        {t("header.navigation")}
                    </p> */}

                    {/* LIENS DE NAVIGATION */}

                    <ul className="alliance-drawer-nav">
                        {menuItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.to === "/"}
                                    onClick={closeDrawer}
                                    className={({ isActive }) =>
                                        isActive ? "active" : ""
                                    }
                                >
                                    <span>
                                        {t(`header.menu.${item.key}`)}
                                    </span>

                                    <FaArrowRight />
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* ACTIONS */}

                    <div className="alliance-drawer-actions">

                        <Link
                            to="/connexion"
                            className="alliance-account-btn"
                            onClick={closeDrawer}
                        >
                            <FaUser />

                            <span>
                                {t("header.myAccount")}
                            </span>

                            <FaArrowRight className="ms-auto" />
                        </Link>

                        <Link
                            to="/devis"
                            className="alliance-drawer-quote"
                            onClick={closeDrawer}
                        >
                            {t("header.requestQuote")}
                            <FaArrowRight />
                        </Link>

                    </div>

                    {/* CONTACT */}

                    <div className="alliance-drawer-contact">

                        <h5>
                            {t("header.contactUs")}
                        </h5>

                        <a href={`tel:${PHONE_LINK}`}>
                            <FaPhone />
                            <span>{PHONE}</span>
                        </a>

                        <a href={`mailto:${EMAIL}`}>
                            <FaEnvelope />
                            <span>{EMAIL}</span>
                        </a>

                        <p>
                            <FaLocationDot />
                            <span>
                                {t("header.contact.location")}
                            </span>
                        </p>

                    </div>

                    {/* RÉSEAUX SOCIAUX */}

                    <div className="alliance-drawer-social">

                        <a href="#" aria-label="Facebook">
                            <FaFacebookF />
                        </a>

                        <a href="#" aria-label="X">
                            <FaXTwitter />
                        </a>

                        <a href="#" aria-label="Instagram">
                            <FaInstagram />
                        </a>

                        <a href="#" aria-label="LinkedIn">
                            <FaLinkedinIn />
                        </a>

                    </div>

                </div>
            </aside>
        </header>
    );
}
