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
import Home from "./component/Home_page/Home";
import Login from "./component/signinPage/Login";
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
import SelectTagPage from "./component/mix/select_tag_page";
import CommentTree from "./component/mix/comments_page";
import CreateNetworkWrapper from "./component/creatingNetwork/CreateNetworkWrapper";
import CommunityPage from "./component/creatingNetwork/Community_page";
import MobileCreateNetwork1 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_1";
import MobileCreateNetwork2 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_2";
import MobileCreateNetwork3 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_3";
function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Automatically decide landing page */}
        <Route path="/" element={<LandingRouter />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/login" element={<Login />} />

        {/* need to be routed */} 
        <Route path="/home" element={<Home />} />
        <Route path="/myscreen" element={<MyScreenPage/>}/>
        <Route path="/findem" element={<FindEm />} />
        <Route path="/emresult" element={<EmResult />} />
        <Route path="/bouquetprompt" element={<BouquetPrompt />} />
        <Route path="/referalfeature" element={<ReferalFeature />} />
        <Route path="/bouquetfinalactivity" element={<BouquetFinalActivity />} />
        <Route path="/someonesaidthat" element={<SomeoneSaidThatPage />} />
        <Route path="/realhappyness" element={<RealHappynessPage />} />
        <Route path="/regrets" element={<Regrets />} />
        <Route path="/wannahide" element={<WannaHide />} />
        <Route path="/selecttag" element={<SelectTagPage />} />
        <Route path="/comments" element={<CommentTree />} />
        <Route path="/createnetworkwrapper" element={<CreateNetworkWrapper />} />
        <Route path="/communitypage" element={<CommunityPage />} />
        <Route path="/mobile_createnetwork_1" element={<MobileCreateNetwork1 />} />
<Route path="/mobile_createnetwork_2" element={<MobileCreateNetwork2 />} />
<Route path="/mobile_createnetwork_3" element={<MobileCreateNetwork3 />} />


        {/* User Onboarding Routes */}
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
