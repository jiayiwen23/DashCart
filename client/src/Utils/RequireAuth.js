import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RequireAuth = ({ children }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={loginWithRedirect}>Login</button>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
