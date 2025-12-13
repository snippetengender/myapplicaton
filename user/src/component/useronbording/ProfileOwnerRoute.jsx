// src/components/ProfileOwnerRoute.jsx
import React from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';

const ProfileOwnerRoute = () => {
  const { userId } = useParams();
  const loggedInUserId = localStorage.getItem('user_id');

  // Check if the user is the owner
  const isOwner = userId === loggedInUserId;

  // If they are the owner, render the actual page content via <Outlet />.
  // This is the main fix for the infinite loop.
  if (isOwner) {
    return <Outlet />;
  }

  // If they are NOT the owner, redirect them to a safe, public page.
  // This could be the generic (non-owner) view of that user's profile, or the homepage.
  // This fixes the security error by using a correct path.
  return <Navigate to={`/user-profile/${userId}`} replace />;
};

export default ProfileOwnerRoute;