import "./CookieConsent.scss";
import { useCookieConsent } from "../../hooks/useCookieConsent";

function CookieConsent() {
  const { showBanner, acceptAll, rejectNonEssential } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__container">
        <div className="cookie-consent__content">
          <h3 className="cookie-consent__title">Gestión de cookies</h3>
          <p className="cookie-consent__description">
            Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Las
            cookies esenciales son necesarias para el funcionamiento del sitio.
            Además, utilizamos cookies de analytics para entender cómo
            interactúas con nosotros y cookies de newsletter para mantener una
            comunicación personalizada.
          </p>
          <div className="cookie-consent__categories">
            <div className="cookie-consent__category">
              <span className="cookie-consent__category-name">Esenciales</span>
              <span className="cookie-consent__category-badge">
                Obligatorio
              </span>
            </div>
            <div className="cookie-consent__category">
              <span className="cookie-consent__category-name">Analytics</span>
            </div>
            <div className="cookie-consent__category">
              <span className="cookie-consent__category-name">Newsletter</span>
            </div>
          </div>
        </div>

        <div className="cookie-consent__actions">
          <button
            className="cookie-consent__button cookie-consent__button--secondary"
            onClick={rejectNonEssential}
          >
            Rechazar no esenciales
          </button>
          <button
            className="cookie-consent__button cookie-consent__button--primary"
            onClick={acceptAll}
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
