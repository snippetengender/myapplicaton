// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SelectRegionPage from './component/useronbording/select_your_region';
import SelectCollegePage from './component/useronbording/select_your_college';
import VerifyEmailPage from './component/useronbording/email_validation';
import OtpVerificationPage from './component/useronbording/otp_page';
import NameDobGenderPage from './component/useronbording/name_dob_gender_page';
import CourseYearBranchPage from './component/useronbording/cource_year_grade';
import InterestPage from './component/useronbording/InterestPage';
import Prompt from './component/useronbording/Prompt';
import RelationshipStatusPage from './component/useronbording/RelationshipStatus';
import GoogleLogin from './component/useronbording/googlelogin';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Redirect root to onboarding */}
          <Route path="/" element={<Navigate to="/useronboarding/google-login" replace />} />
          
          {/* Onboarding routes with nested structure */}
          <Route path="useronboarding">
            <Route path="google-login" element={<GoogleLogin />} />
            <Route path="select-region" element={<SelectRegionPage />} />
            <Route path="select-college" element={<SelectCollegePage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="otp-verification" element={<OtpVerificationPage />} />
            <Route path="name-dob-gender" element={<NameDobGenderPage />} />
            <Route path="course-year-branch" element={<CourseYearBranchPage />} />
            <Route path="interests" element={<InterestPage />} />
            <Route path="prompt" element={<Prompt />} />
            <Route path="relationship-status" element={<RelationshipStatusPage />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/useronboarding/google-login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;