import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingRouter from "./component/signinPage/LandingRouter";
import SelectRegionPage from "./component/useronbording/select_your_region";
import SelectCollegePage from "./component/useronbording/select_your_college";
import VerifyEmailPage from "./component/useronbording/email_validation";
import OtpVerificationPage from "./component/useronbording/otp_page";
import NameDobGenderPage from "./component/useronbording/name_dob_gender_page";
import CourseYearBranchPage from "./component/useronbording/cource_year_grade";
import InterestPage from "./component/useronbording/InterestPage";
import Prompt from "./component/useronbording/Prompt";
import RelationshipStatusPage from "./component/useronbording/RelationshipStatus";
import GoogleLogin from "./component/useronbording/Googlelogin";
import ProtectedRoute from "./component/useronbording/ProtectedRoute";
import UsernamePage from "./component/useronbording/UsernamePage";
import UserProfilePage from "./component/useronbording/UserProfilePage";
import Lobby from "./component/signinPage/Lobby";
import Home from "./component/bouquet/Home";
import Login from "./component/signinPage/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Automatically decide landing page */}
        <Route path="/" element={<LandingRouter />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="useronboarding">
          <Route path="google-login" element={<GoogleLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="select-region" element={<SelectRegionPage />} />
            <Route path="select-college" element={<SelectCollegePage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="otp-verification" element={<OtpVerificationPage />} />
            <Route path="name-dob-gender" element={<NameDobGenderPage />} />
            <Route
              path="course-year-branch"
              element={<CourseYearBranchPage />}
            />
            <Route path="interests" element={<InterestPage />} />
            <Route path="prompt" element={<Prompt />} />
            <Route
              path="relationship-status"
              element={<RelationshipStatusPage />}
            />
            <Route path="user-profile" element={<UserProfilePage />} />
            <Route path="user-name" element={<UsernamePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
