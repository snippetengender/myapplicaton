import { Upload, Pencil, X, Crop, Check, Undo } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ImageEditor from "../smarket/smarket_pages/components/ImageEditor"
export default function Image_Edits({ onSave, onClose, isOpen }) {
  return(
    <>
        <div>
          <button
            type="button"
            onClick={() => setShowEditor(true)}
            className="w-full border border-gray-700 rounded-lg py-16 text-white hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <Upload size={32} />
            <span>Upload Images</span>
          </button>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-700"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
    <div>
      <ImageEditor
            isOpen={showEditor}
            onSave={handleSaveImage}
            onClose={() => setShowEditor(false)}
        />
    </div>

    </>
  );
}