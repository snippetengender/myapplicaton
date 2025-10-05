import React from 'react';
import { useNavigate } from 'react-router-dom';
import snippyBaller from '../assets/Snippy_baller.png'; // Using the existing Snippy image

// Team members data with their photos and names
const students = [
  { name: "Karthik Raja", img: "/team/Karthik Raja.jpeg" },
  { name: "Harish Kumar", img: "/team/Harish.jpg" }, 
  { name: "Dharanesh", img: "/team/Dharanesh.jpg" },
  { name: "Rajagopalan", img: "/team/Rajagopalan.jpg" },
  { name: "Sharvesh", img: "/team/Sharvesh.jpg" }, 
  { name: "Sujan", img: "/team/Sujan.png" },
  { name: "ஆகாயா", img: "/team/Aagaya.png" },
  { name: "Suganthan", img: "/team/Suganthan.jpg" },
  { name: "Durga", img: "/team/Durga.jpg" }, 
  { name: "Thanajayan", img: "/team/Thanajayan.jpg" },
  { name: "Sarvesh", img: "/team/sarvesh HR.jpg" },
  { name: "Hari Priya", img: "/team/Haripriya.jpg" },
  { name: "Praneetha", img: "/team/Praneetha.jpeg" },
  { name: "Dhevadharsan", img: "/team/Dheva.jpg" },
  { name: "Subiksha", img: "/team/Subiksha.jpg" },
  { name: "Sruthi", img: "/team/Sruthi.jpg" },
  { name: "Atshayaa", img: "/team/Atshayaa .jpg" },
  { name: "Harshini", img: "/team/HARSHINI.jpg" },
  { name: "Shane Israel", img: "/team/Shane.jpg" },
  { name: "Prarthana", img: "/team/Prarthana.jpg" },
  { name: "Madhumitha", img: "/team/Madhumitha.jpg" },
  { name: "Aishwariya", img: "/team/AISHWARYA.jpeg" },
  { name: "Priyanga", img: "/team/Priyanga.jpg" },
  { name: "Udhayadharshini", img: "/team/Udhayadharshini.jpg" },
  { name: "Prajhan", img: "/team/Prajhan.jpg" },
  { name: "Agila", img: "/team/Agila.jpg" },
  { name: "Bhuvanesh", img: "/team/Bhuvanesh.png" },
  { name: "Ram Sanjai", img: "/team/Ram.jpg" },
  { name: "Sachin", img: "/team/Sachin.jpg" },
  { name: "Sri Jaya Karti", img: "/team/Sri Jaya Karti.png" },
];

// Mentor data with their photos and names
const mentors = [
  { name: "Prasanth Ganesh", img: "/mentors/Prasanth Ganesh.jpg" },
  { name: "Praveen Krishna", img: "/mentors/Praveen.jpg" },
  { name: "Ambi Moorthi", img: "/mentors/Ambi Moorthi.jpg" },
];

const AboutUs = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-black text-brand-off-white min-h-screen font-inter p-5 pb-20">
      {/* Back button */}
      <button 
        onClick={handleBack} 
        className="text-brand-off-white flex items-center"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Snippy image with basketball */}
      <div className="flex justify-end">
        <div className="relative">
          <img 
            src={snippyBaller} 
            alt="Snippy Mascot" 
            className="w-44 h-auto object-contain"
          />
        </div>
      </div>

      {/* About section */}
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-3">About Us</h1>
        <p className="text-[12px] text-brand-off-white mb-6 leading-relaxed">
          We are a group of college students who built this application to keep everyone informed. Most of the social media platforms students use today have turned into pure entertainment media, and we felt there's a real need for a space where college students can connect, discover, and share what matters to them. The Snippet aims to be a simple platform designed to truly enhance the college experience.
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <a 
						href='https://tally.so/r/mV28Kv'
            className="px-8 py-2 bg-transparent border border-brand-off-white rounded-full text-[12px] font-medium hover:bg-brand-off-white/10 transition-colors"
						target='_blank'
					>
            	Join Us
          </a>
          <a 
						href=' https://tally.so/r/3j1xKE'
						className="px-8 py-2 bg-transparent border border-brand-off-white rounded-full text-[12px] font-medium hover:bg-brand-off-white/10 transition-colors"
						target='_blank'
					>
            Donate
          </a>
        </div>
      </div>

      {/* Team section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-5">This is Us</h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          {students.map((student, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden mb-2 bg-gray-800">
                <img 
                  src={student.img || "https://via.placeholder.com/100?text=?"}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center mt-1 font-medium">{student.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mentors section */}
      <div>
        <h2 className="text-xl font-bold mb-5">Mentors</h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          {mentors.map((mentor, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden mb-2 bg-gray-800 border border-gray-600">
                <img 
                  src={mentor.img}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center mt-1 font-medium">{mentor.name}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-brand-off-white text-[10px] mt-10 text-center">
        யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் <br/> இனிதாவது எங்கும் காணோம்
      </p>
    </div>
  );
};

export default AboutUs;
