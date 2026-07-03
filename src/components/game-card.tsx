"use client";

import { useState } from "react";
import { CartaZoom } from "@/components/carta-zoom";

interface JuegoData {
  id: string;
  nombre: string;
  lobulo: string;
  lobuloImg: string;
  descripcion: string;
  pdfUrl: string;
  cartaUrl: string;
  completado: boolean;
  color: string;
}

const lobuloLabels: Record<string, string> = {
  frontal: "Frontal",
  temporal: "Temporal",
  parietal: "Parietal",
  occipital: "Occipital",
};

const lobuloBorders: Record<string, string> = {
  frontal: "border-red-200 bg-red-50/50",
  temporal: "border-green-200 bg-green-50/50",
  parietal: "border-blue-200 bg-blue-50/50",
  occipital: "border-yellow-200 bg-yellow-50/50",
};

const lobuloBadges: Record<string, string> = {
  frontal: "bg-red-100 text-red-700",
  temporal: "bg-green-100 text-green-700",
  parietal: "bg-blue-100 text-blue-700",
  occipital: "bg-yellow-100 text-yellow-700",
};

export function GameCard({ juego }: { juego: JuegoData }) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  if (!juego.completado) {
    return (
      <div className="rounded-xl border-2 border-gray-100 bg-white/60 p-4 opacity-50">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-1.5 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-400">
              {juego.nombre}
            </p>
            <p className="text-xs text-gray-300 mt-0.5">
              {juego.descripcion}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-medium text-gray-300 bg-gray-50 px-2 py-1 rounded-full">
            🔒
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl border-2 overflow-hidden transition-all animate-fade-in-up ${
          lobuloBorders[juego.lobulo] ?? "border-green-200 bg-green-50/50"
        }`}
      >
        <div
          className="relative cursor-pointer group"
          onClick={() => setZoomSrc(juego.cartaUrl)}
        >
          <img
            src={juego.cartaUrl}
            alt={juego.nombre}
            className="w-full h-auto object-contain bg-white transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm transition-opacity">
              🔍 Ver
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`shrink-0 w-1.5 h-10 rounded-full bg-gradient-to-b ${juego.color}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-gray-900">
                  {juego.nombre}
                </p>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    lobuloBadges[juego.lobulo] ?? "bg-green-100 text-green-700"
                  }`}
                >
                  {lobuloLabels[juego.lobulo] ?? juego.lobulo}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {juego.descripcion}
              </p>
            </div>
            <a
              href={juego.pdfUrl}
              download
              className="shrink-0 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              PDF
            </a>
          </div>
        </div>
      </div>

      {zoomSrc && (
        <CartaZoom
          src={zoomSrc}
          alt={juego.nombre}
          onClose={() => setZoomSrc(null)}
        />
      )}
    </>
  );
}
