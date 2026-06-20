"use client";

import { useEffect, useRef } from "react";

export default function NoiseBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      ref.current.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div ref={ref} className="noise-bg absolute inset-0 z-0" />;
}
