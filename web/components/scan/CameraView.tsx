"use client";
import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose?: () => void;
}

const CAMERA_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "environment", // Use back camera
};

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
  const t = useTranslations("scan");
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({ width: 1280, height: 720 });
    if (!imageSrc) return;

    // Convert base64 to File
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
      });
  }, [onCapture]);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
  };

  const handleUserMediaError = () => {
    setPermissionDenied(true);
  };

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <X size={40} className="text-gray-400" />
        </div>
        <div>
          <h2 className="text-heading-sm font-bold text-gray-800 mb-2">{t("permissionDenied")}</h2>
          <p className="text-body-sm text-gray-500">{t("permissionInstructions")}</p>
        </div>
        <button
          id="upload-gallery-fallback"
          className="btn-primary max-w-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={20} />
          {t("uploadInstead")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleGalleryUpload}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100svh-60px)] bg-black flex flex-col justify-center overflow-hidden">
      {/* Camera feed */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.9}
        videoConstraints={{ ...CAMERA_CONSTRAINTS, facingMode: facing }}
        onUserMediaError={handleUserMediaError}
        className="w-full h-full object-cover"
        mirrored={false}
      />

      {/* Viewfinder overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner guides */}
        <div className="absolute inset-8">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
        </div>
        {/* Prompt text */}
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <span className="bg-black/50 text-white text-body-sm px-4 py-1 rounded-full">
            {t("cameraPrompt")}
          </span>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          id="camera-close"
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
      )}

      {/* Flip camera */}
      <button
        id="camera-flip"
        onClick={() => setFacing(facing === "environment" ? "user" : "environment")}
        className="absolute top-3 left-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
      >
        <RefreshCw size={18} className="text-white" />
      </button>

      {/* Bottom controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8">
        {/* Gallery upload */}
        <button
          id="gallery-upload"
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center"
        >
          <Upload size={22} className="text-white" />
        </button>

        {/* Shutter button */}
        <button
          id="shutter-button"
          onClick={handleCapture}
          className={cn(
            "w-20 h-20 rounded-full border-4 border-white bg-white/20",
            "flex items-center justify-center",
            "active:scale-95 transition-transform duration-100"
          )}
        >
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>

        {/* Spacer for symmetry */}
        <div className="w-12 h-12" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleGalleryUpload}
      />
    </div>
  );
}
