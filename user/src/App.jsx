import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingRouter from "./component/signinPage/LandingRouter";
import Lobby from "./component/signinPage/Lobby";
import GoogleLoginPage from "./component/signinPage/GoogleLoginPage.jsx";

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
import BirthdayEdit from "./component/useronbording/BirthdayEdit";

// Auth Wrapper
import ProtectedRoute from "./component/useronbording/ProtectedRoute";

// Authenticated Pages
import Home from "./component/Home_page/Home";
import AboutUs from "./component/Home_page/AboutUs";
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
import SearchNetworkPage from "./component/Home_page/SearchNetwork.jsx";
import SelectTagPage from "./component/mix/select_tag_page";
import CommentTree from "./component/mix/comments_page";
import NetworkSelectPage from "./component/mix/networkSelectMobile.jsx";
import CreateNetworkWrapper from "./component/creatingNetwork/CreateNetworkWrapper";
import CommunityPage from "./component/creatingNetwork/Community_page";
import MobileCreateNetwork1 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_1";
import MobileCreateNetwork2 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_2";
import MobileCreateNetwork3 from "./component/creatingNetwork/MobileCreateNetworkWrapper/mobile_createnetwork_3";
import LowkeyProfile from "./component/lowkey/LowKey.jsx";
import ManageNetworkScreen from "./component/Admin/manage_network/manage_network_page";
import NetworkCommunityPage from "./component/Admin/network_community/network_community_page";
import EditNetworkPage from "./component/Admin/Edit_network/edit_network_page";
import DitchNetworkPage from "./component/Admin/ditch_network/ditch_network_page";
import FinalPage from "./component/Admin/final_page";
import AddClubs from "./component/addClubs/mobileAddClubs";
import RegisterClubPage from "./component/addClubs/mobileRegisterClub";
import ClubApproval from "./component/Admin/clubApproval/mobileClubApproval";
import ClubSignInPage from "./component/addClubs/mobileClubSignInPage";
import ClubAdminPage from "./component/addClubs/mobileClubAdminPage";
import CreateEventPage from "./component/addClubs/mobileAddEventPage";
import MobileNetworkAdmin from "./component/creatingNetwork/communitypage/MobileCommunityAdmin.jsx";
import AlreadyRegisteredPage from "./component/signinPage/AlreadyRegisteredPage.jsx";
import DomainErrorPage from "./component/signinPage/DomainNotAllowed.jsx";
import ProfileOwner from "./component/useronbording/UserProfileOwner.jsx";
import LowKeyProfilePage from "./component/lowkey/LowKeyProfile.jsx";
import ProfileOwnerRoute from "./component/useronbording/ProfileOwnerRoute.jsx";
import AboutUsWrapper from "./component/Home_page/AboutUsWrapper.jsx";
import LobbyWrapper from "./component/signinPage/LobbyWrapper.jsx";
import EditProfile from "./component/useronbording/EditProfile.jsx";
// Smarket
import Smarket from "./component/smarket/Smarket.jsx"
import Item_Info from "./component/smarket/smarket_pages/Items_info.jsx"
import Selling_now from "./component/smarket/smarket_pages/Selling_now.jsx"
import Smaps from "./component/smaps/Smaps.jsx"
import Image_Edits from "./component/mix/image_edit.jsx"

// Smaps
import All_events from "./component/smaps/smap_pages/All_events.jsx";
import Add_Events from "./component/smaps/smap_pages/Add_Events.jsx";
import Add_location from "./component/smaps/smap_pages/Add_location.jsx";
import Event_Info from "./component/smaps/smap_pages/Event_Info.jsx";


function App() {
  // Block desktop: allow only widths <= 768px
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen w-full bg-black text-[#E7E9EA] flex items-center justify-center text-center p-6">
        <p className="text-lg font-semibold">
          Use your mobile phone to view the app because while we developers are busy wrestling with the desktop design, all your friends are already ranting on the mobile version.
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingRouter />} />
        <Route path="/lobby" element={<LobbyWrapper />} />
        {/* About Us route */}
        {/* <Route path="/about-us" element={<AboutUs/>}/> */}
        <Route path="/about-us" element={<AboutUsWrapper />} />
        {/* Onboarding */}
        <Route
          path="/useronboarding/google-login"
          element={<GoogleLoginPage />}
        />
        <Route path="/domain-not-allowed" element={<DomainErrorPage />} />
        <Route
          path="/auth/already-registered"
          element={<AlreadyRegisteredPage />}
        />{" "}
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
          path="/useronboarding/birthday-edit"
          element={<BirthdayEdit />}
        />
        <Route path="/user-profile/:userId" element={<UserProfilePage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProfileOwnerRoute />}>
            <Route
              path="/user-profile-owner/:userId"
              element={<ProfileOwner />}
            />
          </Route>

          <Route path="/useronboarding/user-name" element={<UsernamePage />} />
          <Route path="useronboarding/edit-profile" element={<EditProfile />} />
          <Route
            path="/lowkey-profile/:userId"
            element={<LowKeyProfilePage />}
          />

          <Route path="/selecttag/:id" element={<SelectTagPage />} />
          <Route path="/s-edits" element={<Image_Edits />} />
          <Route path="/comments/:mixId" element={<CommentTree />} />
          <Route
            path="/createnetworkwrapper"
            element={<CreateNetworkWrapper />}
          />
          <Route path="/communitypage/:id" element={<CommunityPage />} />
          <Route
            path="/mobile_createnetwork_1"
            element={<MobileCreateNetwork1 />}
          />
          <Route
            path="/mobile_createnetwork_2"
            element={<MobileCreateNetwork2 />}
          />
          <Route
            path="/mobile_createnetwork_3"
            element={<MobileCreateNetwork3 />}
          />
          <Route path="/managenetwork" element={<ManageNetworkScreen />} />
          <Route path="/networkcommunity" element={<NetworkCommunityPage />} />
          <Route path="/networkadmin/:id" element={<MobileNetworkAdmin />} />
          { }
          <Route
            path="/communitypage/:id/editnetwork"
            element={<EditNetworkPage />}
          />
          <Route
            path="/communitypage/:id/ditchnetwork"
            element={<DitchNetworkPage />}
          />
          <Route path="/communitypage/:id/finalpage" element={<FinalPage />} />
          <Route path="/addclubs" element={<AddClubs />} />
          <Route path="/registerclub" element={<RegisterClubPage />} />
          <Route path="/clubapproval" element={<ClubApproval />} />
          <Route path="/club-signin" element={<ClubSignInPage />} />
          <Route path="/club-admin" element={<ClubAdminPage />} />
          <Route path="/add-event" element={<CreateEventPage />} />
          <Route path="/select-network" element={<NetworkSelectPage />} />
          <Route path="/lowkey" element={<LowkeyProfile />} />
          <Route path="/search-network" element={<SearchNetworkPage />} />
          {/* Authenticated routes */}
          {/* Protected routes */}
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
        {/* Smarket */}
        <Route path="/smarket" element={<Smarket/>} />
        <Route path="/smarket/:listingId" element={<Item_Info/>} />
        <Route path="/smarket/selling_now" element={<Selling_now/>} />

        {/* Smaps or Events */}
        <Route path="/events" element={<Smaps />} />
        <Route path="/events/all_events" element={<All_events />} />
        <Route path="/events/add_events" element={<Add_Events />} />
        <Route path="/events/add_location" element={<Add_location />} />
        <Route path="/events/event-info"  element={<Event_Info/>} />

        {/* Fallback */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
