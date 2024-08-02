import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import VerifyUser from "./Utils/VerifyUser";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import { requestedScopes } from "./constants";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN}
          clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: `${window.location.origin}/verify-user`,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(" "),
          }}
        >
          <AuthTokenProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify-user" element={<VerifyUser />} />
              </Routes>
            </BrowserRouter>
          </AuthTokenProvider>
        </Auth0Provider>
      </React.StrictMode>
    </div>
  );
};

export default App;
