"use client";

import { useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";

interface VideoPopupProps {
  open: boolean;
  onComplete: () => void;
}

export function VideoPopup({ open, onComplete }: VideoPopupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!open) {
      doneRef.current = false;
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();

    const handleTimeUpdate = () => {
      if (video.currentTime >= 4 && !doneRef.current) {
        doneRef.current = true;
        video.pause();
        onComplete();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [open, onComplete]);

  return (
    <Dialog.Root open={open} disablePointerDismissal>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup className="w-[90vw] max-w-lg bg-black rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative overflow-hidden">
            <video
              ref={videoRef}
              src="/video.mp4"
              muted
              playsInline
              className="w-full h-auto block"
              style={{
                clipPath: "inset(10% 0 0 0)",
                transform: "scaleY(1.112)",
              }}
            />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
