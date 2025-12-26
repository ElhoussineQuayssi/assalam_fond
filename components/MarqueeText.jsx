import { useRef } from 'react';
import { gsap } from 'gsap';

const MarqueeText = ({ text, className = '' }) => {
  const textRef = useRef(null);
  const animationRef = useRef(null);

  const handleMouseEnter = () => {
    const element = textRef.current;
    if (element && element.scrollWidth > element.clientWidth) {
      const distance = element.scrollWidth - element.clientWidth;
      animationRef.current = gsap.to(element, {
        x: -distance,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.kill();
      gsap.to(textRef.current, { x: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  return (
    <div className="overflow-hidden">
      <p
        ref={textRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`whitespace-nowrap ${className}`}
      >
        {text}
      </p>
    </div>
  );
};

export default MarqueeText;