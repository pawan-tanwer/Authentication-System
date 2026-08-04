import React, { useContext, useRef, useState, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdCloudUpload } from "react-icons/io";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const FRAME_SIZE = 220;   // on-screen crop circle size (px)
const OUTPUT_SIZE = 400;  // exported image resolution (px)
const userUrl = "http://localhost:8000/api/user"; // adjust if imported from elsewhere

const ChangeProfilePicture = () => {
  const { 
    uploadProfile, setUploadProfile, accessToken,setProfileImage,profileImage

   } = useContext(StoreContext);

  const [imageSrc, setImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [maxOffset, setMaxOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const resetState = () => {
    setImageSrc(null);
    setZoom(1);
    setBaseScale(1);
    setPosition({ x: 0, y: 0 });
    setMaxOffset({ x: 0, y: 0 });
  };

  const handleClose = () => {
    resetState();
    setUploadProfile(false);
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const onInputChange = (e) => handleFileSelect(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const computeMaxOffset = (currentZoom, scale) => {
    const img = imgRef.current;
    if (!img) return { x: 0, y: 0 };
    const s = scale * currentZoom;
    const displayW = img.naturalWidth * s;
    const displayH = img.naturalHeight * s;
    return {
      x: Math.max((displayW - FRAME_SIZE) / 2, 0),
      y: Math.max((displayH - FRAME_SIZE) / 2, 0),
    };
  };

  const onImageLoad = () => {
    const img = imgRef.current;
    const scale = Math.min(
      FRAME_SIZE / img.naturalWidth,
      FRAME_SIZE / img.naturalHeight
    );
    setBaseScale(scale);
    setMaxOffset(computeMaxOffset(1, scale));
  };

  const clampPosition = useCallback(
    (x, y, currentZoom) => {
      const bounds = computeMaxOffset(currentZoom, baseScale);
      return {
        x: Math.min(Math.max(x, -bounds.x), bounds.x),
        y: Math.min(Math.max(y, -bounds.y), bounds.y),
      };
    },
    [baseScale]
  );

  const startDrag = (clientX, clientY) => {
    dragState.current = {
      dragging: true,
      startX: clientX,
      startY: clientY,
      origX: position.x,
      origY: position.y,
    };
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragState.current.dragging) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    const next = clampPosition(
      dragState.current.origX + dx,
      dragState.current.origY + dy,
      zoom
    );
    setPosition(next);
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  const handleZoomChange = (value) => {
    const newZoom = parseFloat(value);
    setZoom(newZoom);
    const bounds = computeMaxOffset(newZoom, baseScale);
    setMaxOffset(bounds);
    setPosition((prev) => clampPosition(prev.x, prev.y, newZoom));
  };

  const handleHorizontalChange = (value) => {
    const next = clampPosition(parseFloat(value), position.y, zoom);
    setPosition(next);
  };

  const handleVerticalChange = (value) => {
    const next = clampPosition(position.x, parseFloat(value), zoom);
    setPosition(next);
  };

  const handleUpload = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ratio = OUTPUT_SIZE / FRAME_SIZE;
    const scale = baseScale * zoom * ratio;
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const dx = (OUTPUT_SIZE - drawWidth) / 2 + position.x * ratio;
    const dy = (OUTPUT_SIZE - drawHeight) / 2 + position.y * ratio;

    const ctx = canvas.getContext("2d");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    ctx.restore();

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("avatar", blob, "avatar.png");

       const response= await axios.patch(`${userUrl}/avatar`, formData, {
          withCredentials: true,
          headers: {
            
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if(response.data.success){
          toast.success(response.data.message);
          setProfileImage(response.data.avatar.url)
          console.log("profile :",response.data)
        }

        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong")
        console.error("Avatar upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }, "image/png");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={endDrag}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1420] shadow-[0_0_40px_rgba(99,102,241,0.15)] p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Update profile photo
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RxCross2 className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        {!imageSrc ? (
          <label
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-56 rounded-xl border-2 border-dashed border-white/15 hover:border-indigo-500/50 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
          >
            <IoMdCloudUpload className="text-4xl text-indigo-400" />
            <p className="text-sm text-gray-300">
              Click or drag an image to upload
            </p>
            <p className="text-xs text-gray-500">PNG or JPG, up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden"
            />
          </label>
        ) : (
          <>
            {/* Crop frame */}
            <div className="flex justify-center">
              <div
                className="relative rounded-full overflow-hidden border-2 border-indigo-500/40 bg-black cursor-grab active:cursor-grabbing"
                style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
                onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                onTouchStart={(e) =>
                  startDrag(e.touches[0].clientX, e.touches[0].clientY)
                }
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  onLoad={onImageLoad}
                  alt="Selected avatar preview"
                  draggable={false}
                  className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${baseScale * zoom})`,
                    transformOrigin: "center",
                    width: "auto",
                    height: "auto",
                    maxWidth: "none",
                  }}
                />
              </div>
            </div>

            {/* Zoom control */}
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs text-gray-400 w-12 shrink-0">Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(e.target.value)}
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Horizontal position control */}
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs text-gray-400 w-12 shrink-0">
                Left/right
              </span>
              <input
                type="range"
                min={-maxOffset.x}
                max={maxOffset.x}
                step="0.5"
                value={position.x}
                disabled={maxOffset.x === 0}
                onChange={(e) => handleHorizontalChange(e.target.value)}
                className="flex-1 accent-indigo-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Vertical position control */}
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs text-gray-400 w-12 shrink-0">
                Up/down
              </span>
              <input
                type="range"
                min={-maxOffset.y}
                max={maxOffset.y}
                step="0.5"
                value={position.y}
                disabled={maxOffset.y === 0}
                onChange={(e) => handleVerticalChange(e.target.value)}
                className="flex-1 accent-indigo-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetState}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Choose different photo
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Save photo"}
              </button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ChangeProfilePicture;