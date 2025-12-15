import { Upload, Pencil, X, Crop, Check, Undo } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ImageEditor({ onSave, onClose, isOpen }) {
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(null);
  const [pencilSize, setPencilSize] = useState(8);
  const [showPencilSizes, setShowPencilSizes] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const fileInputRef = useRef(null);

  // Pencil sizes: display size (for button) and actual drawing width (on canvas, before scaling)
  const pencilSizes = [
    { display: 8, width: 2 },
    { display: 16, width: 4 },
    { display: 24, width: 6 },
    { display: 32, width: 8 },
    { display: 40, width: 10 }
  ];

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
          setHistory([]);
          setTimeout(() => {
            drawImageOnCanvas(img);
          }, 100);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL();
    setHistory(prev => [...prev, imageData]);
  };

  const undo = () => {
    if (history.length === 0) return;
    
    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    
    const img = new Image();
    img.onload = () => {
      setImage(img);
      drawImageOnCanvas(img);
    };
    img.src = previousState;
  };

  const drawImageOnCanvas = (img) => {
    if (!canvasRef.current || !img) return;
    
    const canvas = canvasRef.current;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
    setCtx(context);

    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = img.width;
      overlayCanvasRef.current.height = img.height;
    }
  };

  // FIX: Modified to return the canvas scale factor (scaleX)
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { x, y, scaleX };
  };

  const getHandleAtPoint = (x, y) => {
    if (!cropStart || !cropEnd) return null;

    const cropX = Math.min(cropStart.x, cropEnd.x);
    const cropY = Math.min(cropStart.y, cropEnd.y);
    const cropW = Math.abs(cropEnd.x - cropStart.x);
    const cropH = Math.abs(cropEnd.y - cropStart.y);

    const handleSize = 40;

    const handles = {
      'nw': { x: cropX, y: cropY },
      'n': { x: cropX + cropW / 2, y: cropY },
      'ne': { x: cropX + cropW, y: cropY },
      'e': { x: cropX + cropW, y: cropY + cropH / 2 },
      'se': { x: cropX + cropW, y: cropY + cropH },
      's': { x: cropX + cropW / 2, y: cropY + cropH },
      'sw': { x: cropX, y: cropY + cropH },
      'w': { x: cropX, y: cropY + cropH / 2 }
    };

    for (const [handle, pos] of Object.entries(handles)) {
      if (Math.abs(x - pos.x) < handleSize && Math.abs(y - pos.y) < handleSize) {
        return handle;
      }
    }

    return null;
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;

    // FIX: Destructure scaleX from the return value
    const { x, y, scaleX } = getCanvasCoordinates(e);

    if (tool === 'crop') {
      const handle = getHandleAtPoint(x, y);
      
      if (handle) {
        setActiveHandle(handle);
        setIsCropping(false);
      } else {
        setIsCropping(true);
        setCropStart({ x, y });
        setCropEnd({ x, y });
        setActiveHandle(null);
      }
    } else if (tool === 'draw' && ctx) {
      saveToHistory();
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#ec4899';
      // FIX: Scale the pencil size by the canvas scale factor (scaleX)
      ctx.lineWidth = pencilSize * scaleX; 
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const draw = (e) => {
    if (!canvasRef.current) return;

    const { x, y } = getCanvasCoordinates(e);

    if (tool === 'crop') {
      if (isCropping && !activeHandle) {
        setCropEnd({ x, y });
      } else if (activeHandle && cropStart && cropEnd) {
        const cropX = Math.min(cropStart.x, cropEnd.x);
        const cropY = Math.min(cropStart.y, cropEnd.y);
        const cropW = Math.abs(cropEnd.x - cropStart.x);
        const cropH = Math.abs(cropEnd.y - cropStart.y);

        let newStart = { ...cropStart };
        let newEnd = { ...cropEnd };

        switch (activeHandle) {
          case 'nw':
            newStart = { x, y };
            break;
          case 'n':
            newStart = { x: cropX, y };
            newEnd = { x: cropX + cropW, y: cropY + cropH };
            break;
          case 'ne':
            newStart = { x: cropX, y };
            newEnd = { x, y: cropY + cropH };
            break;
          case 'e':
            newEnd = { x, y: cropY + cropH };
            newStart = { x: cropX, y: cropY };
            break;
          case 'se':
            newEnd = { x, y };
            break;
          case 's':
            newEnd = { x: cropX + cropW, y };
            newStart = { x: cropX, y: cropY };
            break;
          case 'sw':
            newStart = { x, y: cropY };
            newEnd = { x: cropX + cropW, y };
            break;
          case 'w':
            newStart = { x, y: cropY };
            newEnd = { x: cropX + cropW, y: cropY + cropH };
            break;
        }

        setCropStart(newStart);
        setCropEnd(newEnd);
      }
    } else if (tool === 'draw' && isDrawing && ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (tool === 'crop') {
      setIsCropping(false);
      setActiveHandle(null);
    } else if (tool === 'draw') {
      setIsDrawing(false);
    }
  };

  const drawCropOverlay = () => {
    if (!overlayCanvasRef.current || !cropStart || !cropEnd) return;

    const overlayCanvas = overlayCanvasRef.current;
    const overlayCtx = overlayCanvas.getContext('2d');
    
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropEnd.x - cropStart.x);
    const h = Math.abs(cropEnd.y - cropStart.y);
    
    overlayCtx.clearRect(x, y, w, h);
    
    overlayCtx.strokeStyle = '#ec4899';
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(x, y, w, h);

    const handleSize = 12;
    overlayCtx.fillStyle = '#ec4899';
    
    const handles = [
      { x, y },
      { x: x + w / 2, y },
      { x: x + w, y },
      { x: x + w, y: y + h / 2 },
      { x: x + w, y: y + h },
      { x: x + w / 2, y: y + h },
      { x, y: y + h },
      { x, y: y + h / 2 }
    ];

    handles.forEach(handle => {
      overlayCtx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
    });
  };

  const applyCrop = () => {
    if (!canvasRef.current || !cropStart || !cropEnd) return;

    saveToHistory();

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
    setHistory([]);
    if (onClose) onClose();
  };

  const handlePencilClick = () => {
    if (tool === 'draw') {
      setShowPencilSizes(!showPencilSizes);
    } else {
      setTool('draw');
      setShowPencilSizes(false);
      setCropStart(null);
      setCropEnd(null);
      if (overlayCanvasRef.current) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d');
        overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    if (cropStart && cropEnd) {
      drawCropOverlay();
    }
  }, [cropStart, cropEnd]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
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
        <>
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4">
            {/* Close Button - Top Left */}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-transparent text-white flex items-center justify-center hover:bg-gray-800 transition-all"
            >
              <X size={24} />
            </button>

            {/* Undo Button - Top Center */}
            <button
              onClick={undo}
              disabled={history.length === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                history.length === 0
                  ? 'bg-transparent text-gray-600 cursor-not-allowed'
                  : 'bg-transparent text-white hover:bg-gray-800'
              }`}
            >
              <Undo className="w-6 h-6" />
            </button>

            {/* Save Button - Top Right */}
            <button
              onClick={saveImage}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all"
            >
              done
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
            <div ref={containerRef} className="relative max-w-full max-h-full">
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
          </div>

          {/* Bottom Toolbar */}
          <div className="p-6 pb-8">
            {/* Pencil Size Selector */}
            {showPencilSizes && (
              <div className="flex items-center justify-center gap-4 mb-6">
                {pencilSizes.map(size => (
                  <button
                    key={size.display}
                    onClick={() => {
                      setPencilSize(size.width);
                      setShowPencilSizes(false);
                    }}
                    className={`rounded-full flex items-center justify-center transition-all ${
                      pencilSize === size.width ? 'bg-pink-500' : 'bg-white'
                    }`}
                    style={{
                      width: `${size.display}px`,
                      height: `${size.display}px`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex items-center justify-center gap-6">
              {/* Crop Button */}
              <button
                onClick={() => {
                  setTool('crop');
                  setCropStart(null);
                  setCropEnd(null);
                  setShowPencilSizes(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    tool === 'crop'
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  <Crop className="w-6 h-6" />
                </div>
              </button>

              {/* Pencil Button */}
              <button
                onClick={handlePencilClick}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    tool === 'draw'
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  <Pencil className="w-6 h-6" />
                </div>
              </button>

              {/* Apply Crop Button */}
              {tool === 'crop' && cropStart && cropEnd && (
                <button
                  onClick={applyCrop}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 rounded-full bg-pink-600 text-white shadow-lg flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}