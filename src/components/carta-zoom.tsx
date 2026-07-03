"use client";

import { useEffect, useCallback } from "react";

interface CartaZoomProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function CartaZoom({ src, alt, onClose }: CartaZoomProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-colors z-10"
        aria-label="Cerrar"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl animate-scale-in cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
