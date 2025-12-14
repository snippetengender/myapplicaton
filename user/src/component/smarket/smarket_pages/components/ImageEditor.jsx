// ImageEditor.jsx
import { Upload, Pencil, X, Crop, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ImageEditor({ onSave, onClose, isOpen }) {
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(null);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && image) {
      drawImageOnCanvas(image);
    }
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setTimeout(() => {
            drawImageOnCanvas(img);
          }, 100);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageOnCanvas = (img) => {
    if (!canvasRef.current || !img) return;
    
    const canvas = canvasRef.current;
    
    // Set canvas to image's actual size
    canvas.width = img.width;
    canvas.height = img.height;
    
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
    setCtx(context);

    // Set overlay canvas to same size
    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = img.width;
      overlayCanvasRef.current.height = img.height;
    }
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the scale between displayed size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get coordinates relative to the displayed canvas
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;

    const { x, y } = getCanvasCoordinates(e);

    if (tool === 'crop') {
      setIsCropping(true);
      setCropStart({ x, y });
      setCropEnd({ x, y });
    } else if (tool === 'draw' && ctx) {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const draw = (e) => {
    if (!canvasRef.current) return;

    const { x, y } = getCanvasCoordinates(e);

    if (tool === 'crop' && isCropping) {
      setCropEnd({ x, y });
    } else if (tool === 'draw' && isDrawing && ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (tool === 'crop') {
      setIsCropping(false);
    } else if (tool === 'draw') {
      setIsDrawing(false);
    }
  };

  const drawCropOverlay = () => {
    if (!overlayCanvasRef.current || !cropStart || !cropEnd) return;

    const overlayCanvas = overlayCanvasRef.current;
    const overlayCtx = overlayCanvas.getContext('2d');
    
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Draw semi-transparent overlay over entire canvas
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Calculate crop rectangle
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropEnd.x - cropStart.x);
    const h = Math.abs(cropEnd.y - cropStart.y);
    
    // Clear the crop area (make it visible)
    overlayCtx.clearRect(x, y, w, h);
    
    // Draw border around crop area
    overlayCtx.strokeStyle = '#3b82f6';
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(x, y, w, h);
  };

  const applyCrop = () => {
    if (!canvasRef.current || !cropStart || !cropEnd) return;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropEnd.x - cropStart.x);
    const h = Math.abs(cropEnd.y - cropStart.y);

    if (w < 10 || h < 10) return;

    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the cropped portion
    tempCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    
    const croppedImg = new Image();
    croppedImg.onload = () => {
      setImage(croppedImg);
      drawImageOnCanvas(croppedImg);
      setCropStart(null);
      setCropEnd(null);
      setTool(null);
      if (overlayCanvasRef.current) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d');
        overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
    };
    croppedImg.src = tempCanvas.toDataURL();
  };

  const saveImage = () => {
    if (canvasRef.current && onSave) {
      const imageUrl = canvasRef.current.toDataURL('image/png');
      onSave(imageUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setImage(null);
    setTool(null);
    setCropStart(null);
    setCropEnd(null);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (cropStart && cropEnd) {
      drawCropOverlay();
    }
  }, [cropStart, cropEnd]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {!image ? (
        <div className="w-full h-full flex items-center justify-center">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <span className="text-lg text-gray-400">Click to upload an image</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Canvas Area */}
          <div ref={containerRef} className="relative max-w-full max-h-full overflow-auto">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  draw({ clientX: touch.clientX, clientY: touch.clientY });
                }}
                onTouchEnd={stopDrawing}
                style={{
                  cursor: tool === 'draw' ? 'crosshair' : tool === 'crop' ? 'crosshair' : 'default',
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '12px',
                  touchAction: 'none'
                }}
              />
              <canvas
                ref={overlayCanvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Floating Action Buttons - Right Side */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
            <button
              onClick={() => {
                setTool('crop');
                setCropStart(null);
                setCropEnd(null);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                tool === 'crop'
                  ? 'bg-green-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-800 shadow-md hover:scale-105'
              }`}
            >
              <Crop className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setTool('draw');
                setCropStart(null);
                setCropEnd(null);
                if (overlayCanvasRef.current) {
                  const overlayCtx = overlayCanvasRef.current.getContext('2d');
                  overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                tool === 'draw'
                  ? 'bg-pink-500 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-800 shadow-md hover:scale-105'
              }`}
            >
              <Pencil className="w-5 h-5" />
            </button>

            {/* Apply Crop Button */}
            {tool === 'crop' && cropStart && cropEnd && (
              <button
                onClick={applyCrop}
                className="w-12 h-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all"
              >
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Close Button - Top Right */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition-all"
          >
            <X size={20} />
          </button>

          {/* Save Button - Bottom Right */}
          <button
            onClick={saveImage}
            className="absolute bottom-6 right-6 px-6 py-3 bg-white text-gray-800 font-medium rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Save Image
          </button>
        </div>
      )}
    </div>
  );
}