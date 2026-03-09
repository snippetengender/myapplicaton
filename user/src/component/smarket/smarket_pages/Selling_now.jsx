import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '../../../providers/api';
import { LISTING_STATUS, LISTING_CATEGORY } from "./constants/listingStatus";
import { useNotification } from "../../../providers/NotificationContext";

export default function ProductListingForm() {

  const user_id = localStorage.getItem('user_id');

  const location = useLocation();
  const isEditMode = location.state?.mode === "edit";
  const editListing = location.state?.listing;
  const { markMarketplaceUnread } = useNotification();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: '',
    phoneNumber: '',
    agreedToTerms: false
  });

  const [uploadedImages, setUploadedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1200;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((MAX_DIM / width) * height);
            width = MAX_DIM;
          } else {
            width = Math.round((MAX_DIM / height) * width);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        // Store only the new single image
        setUploadedImages([compressedDataUrl]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isEditMode && editListing) {
      setFormData({
        productName: editListing.product_name || '',
        description: editListing.description || '',
        price: editListing.price || '',
        category: editListing.category || '',
        phoneNumber: editListing.phone_number || '',
        agreedToTerms: true
      });

      // Handle both cases: a string containing the URL or an array
      const existingImages = editListing.product_image;
      if (Array.isArray(existingImages)) {
        setUploadedImages(existingImages.length > 0 ? [existingImages[0]] : []);
      } else if (existingImages && typeof existingImages === 'string') {
        setUploadedImages([existingImages]);
      } else {
        setUploadedImages([]);
      }
    }
  }, [isEditMode, editListing]);



  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const createListing = async (listingData) => {
    try {
      const response = await api.post('/marketplace/', listingData);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  };

  const updateListing = async (listingId, listingData) => {
    try {
      const response = await api.patch(
        `/marketplace/${listingId}`,
        listingData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };



  const isFormValid =
    formData.productName.trim() !== '' &&
    formData.price !== '' &&
    formData.category !== '' &&
    formData.phoneNumber.length === 10 &&
    uploadedImages.length > 0 &&
    formData.agreedToTerms;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // Pass the single image URL to the backend API or an array containing exactly one item
    // depending on what your backend expects. I am keeping it as an array to avoid breaking the backend schema
    const payload = {
      product_name: formData.productName,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      phone_number: formData.phoneNumber,
      product_image: uploadedImages // This is now an array of max 1 item
    };

    console.log('Sending payload:', payload);

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateListing(editListing.listing_id, payload);
      } else {
        await createListing({ ...payload, owner_id: user_id, live: LISTING_STATUS.LISTED });
        markMarketplaceUnread(); // 🔔 Trigger notification for new listing
      }

      navigate('/smarket', { state: { activeTab: 'your_listing' } });

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-4">
        <button className="text-white" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-[20px] font-bold mb-6">{isEditMode ? "Edit Your Product" : "List your Product"}</h1>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold mb-2">Product Name *</label>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 text-[15px]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold mb-2">Price *</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              setFormData({ ...formData, price: numericValue });
            }}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold mb-2">Category *</label>
          <div className="relative">
            <select
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full appearance-none bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500">
              <option value="" disabled className="text-gray-600">All Categories</option>
              {Object.entries(LISTING_CATEGORY).map(([key, label]) => (
                <option key={key} value={label} className="bg-black text-white">
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>


        {/* Phone Number */}
        <div>
          <label className="block text-sm font-bold mb-2">Whatsapp Number *</label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            maxLength={10}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
              setFormData({ ...formData, phoneNumber: numericValue });
            }}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Upload Button */}
        <div>
          <label className={`w-full bg-transparent border border-gray-700 rounded-lg py-3 px-4 text-white hover:border-gray-500 transition-colors flex items-center justify-center ${uploadedImages.length > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className="text-sm font-normal">Upload Product Photo *</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadedImages.length > 0}
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group w-[90px] h-[90px]">
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-[14px] border border-gray-700"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-[10px] -left-[10px] bg-[#FF453A] text-white rounded-full p-[2px] z-10"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="appearance-none w-4 h-4 border border-gray-600 rounded bg-transparent checked:bg-white checked:border-white cursor-pointer"
              />
              {formData.agreedToTerms && (
                <svg className="absolute w-3 h-3 text-black pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <label htmlFor="terms" className="text-sm font-normal text-white select-none cursor-pointer">
              I agree to the <span className="text-[#00A3FF]">Terms and Conditions</span>
            </label>
          </div>
          {/* <p className="text-xs font-normal text-white mt-1">
            Please ensure that all the above fields are filled <span className="text-base leading-none">👍</span>
          </p> */}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid}
          className={`w-full text-black font-bold py-3 mt-4 rounded-lg transition-colors ${isSubmitting || !isFormValid
            ? 'bg-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white hover:bg-gray-100'
            }`}
        >
          {isSubmitting
            ? (isEditMode ? "Updating the product..." : "Listing the product...")
            : (isEditMode ? "Update Product" : "List Product")}
        </button>
      </div>


    </div>
  );
}