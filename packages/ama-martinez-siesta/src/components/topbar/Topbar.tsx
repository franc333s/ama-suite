import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // o tu router

import "./Topbar.scss";

import Button from "../button/Button";

interface TopbarProps {
  isHome?: boolean;
}

function Topbar({ isHome = false }: TopbarProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // limpiar al desmontar
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleContact = () => {
    setIsMenuOpen(false); // Cerrar menú en mobile
    setIsContactOpen((prev) => !prev);
  };

  const closeContact = () => {
    setIsContactOpen(false);
  };

  const shouldShowMenu: boolean = isDesktop || isMenuOpen;

  // Detectar si estamos en /projects y si es mobile (< 768px)
  const isProjectsPage = /^\/projects(\/|$)/.test(location.pathname);
  const shouldRenderProjectsList = !isProjectsPage || isTablet;

  // En la página interna de proyecto (/project/:slug) ocultamos projects y cta
  // solo en desktop; en mobile se muestran con normalidad.
  const isProjectDetailPage = /^\/project\/[^/]+/.test(location.pathname);
  const hideOnProjectDetailDesktop = isProjectDetailPage && isDesktop;

  return (
    <>
      <nav
        role="navigation"
        className={`${isMenuOpen ? "topbar open" : "topbar"} ${isHome ? "topbar--home" : ""}`}
      >
        <p>
          <Link className="topbar__logo" to="/">
            martínez siesta
          </Link>
        </p>

        {!isDesktop && (
          <Button
            className="topbar__menu-btn"
            label={isMenuOpen ? "Close" : "Menu"}
            onClick={toggleMenu}
          />
        )}

        {/* Solo renderiza si NO estamos en projects page en mobile */}
        {shouldRenderProjectsList && (
          <ul
            className={`topbar__projects ${shouldShowMenu && !hideOnProjectDetailDesktop ? "" : "hidden"}`}
          >
            <li>
              <Link className="topbar__projects__link" to="/projects">
                <span></span>
                <span>(&nbsp;&nbsp;)</span>
                <span>All Projects</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/graphic-design"
              >
                <span>09 AM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Graphic Design</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/art-direction"
              >
                <span>10 AM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Art Direction</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/photography"
              >
                <span>11 AM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Photography</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/video"
              >
                <span>12 AM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Video</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/branding"
              >
                <span>01 PM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Branding</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/social-media"
              >
                <span>02 PM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Social Media</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/siesta"
              >
                <span>03 PM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Siesta</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/set-design"
              >
                <span>04 PM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Set Design</span>
              </Link>
            </li>
            <li>
              <Link
                className="topbar__projects__link"
                to="/projects/stants"
              >
                <span>05 PM</span>
                <span>(&nbsp;&nbsp;)</span>
                <span>Stants</span>
              </Link>
            </li>
          </ul>
        )}

        <div
          className={`topbar__cta ${shouldShowMenu && !hideOnProjectDetailDesktop ? "" : "hidden"}`}
        >
          <p>
            <Button
              className="topbar__link"
              label="Contact"
              onClick={toggleContact}
            />
          </p>
          <p>
            <a className="topbar__link uppercase" href="/subscribe">
              Subscribe
            </a>
          </p>
          <p>
            <a
              className="topbar__link uppercase"
              href="http://www.instagram.com/mostradorgallery"
            >
              Instagram
            </a>
          </p>
        </div>

        <div className={`topbar__details ${shouldShowMenu ? "" : "hidden"}`}>
          <div>
            <p>
              <a
                className="topbar__link "
                href="mailto:info@nartinezsiesta.com"
              >
                info@nartinezsiesta.com
              </a>
            </p>
            <p>
              <a className="topbar__link" href="tel:+34634408383">
                (+34) 634 40 83 83
              </a>
            </p>
          </div>
          <div>
            <p className="topbar__link">Valencia, 46019</p>
            <p>
              <a className="topbar__link" href="">
                Google Maps
              </a>
            </p>
          </div>
          <div>
            <p className="topbar__link">
              All rights reserved. &copy; Martínez Siesta, 2025
            </p>
            <p>
              <a className="topbar__link" href="">
                Legal advice
              </a>
            </p>
          </div>
        </div>
      </nav>

      {isContactOpen && (
        <div className="contact-modal-overlay" onClick={closeContact}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal__front">
              <p className="contact-modal__logo">martinez siesta</p>
              <p className="contact-modal__text">[ No meetings at 3 p.m. ]</p>
            </div>
            <div className="contact-modal__back">
              <a href="tel:+34639408383" className="contact-modal__text">
                (+34) 639 40 83 83
              </a>
              <div>
                <a href="mailto:info@martinezsiesta.com">
                  info@martinezsiesta.com
                </a>
                <p className="contact-modal__text">
                  Graphic design and Art direction
                </p>
                <p className="contact-modal__text">
                  [ Open for collaborations ]
                </p>
                <a href="https://www.martinezsiesta.com">martinezsiesta.com</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;
