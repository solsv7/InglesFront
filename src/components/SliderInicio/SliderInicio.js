import React, { useEffect, useRef, useState } from 'react';

const Slider = ({ images }) => {
  const [current, setCurrent] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const sliderRef = useRef();

  // Clona el último y el primero para el efecto infinito
  const imagesWithClones = [images[images.length - 1], ...images, images[0]];

  // Resetea el índice si cambian las imágenes
  useEffect(() => {
    setCurrent(1);
    setIsAnimating(true);
  }, [images]);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setIsAnimating(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [imagesWithClones.length]);

  // Efecto infinito
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (current === imagesWithClones.length - 1) {
        setIsAnimating(false);
        setCurrent(1);
      } else if (current === 0) {
        setIsAnimating(false);
        setCurrent(imagesWithClones.length - 2);
      }
    };
    const slider = sliderRef.current;
    slider.addEventListener('transitionend', handleTransitionEnd);
    return () => slider.removeEventListener('transitionend', handleTransitionEnd);
  }, [current, imagesWithClones.length]);

  // Si no está animando, quita la transición solo un frame
  useEffect(() => {
    if (!isAnimating) {
      const id = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(id);
    }
  }, [isAnimating]);

  return (
    <div className="slider-inicio">
      <div className="slider-wrapper">
        <div
          className="slider-track"
          ref={sliderRef}
          style={{
            transform: `translateX(-${current * (100 / imagesWithClones.length)}%)`,
            transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none',
            width: `${imagesWithClones.length * 100}%`,
          }}
        >
          {imagesWithClones.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`slide-${index}`}
              style={{ width: `${100 / imagesWithClones.length}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;