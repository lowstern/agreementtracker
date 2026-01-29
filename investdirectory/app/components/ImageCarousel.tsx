'use client';

import { useState } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    { src: '/image (1).png', alt: 'Agreement Tracker Interface 1' },
    { src: '/image (2).png', alt: 'Agreement Tracker Interface 2' },
    { src: '/image (3).png', alt: 'Agreement Tracker Interface 3' },
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button className="carousel-button carousel-button-prev" onClick={goToPrevious} aria-label="Previous image">
          ‹
        </button>
        
        <div className="carousel-images">
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="carousel-image"
          />
        </div>
        
        <button className="carousel-button carousel-button-next" onClick={goToNext} aria-label="Next image">
          ›
        </button>
      </div>
      
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
