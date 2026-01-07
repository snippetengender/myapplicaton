import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MUI Icon Imports ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// ----------------------------------------------------

// Initial mock data for club requests
const initialRequests = [
  {
    id: '94rh9ir34',
    time: '5d ago',
    name: 'FOSS Club',
    email: 'foss@cit.edu.in',
    number: '9876543210',
    instagram: '@foss',
    college: 'CIT',
    status: 'pending', // 'pending' or 'approved'
    password: '',
  },
  {
    id: '94rh9ir35', // A different ID for the second request
    time: '5d ago',
    name: 'FOSS Club',
    email: 'foss@cit.edu.in',
    number: '9876543210',
    instagram: '@foss',
    college: 'CIT',
    status: 'approved',
    password: 'foss_cit',
  },
];

// Component for a single club request card
const RequestCard = ({ request, onApprove }) => {
  const [password, setPassword] = useState('');

  const handleApproveClick = () => {
    if (password.trim()) {
      onApprove(request.id, password);
    } else {
      alert("Please enter a password before approving.");
    }
  };
  
  const detailItems = [
    { label: 'Request ID', value: request.id },
    { label: 'Time', value: request.time },
    { label: 'Name', value: request.name },
    { label: 'Email', value: request.email },
    { label: 'Number', value: request.number },
    { label: 'Instagram ID', value: request.instagram },
    { label: 'College', value: request.college },
  ];

  return (
    <div className="border-b border-gray-800 py-6">
      <div className="space-y-1">
        {detailItems.map(item => (
            <p key={item.label} className="text-[#E7E9EA]">
                {item.label} : <span className="text-gray-400">{item.value}</span>
            </p>
        ))}
        {request.status === 'approved' && (
             <p className="text-[#E7E9EA]">
                password : <span className="text-gray-400">{request.password}</span>
            </p>
        )}
      </div>

      {request.status === 'pending' && (
        <div className="flex items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-grow bg-black border border-gray-700 rounded-lg px-4 py-2 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-pink-500"
          />
          <button 
            onClick={handleApproveClick}
            className="bg-black border border-gray-700 text-[#E7E9EA] font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            add club
          </button>
        </div>
      )}
    </div>
  );
};


const AdminApprovalPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(initialRequests);

  // Function to handle approving a request
  const handleApproveRequest = (id, password) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === id ? { ...req, status: 'approved', password: password } : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0 flex flex-col">
      {/* Top Bar with back navigation */}
      <header className="px-4 pt-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-[#E7E9EA]">
          <ArrowBackIcon />
        </button>
      </header>

      <main className="flex-grow px-4">
        <h1 className="text-2xl font-bold text-[#E7E9EA] mb-2">Club Requests</h1>
        <p className="text-gray-400 mb-4">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* List of club requests */}
        <div>
          {requests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={handleApproveRequest}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminApprovalPage;
