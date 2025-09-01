import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

const LogoutNavLink = () => {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoggingOut(true); // Start loading
    dispatch(logoutUser()).then(() => {
      window.location.href = '/'; // Full reload to clear state
    });
  };

  return (
    <NavLink
      to="#logout"
      onClick={handleLogout}
      className={`flex items-center ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoggingOut ? (
        <Icon icon="line-md:loading-twotone-loop" width="24" height="24" className="mr-3 animate-spin" />
      ) : (
        <Icon icon="material-symbols:logout-rounded" width="24" height="24" className="mr-3" />
      )}
      <span className="font-medium">
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </span>
    </NavLink>
  );
};

export default LogoutNavLink;
