
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RequireUser = () => {
  const [user] = useLocalStorage('focusflow-user', null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is authenticated with Supabase
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        // If there's an error or no session, redirect to landing page
        toast.error("Please sign in to access this page");
        navigate('/', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Redirect to landing page if no user info is found
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default RequireUser;
