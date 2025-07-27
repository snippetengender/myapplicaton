import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingRouter from "./component/signinPage/LandingRouter";
import Lobby from "./component/signinPage/Lobby";
import Login from "./component/signinPage/Login";

// Onboarding (Public)
import GoogleLogin from "./component/useronbording/Googlelogin";
import SelectRegionPage from "./component/useronbording/select_your_region";
import SelectCollegePage from "./component/useronbording/select_your_college";
import VerifyEmailPage from "./component/useronbording/email_validation";
import OtpVerificationPage from "./component/useronbording/otp_page";
import NameDobGenderPage from "./component/useronbording/name_dob_gender_page";
import CourseYearBranchPage from "./component/useronbording/cource_year_grade";
import InterestPage from "./component/useronbording/InterestPage";
import Prompt from "./component/useronbording/Prompt";
import RelationshipStatusPage from "./component/useronbording/RelationshipStatus";
import UserProfilePage from "./component/useronbording/UserProfilePage";
import UsernamePage from "./component/useronbording/UsernamePage";
import BouquetOutlet from "../Outlet/BouquetOutlet";
// Auth Wrapper
import ProtectedRoute from "./component/useronbording/ProtectedRoute";

// Authenticated Pages
import Home from "./component/bouquet/Home";
import MyScreenPage from "./component/bouquet/my_scree_page";
import FindEm from "./component/bouquet/find_em";
import EmResult from "./component/bouquet/em_result";
import BouquetPrompt from "./component/bouquet/bouquet_prompt";
import ReferalFeature from "./component/bouquet/referal_feature";
import BouquetFinalActivity from "./component/bouquet/final_activity";
import SomeoneSaidThatPage from "./component/bouquet/someone_said_that_page";
import RealHappynessPage from "./component/bouquet/real_happyness_page";
import Regrets from "./component/bouquet/regrets";
import WannaHide from "./component/bouquet/wanna_hide";
import SendBouquetPage from "./component/bouquet/my_scree_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingRouter />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/login" element={<Login />} />

        <Route path="/useronboarding/google-login" element={<GoogleLogin />} />
        <Route
          path="/useronboarding/select-region"
          element={<SelectRegionPage />}
        />
        <Route
          path="/useronboarding/select-college"
          element={<SelectCollegePage />}
        />
        <Route
          path="/useronboarding/verify-email"
          element={<VerifyEmailPage />}
        />
        <Route
          path="/useronboarding/otp-verification"
          element={<OtpVerificationPage />}
        />
        <Route
          path="/useronboarding/name-dob-gender"
          element={<NameDobGenderPage />}
        />
        <Route
          path="/useronboarding/course-year-branch"
          element={<CourseYearBranchPage />}
        />
        <Route path="/useronboarding/interests" element={<InterestPage />} />
        <Route path="/useronboarding/prompt" element={<Prompt />} />
        <Route
          path="/useronboarding/relationship-status"
          element={<RelationshipStatusPage />}
        />
        <Route
          path="/useronboarding/user-profile"
          element={<UserProfilePage />}
        />
        <Route path="/useronboarding/user-name" element={<UsernamePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />

          <Route path="/bouquet" element={<BouquetOutlet />}>
            <Route path="myscreen" element={<MyScreenPage />} />
            <Route path="sendbouquet" element={<SendBouquetPage />} />
            <Route path="findem" element={<FindEm />} />
            <Route path="emresult" element={<EmResult />} />
            <Route path="bouquetprompt" element={<BouquetPrompt />} />
            <Route path="referalfeature" element={<ReferalFeature />} />
            <Route
              path="bouquetfinalactivity"
              element={<BouquetFinalActivity />}
            />
            <Route path="someonesaidthat" element={<SomeoneSaidThatPage />} />
            <Route path="realhappyness" element={<RealHappynessPage />} />
            <Route path="regrets" element={<Regrets />} />
            <Route path="wannahide" element={<WannaHide />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
