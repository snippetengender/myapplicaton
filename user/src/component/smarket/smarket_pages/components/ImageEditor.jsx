// ImageEditor.jsx
import { Upload, Move, Pencil, X, Crop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ImageEditor({ onSave, onClose, isOpen }) {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('move');
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
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
          setScale(1);
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
    canvas.width = img.width;
    canvas.height = img.height;
    
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
    setCtx(context);
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (tool === 'crop') {
      setIsCropping(true);
      setCropStart({ x, y });
      setCropEnd({ x, y });
    } else if (tool === 'draw' && ctx) {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3 / scale;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (tool === 'crop' && isCropping) {
      setCropEnd({ x, y });
      drawCropOverlay();
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
    
    overlayCanvas.width = canvasRef.current.width;
    overlayCanvas.height = canvasRef.current.height;
    
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropEnd.x - cropStart.x);
    const h = Math.abs(cropEnd.y - cropStart.y);
    
    overlayCtx.clearRect(x, y, w, h);
    
    overlayCtx.strokeStyle = '#3b82f6';
    overlayCtx.lineWidth = 2 / scale;
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
    
    tempCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    
    const croppedImg = new Image();
    croppedImg.onload = () => {
      setImage(croppedImg);
      drawImageOnCanvas(croppedImg);
      setCropStart(null);
      setCropEnd(null);
      setTool('move');
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
    setScale(1);
    setTool('move');
    setCropStart(null);
    setCropEnd(null);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (cropStart && cropEnd) {
      drawCropOverlay();
    }
  }, [cropStart, cropEnd, scale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Editor Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Image</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {!image ? (
          <div className="p-12 flex-1 flex items-center justify-center">
            <label className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-gray-500 transition-colors">
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
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-700 flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTool('move');
                    setCropStart(null);
                    setCropEnd(null);
                    if (overlayCanvasRef.current) {
                      const overlayCtx = overlayCanvasRef.current.getContext('2d');
                      overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tool === 'move'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Move className="w-5 h-5" />
                  Move
                </button>
                <button
                  onClick={() => {
                    setTool('crop');
                    setCropStart(null);
                    setCropEnd(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tool === 'crop'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Crop className="w-5 h-5" />
                  Crop
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tool === 'draw'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Pencil className="w-5 h-5" />
                  Draw
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Zoom:</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={handleScaleChange}
                  className="w-32"
                />
                <span className="text-sm text-gray-300 w-12">{Math.round(scale * 100)}%</span>
              </div>

              {tool === 'crop' && cropStart && cropEnd && (
                <button
                  onClick={applyCrop}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
                >
                  Apply Crop
                </button>
              )}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto p-4 bg-gray-800">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    cursor: tool === 'draw' ? 'crosshair' : tool === 'crop' ? 'crosshair' : 'move',
                    display: 'block'
                  }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveImage}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Save Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}