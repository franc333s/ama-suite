import "./HomeFeedCard.scss";
import { useRef, useEffect } from "react";
import type { HomeFeedCardProps } from "./HomeFeedCard.interface";

function HomeFeedCard({ item }: HomeFeedCardProps) {
  const image = item.image?.guid;
  const time = item.time ?? "";
  const imgRef = useRef<HTMLImageElement>(null);

  if (!image) return null;

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      const imageCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      const distance = Math.abs(imageCenterY - viewportCenterY);

      // Si está dentro de 200px del centro, calcular escala progresiva
      if (distance <= 200) {
        // Mantiene 1.1 entre -80px y +80px, luego desciende suavemente
        let scale = 1;
        if (distance <= 80) {
          scale = 1.1;
        } else {
          scale = 1.1 - 0.1 * ((distance - 80) / 120);
        }
        imgRef.current.style.transform = `scale(${scale})`;
      } else {
        imgRef.current.style.transform = "scale(1)";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Ejecutar al montar

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <article className="home-feed-card">
      {time && <p className="home-feed-card__time">{time}</p>}
      <img ref={imgRef} className="home-feed-card__img" src={image} alt="" />
      {time && <p className="home-feed-card__time">{time}</p>}
    </article>
  );
}

export default HomeFeedCard;
