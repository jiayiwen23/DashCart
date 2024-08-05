import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RequireAuth = ({ children }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div>
        <button
          onClick={() => loginWithRedirect()}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
      >
        Log in
        </button>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
