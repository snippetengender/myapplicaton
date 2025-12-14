import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageEditor from './components/ImageEditor';

export default function ProductListingForm() {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: '',
    college: '',
    phoneNumber: '', 
    agreedToTerms: false
  });

  const [showEditor, setShowEditor] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleSaveImage = (imageUrl) => {
    setUploadedImages([...uploadedImages, imageUrl]);
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { ...formData, images: uploadedImages });
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
      <h1 className="text-2xl font-semibold mb-8">List your Product</h1>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm mb-2">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) => setFormData({...formData, productName: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-2">Price</label>
          <input
            type="text"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm mb-2">Category</label>
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* College */}
        <div>
          <label className="block text-sm mb-2">College</label>
          <input
            type="text"
            placeholder="College"
            value={formData.college}
            onChange={(e) => setFormData({...formData, college: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Upload Button */}
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

        {/* Terms and Conditions */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreedToTerms}
            onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
            className="w-4 h-4 bg-transparent border border-gray-700 rounded"
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the Terms and Conditions
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          List Product
        </button>
      </div>

      {/* Image Editor Component */}
      <ImageEditor
        isOpen={showEditor}
        onSave={handleSaveImage}
        onClose={() => setShowEditor(false)}
      />
    </div>
  );
}