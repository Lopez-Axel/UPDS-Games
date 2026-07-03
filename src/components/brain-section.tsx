"use client";

import { useState, useCallback } from "react";
import { Scan, AlertCircle, X } from "lucide-react";
import { BrainOverlay } from "@/components/brain-overlay";
import { Dialog } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const QrScanner = dynamic(() => import("@/components/qr-scanner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-blue-400 text-sm">
      Cargando cámara...
    </div>
  ),
});

interface JuegoData {
  id: string;
  nombre: string;
  lobulo: string;
  lobuloImg: string;
  descripcion: string;
  completado: boolean;
}

interface ScanResult {
  exito: boolean;
  token?: string;
  error?: string;
}

export function BrainSection({
  juegos,
  fullColor = false,
}: {
  juegos: JuegoData[];
  fullColor?: boolean;
}) {
  const [scanOpen, setScanOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScanResult = useCallback((result: ScanResult) => {
    setScanOpen(false);
    if (result.exito && result.token) {
      window.location.href = `/sync/${result.token}`;
    } else {
      setScanError(result.error ?? "QR inválido o expirado");
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <BrainOverlay juegos={juegos} fullColor={fullColor} />

      <button
        onClick={() => setScanOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
      >
        <Scan className="w-4 h-4" />
        Escanear QR
      </button>

      <Dialog.Root open={scanOpen} onOpenChange={setScanOpen} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Escanear QR
              </h2>
              <Dialog.Close className="relative top-0 right-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
            <div className="p-4">
              <QrScanner onResult={handleScanResult} />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!scanError} disablePointerDismissal>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup className="w-[85vw] max-w-sm bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-5 py-6 text-center">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-white" />
              <h2 className="text-xl font-bold text-white">
                QR inválido
              </h2>
            </div>
            <div className="p-5 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {scanError ?? "Este código ya expiró o no es válido"}
              </p>
              <button
                onClick={() => {
                  setScanError(null);
                  setScanOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Reintentar
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
