import { useState } from "react";
import "./ImageGallery.scss";

interface ImageGalleryProps {
  images: string[];
}

function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <section className="image-gallery">
      <div className="carousel-container image-gallery__items">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
            data-index={index}
          />
        ))}
      </div>

      {/* Contador de imágenes - superior izquierda */}
      <div className="carousel-counter">
        <span>{currentIndex + 1}</span>
        <span>/</span>
        <span>{images.length}</span>
      </div>

      {/* Botones de navegación - solo desktop */}
      <button
        className="carousel-button prev"
        onClick={prevSlide}
        aria-label={`Previous image. Currently viewing image ${currentIndex + 1} of ${images.length}`}
      ></button>
      <button
        className="carousel-button next"
        onClick={nextSlide}
        aria-label={`Next image. Currently viewing image ${currentIndex + 1} of ${images.length}`}
      ></button>

      {/* <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div> */}
    </section>
  );
}

export default ImageGallery;
