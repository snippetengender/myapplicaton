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
    const files = Array.from(e.target.files);

    files.forEach(file => {
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
          setUploadedImages(prev => [...prev, compressedDataUrl]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
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

      setUploadedImages(editListing.product_image || []);
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



  const handleSubmit = async () => {
    // ... existing payload logic
    const payload = {
      product_name: formData.productName,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      phone_number: formData.phoneNumber,
      product_image: uploadedImages
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
      <div className="mb-8">
        <button className="text-white" onClick={() => navigate("/smarket")}>
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-8">{isEditMode ? "Edit Your Product Listing" : "List Your Product"}</h1>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm mb-2">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-2">Price</label>
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
          <label className="block text-sm mb-2">Category</label>
          <select
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 rounded-md bg-black text-white border border-gray-600">
            <option value="">All Categories</option>
            {Object.entries(LISTING_CATEGORY).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>


        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-2">Phone Number</label>
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
          <label className="w-full border border-gray-700 rounded-lg py-16 text-white hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer">
            <Upload size={32} />
            <span>Upload Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
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

        {/* Terms and Conditions */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
            className="w-4 h-4 bg-transparent border border-gray-700 rounded"
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a
              href="https://thesnippetlegal.vercel.app/terms.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0C8AE5" }}
              className="hover:underline"
            >
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full text-black font-medium py-3 rounded-lg transition-colors ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
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