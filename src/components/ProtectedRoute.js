import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);
  
  // If not authenticated, redirect to login with the current path for redirecting back after login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={`/login?redirect=${location.pathname}${location.search}`} 
        replace 
      />
    );
  }
  
  return children;
};

export default ProtectedRoute;