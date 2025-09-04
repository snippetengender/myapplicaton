// src/components/MobileCreateNetwork2.jsx

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, UploadCloud, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBannerFile, setLogoFile } from '../../../features/networkCreate/networkSlice';
import imageCompression from 'browser-image-compression';

export default function MobileCreateNetwork2() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Create refs to trigger file input clicks
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Get data from Redux for the preview
  const { name, description, logo, banner } = useSelector((state) => state.network.formData);

  // Local state for image previews
  const [logoPreview, setLogoPreview] = useState(logo ? URL.createObjectURL(logo) : null);
  const [bannerPreview, setBannerPreview] = useState(banner ? URL.createObjectURL(banner) : null);

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Compression options
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        console.log('Compressed File Object:', compressedFile);


      if (type === 'logo') {
        dispatch(setLogoFile(compressedFile));
        setLogoPreview(URL.createObjectURL(compressedFile));
      } else {
        dispatch(setBannerFile(compressedFile));
        setBannerPreview(URL.createObjectURL(compressedFile));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      // Optionally, dispatch an error action or show a notification
    }
  };
  
  const handleNext = () => navigate('/mobile_createnetwork_3');
  const handleBack = () => navigate('/mobile_createnetwork_1');

  return (
    <div className="bg-black text-white min-h-screen flex flex-col p-6 pb-28">
      {/* Hidden file inputs */}
      <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} style={{ display: 'none' }} />
      <input type="file" accept="image/*" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} style={{ display: 'none' }} />

      <header className="flex items-center justify-between w-full mb-6">
        <button onClick={handleBack} className="p-2 -ml-2 text-neutral-300">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-neutral-800 text-xs rounded-full px-3 py-1.5">2/3</div>
      </header>
      
      <main className="w-full">
        <h1 className="text-2xl font-semibold mb-2">Style your Network</h1>
        <p className="text-xs text-neutral-400 mb-8">Add a logo and a banner to make your network stand out.</p>

        <div className="bg-black border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div 
            className="h-24 bg-neutral-900 rounded-lg flex items-center justify-center cursor-pointer relative"
            onClick={() => bannerInputRef.current.click()}
            style={{ backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {!bannerPreview && <button className="text-xs border border-neutral-600 rounded-md px-3 py-1.5">add banner</button>}
          </div>

          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 bg-neutral-800 rounded-full flex-shrink-0 cursor-pointer flex items-center justify-center"
              onClick={() => logoInputRef.current.click()}
              style={{ backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover' }}
            >
              {!logoPreview && <UploadCloud size={20} />}
            </div>
            <span className="font-semibold text-lg">{name || "Your Network Title"}</span>
          </div>
          <p className="text-sm text-neutral-400">{description || "Your network description will appear here."}</p>
        </div>
      </main>

      <footer className="fixed bottom-6 right-6">
        <button onClick={handleNext} className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center">
          <ArrowRight size={24} className="text-white" />
        </button>
      </footer>
    </div>
  );
}