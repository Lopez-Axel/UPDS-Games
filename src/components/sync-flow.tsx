"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { VideoPopup } from "@/components/video-popup";

const ANCHO = 1086;
const ALTO = 996;

interface SyncFlowProps {
  token: string;
  juegoNombre: string;
  lobulo: string;
  lobuloImg: string;
}

export function SyncFlow({
  token,
  juegoNombre,
  lobulo,
  lobuloImg,
}: SyncFlowProps) {
  const router = useRouter();
  const [cartaOpen, setCartaOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [brainTransition, setBrainTransition] = useState(false);
  const [showFullColor, setShowFullColor] = useState(false);
  const redirectingRef = useRef(false);

  const handleRedirect = useCallback(
    (full?: boolean) => {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      router.push(full ? "/mi-cerebro?full=1" : "/mi-cerebro");
    },
    [router]
  );

  const handleCartaClose = useCallback(async () => {
    setCartaOpen(false);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scanner/completar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al completar el desbloqueo");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLoading(false);

      if (data.allCompleted) {
        setVideoOpen(true);
      } else {
        handleRedirect();
      }
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }, [token, handleRedirect]);

  const handleVideoComplete = useCallback(() => {
    setVideoOpen(false);
    setBrainTransition(true);
  }, []);

  const handleErrorRetry = useCallback(() => {
    setError(null);
    handleCartaClose();
  }, [handleCartaClose]);

  useEffect(() => {
    if (!brainTransition) return;
    const t1 = setTimeout(() => setShowFullColor(true), 50);
    const t2 = setTimeout(() => handleRedirect(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [brainTransition, handleRedirect]);

  return (
    <>
      <Dialog.Root open={cartaOpen} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="max-w-[85vw] max-h-[85vh] w-auto h-auto bg-transparent shadow-none">
            <div className="relative">
              <img
                src={`/carta-${lobulo}.png`}
                alt={juegoNombre}
                className="w-auto h-auto max-w-[85vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <Dialog.Close
                onClick={handleCartaClose}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!error} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="w-[85vw] max-w-sm bg-white rounded-2xl shadow-2xl p-5 text-center">
            <h2 className="text-lg font-bold text-red-600 mb-2">
              Error
            </h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleErrorRetry}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer"
            >
              Reintentar
            </button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={loading} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="w-[85vw] max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Desbloqueando lóbulo...
            </p>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <VideoPopup open={videoOpen} onComplete={handleVideoComplete} />

      <Dialog.Root open={brainTransition} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="w-[85vw] max-w-sm bg-transparent shadow-none">
            <div
              className="relative w-full mx-auto"
              style={{ aspectRatio: `${ANCHO}/${ALTO}` }}
            >
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  showFullColor ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src="/cerebro-gris.png"
                  alt="Cerebro"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <img
                  src={lobuloImg}
                  alt="Lóbulo"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  showFullColor ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src="/cerebro-fullcolor.png"
                  alt="Cerebro completo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
