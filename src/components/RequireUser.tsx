
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';

const RequireUser = () => {
  const [user] = useLocalStorage('focusflow-user', null);
  const navigate = useNavigate();
  
  // Redirect to landing page if no user info is found
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default RequireUser;
