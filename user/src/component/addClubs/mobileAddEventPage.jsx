import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MUI Icon Imports ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
// ----------------------------------------------------

const perksList = [
  'dj', 'academics', 'food stalls', 'refrshments', 'celebrity', 'networking',
  'games', 'gender specific', 'its free', 'cash prizes', 'merchandise',
  'tshirts', 'access to alumni network'
];

// Reusable component for styled form inputs
const FormInput = ({ placeholder, type = 'text', value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-brand-pink"
  />
);

// Modal for uploading a banner image
const ImageUploadModal = ({ isOpen, onClose, onImageSelect }) => {
  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelect(URL.createObjectURL(file));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1E] p-6 rounded-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload Banner</h2>
          <button onClick={onClose}><CloseIcon /></button>
        </div>
        <p className="text-gray-400 mb-4">Select an image file to use as the event banner.</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink file:text-[#E7E9EA] hover:file:bg-pink-600"
        />
      </div>
    </div>
  );
};

const AddEventPage = () => {
  const navigate = useNavigate();

  // State for the form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [hood, setHood] = useState('your hood');
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [eventType, setEventType] = useState('free');
  const [eventLink, setEventLink] = useState('');
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [eventMode, setEventMode] = useState('Online');
  const [meetingLink, setMeetingLink] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [contacts, setContacts] = useState('');

  const togglePerk = (perk) => {
    setSelectedPerks(prev =>
      prev.includes(perk) ? prev.filter(p => p !== perk) : [...prev, perk]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const eventData = { bannerImage, hood, eventName, category, dateTime, eventType, eventLink, selectedPerks, eventMode, meetingLink, mapLocation, contacts };
    navigate('/club-admin');
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0">
      <ImageUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onImageSelect={setBannerImage} />
      
      <header className="px-4 pt-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#E7E9EA]">
            <ArrowBackIcon />
          </button>
          <h1 className="text-xl font-bold">Add Event</h1>
        </div>
      </header>

      <main className="px-4 pb-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload Box */}
          <div
            className="h-48 bg-cover bg-center bg-[#1C1C1E] border border-dashed border-gray-700 rounded-lg flex items-center justify-center relative"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            {!bannerImage && <div className="absolute inset-0 bg-black/30"></div>}
            <button type="button" onClick={() => setIsModalOpen(true)} className="h-8 w-8 bg-black/50 rounded-full flex items-center justify-center z-10">
              <AddIcon />
            </button>
          </div>

          {/* Hood Radio */}
          <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="hood" value="your hood" checked={hood === 'your hood'} onChange={(e) => setHood(e.target.value)} className="hidden" />
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${hood === 'your hood' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {hood === 'your hood' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>your hood</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="hood" value="other hood" checked={hood === 'other hood'} onChange={(e) => setHood(e.target.value)} className="hidden" />
                 <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${hood === 'other hood' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {hood === 'other hood' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>other hood</span>
              </label>
            </div>

          {/* Event Name */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Event Name</h2>
            <textarea placeholder="Event description goes here" value={eventName} onChange={(e) => setEventName(e.target.value)} maxLength="1000" className="w-full h-24 bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-brand-pink resize-none"></textarea>
            <p className="text-right text-xs text-gray-500">{eventName.length}/1000</p>
          </div>

          {/* Category Dropdown */}
           <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] appearance-none focus:outline-none focus:border-brand-pink">
              <option value="" disabled>category</option>
              <option value="Tech">Tech</option>
              <option value="Music">Music</option>
              <option value="Workshop">Workshop</option>
           </select>
          
          {/* Date and Time Picker */}
          <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-brand-pink" />
          
          {/* Event Type Radio */}
          <div>
            <p className="font-semibold mb-2">type of event</p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="eventType" value="free" checked={eventType === 'free'} onChange={(e) => setEventType(e.target.value)} className="hidden" />
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${eventType === 'free' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {eventType === 'free' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>free</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="eventType" value="paid" checked={eventType === 'paid'} onChange={(e) => setEventType(e.target.value)} className="hidden" />
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${eventType === 'paid' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {eventType === 'paid' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>paid</span>
              </label>
            </div>
          </div>
          
          <FormInput placeholder="form link/register link" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
          
          {/* Perks */}
          <div>
            <p className="font-semibold mb-2">Perks</p>
            <div className="flex flex-wrap gap-2">
              {perksList.map(perk => (
                <button key={perk} type="button" onClick={() => togglePerk(perk)} className={`px-3 py-1 text-sm border rounded-full transition-colors ${selectedPerks.includes(perk) ? 'bg-brand-pink border-brand-pink text-[#E7E9EA]' : 'border-gray-600 text-gray-400'}`}>
                  {perk}
                </button>
              ))}
            </div>
          </div>

           {/* Online/Offline Radio */}
           <div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="eventMode" value="Online" checked={eventMode === 'Online'} onChange={(e) => setEventMode(e.target.value)} className="hidden" />
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${eventMode === 'Online' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {eventMode === 'Online' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>Online</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="eventMode" value="Offline" checked={eventMode === 'Offline'} onChange={(e) => setEventMode(e.target.value)} className="hidden" />
                 <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${eventMode === 'Offline' ? 'border-brand-pink' : 'border-gray-500'}`}>
                    {eventMode === 'Offline' && <span className="h-2.5 w-2.5 rounded-full bg-brand-pink"></span>}
                </span>
                <span>Offline</span>
              </label>
            </div>
          </div>
          
          <FormInput placeholder="meeting link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
          <FormInput placeholder="map location leaflet" value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} />
          <FormInput placeholder="contacts" value={contacts} onChange={(e) => setContacts(e.target.value)} />

          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors">
            create event
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddEventPage;

