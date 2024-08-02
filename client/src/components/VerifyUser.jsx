import { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      try {
        console.log("API URL:", process.env.REACT_APP_API_URL);
        console.log("Starting user verification...");

        // Make a call to our API to verify the user in our database, if it doesn't exist we'll insert it into our database
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/verify-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Check if the response is OK before parsing JSON
        if (!response.ok) {
          throw new Error("Failed to verify user");
        }

        const user = await response.json();

        // Log the received user data for debugging
        console.log("Verified user data:", user);

        // Redirect here to where the user should go after verifying their account
        if (user?.auth0Id) {
          navigate("/"); // Update this path based on your application's routing
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    }

    if (accessToken) {
      verifyUser();
    }
  }, [accessToken, navigate]);

  return (
    <div className="loading">
      <p>Loading</p>{" "}
    </div>
  );
}
