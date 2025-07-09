
import React from 'react';
import SelectRegionPage from './component/useronbording/select_your_region';
import SelectCollegePage from './component/useronbording/select_your_college';
import VerifyEmailPage from './component/useronbording/email_validation';
import OtpVerificationPage from './component/useronbording/otp_page';
import NameDobGenderPage from './component/useronbording/name_dob_gender_page'
import CourseYearBranchPage from './component/useronbording/cource_year_grade';
import InterestPage from './component/useronbording/InterestPage';
import Prompt from './component/useronbording/Prompt';
import RelationshipStatusPage from './component/useronbording/RelationshipStatus';



function App() {
  return (
    <div>
      <SelectRegionPage />
      <SelectCollegePage />
      <VerifyEmailPage /> 
      <OtpVerificationPage />
      <NameDobGenderPage />
      <CourseYearBranchPage />
      <InterestPage />
      <Prompt />
      <RelationshipStatusPage />

      {/* Uncomment the component you want to render */}

      
    </div>
  );
}

export default App;
