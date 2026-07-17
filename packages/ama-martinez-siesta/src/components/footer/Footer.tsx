import Ensonaciones from "../../assets/img/ensonaciones.png";
import type { FooterProps } from "./Footer.interface";
import "./Footer.scss";

function Footer({ className = "" }: FooterProps) {
  return (
    <div className={`footer ${className}`.trim()}>
      <img className="footer__img" src={Ensonaciones} alt="" />

      <div className="footer__r1">
        <a className="p-main block" href="mailto:info@martinezsiesta.com">
          info@martinezsiesta.com
        </a>
        <a className="p-main block" href="tel:+34634408383">
          (+34) 634 40 83 83
        </a>
      </div>
      <div className="footer__r2">
        <p>Valencia, 46019</p>
        <a className="p-main" href="#">
          Google Maps
        </a>
      </div>
      <div className="footer__r3">
        <p>All rights reserved. &copy; Martínez Siesta, 2025</p>
        <a className="p-main block" href="#">
          Legal advice
        </a>
      </div>
    </div>
  );
}

export default Footer;
