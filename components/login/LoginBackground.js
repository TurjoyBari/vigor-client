"use client";

import { useEffect, useRef } from "react";

export default function LoginBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const blobs = container.querySelectorAll(".bg-blob");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      blobs.forEach((blob) => {
        const speed = Number(blob.getAttribute("data-speed")) || 20;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30 overflow-hidden"
    >
      <div
        className="bg-blob absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full"
        data-speed="40"
      />
      <div
        className="bg-blob absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/15 blur-[120px] rounded-full"
        data-speed="-40"
      />
    </div>
  );
}
