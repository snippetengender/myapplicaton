import React from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from "../snippetIcon/Vector.svg";
import snippyPointer from "../assets/Snippy_pointer.png";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
    {/* Overlay for clicking outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={onClose}
        />
      )}
    <div 
      className={`font-inter fixed top-0 left-0 h-full bg-black w-1/2 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-brand-charcoal`}
    >
      <div className=" border-b border-brand-charcoal">
        <div className="flex justify-end items-center">
          {/* <div className="flex items-center">
            <img 
              src={LogoIcon} 
              alt="Logo" 
              className="w-8 h-8 mr-2"
            />
            <span className="text-brand-off-white text-base font-bold">The Snippet</span>
          </div> */}
          <button 
            onClick={onClose}
            className="text-brand-off-white p-2"
          >
            ✕
          </button>
        </div>
      </div>

      <nav className="">
        <Link to="/about-us" className="block">
          <div className="px-4 py-3 hover:bg-brand-charcoal border-b border-brand-charcoal">
            <h2 className="text-[20px] font-semibold text-brand-off-white">Donate</h2>
            <p className="text-[8px] text-brand-medium-gray">
              We are a bunch of college students, no investors just us and you.
            </p>
          </div>
        </Link>

        <Link to="/about-us" className="block">
          <div className="px-4 py-3 hover:bg-brand-charcoal border-b border-brand-charcoal">
            <h2 className="text-[20px] font-semibold text-brand-off-white">Join Us</h2>
            <p className="text-[8px] text-brand-medium-gray">
              Built by students like you, and there's room for more
            </p>
          </div>
        </Link>

        <Link to="/about-us" className="block">
          <div className="px-4 py-3 hover:bg-brand-charcoal border-b border-brand-charcoal">
            <h2 className="text-[20px] font-semibold text-brand-off-white">About Us</h2>
            <p className="text-[8px] text-brand-medium-gray">
              Started as an idea, now powered by students who give a damn
            </p>
          </div>
        </Link>

        <a 
					className="block"
					href='https://tally.so/r/wQP0bp'
					target='_blank'
				>
          <div className="px-4 py-3 hover:bg-brand-charcoal border-b border-brand-charcoal">
            <h2 className="text-[20px] font-semibold text-brand-off-white">Add College</h2>
            <p className="text-[8px] text-brand-medium-gray">
              Your friend's campus could be next, and it takes just a minute to add
            </p>
          </div>
        </a>
      </nav>

			<div className='relative h-full w-full'>
				<img 
					src={snippyPointer} 
					alt="Snippy pointer" 
					className="absolute w-28 top-48 right-0"
				/>
			</div>
    </div>
    </>
  );
};

export default Sidebar;
