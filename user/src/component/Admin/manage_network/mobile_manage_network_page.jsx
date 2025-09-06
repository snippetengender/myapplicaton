import React from 'react';
import { ArrowLeft } from 'lucide-react';
// Main component that renders the "Manage Network" screen
const ManageNetworkScreen = () => {

  // Styles are defined as JavaScript objects for a CSS-in-JS approach.
  const styles = {
    // The main container that simulates the mobile screen
    container: {
      backgroundColor: '#000000', // Black background as seen in the image
      color: '#FFFFFF', // White text color for contrast
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      height: '100vh', // Takes up the full height of the viewport
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box', // Ensures padding is included in the element's total width and height
    },
    // Header section containing the back arrow and the main title
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
    },
    // Style for the "Manage Network" title
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '6px', // Provides space between the back arrow and the title
    },
    // Style for the descriptive paragraph below the title
    description: {
      fontSize: '14px',
      color: '#B0B0B0', // A lighter gray for secondary text
      lineHeight: '1.5', // Improves readability
      marginBottom: '32px',
    },
    // Style for section sub-headings like "something"
    subheading: {
      fontSize: '14px',
      color: '#B0B0B0',
      textTransform: 'uppercase', // As seen in the design
      letterSpacing: '1px', // Spacing out letters for the uppercase style
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #333333', // The subtle separator line
    },
    // Style for the clickable list item ("establish network")
    networkItem: {
      display: 'flex',
      justifyContent: 'space-between', // Pushes the text and arrow to opposite ends
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid #333333', // Separator line for the list item
      cursor: 'pointer', // Indicates to the user that this is a clickable element
    },
    // Style for the text within the list item
    networkItemText: {
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <button>
            <ArrowLeft className="text-[#E7E9EA]" size={24} onClick={() => navigate("/home")} />
          </button>
        
      </div>
      <h1 style={styles.title}>Manage Network</h1>
     
      <p style={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
      </p>

      
     <div style={styles.networkItem}>
        <span style={styles.networkItemText}>something</span>
        
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.59003 16.59L13.17 12L8.59003 7.41L10 6L16 12L10 18L8.59003 16.59Z"
            fill="white"
          />
        </svg>
      </div>
      {/* Network Item */}
      <div style={styles.networkItem}>
        <span style={styles.networkItemText}>establish network (2/3)</span>
        
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.59003 16.59L13.17 12L8.59003 7.41L10 6L16 12L10 18L8.59003 16.59Z"
            fill="white"
          />
        </svg>
      </div>

    </div>
  );
};

export default ManageNetworkScreen;
