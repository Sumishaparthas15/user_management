import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ScheduledEmails from "./ScheduledEmails";
import baseURL from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/app1/profile/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("User Data:", response.data); // Debugging
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        handleRefreshToken();
      }
    };

    fetchUser();
  }, [navigate]);

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.post(`${baseURL}/app1/refresh/`, {
        refresh: refreshToken,
      });

      localStorage.setItem("access_token", response.data.access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      window.location.reload();
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      await axios.post(`${baseURL}/app1/logout/`, { refresh_token: refreshToken });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        {user ? (
          <>
            {/* First Row: Profile Image & User Info */}
            <div style={styles.profileHeader}>
              <img 
                src={user.profile_picture || "https://via.placeholder.com/150"} 
                alt="Profile" 
                style={styles.profileImage}
              />
              <div style={styles.userInfo}>
                <h2 style={styles.heading}>{user.username}</h2>
                <p style={styles.email}><strong>Email:</strong> {user.email}</p>
              </div>
            </div>

            {/* Second Row: Buttons */}
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={() => navigate("/update_profile")}>
                Update Profile
              </button>
              <button style={styles.button} onClick={() => navigate("/schedule_emails")}>
                Schedule Email
              </button>
              <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      
      <div style={styles.emailBox}>
        <ScheduledEmails />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",  // Full viewport width
    height: "100vh", // Full viewport height
    backgroundColor: "black",
    color: "white",
  },
  profileBox: {
    width: "40%",
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "20px",
    borderBottom: "1px solid #555",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white",
  },
  userInfo: {
    textAlign: "left",
    marginLeft: "20px",
    flex: 1,
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  email: {
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  logoutButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#f00",
    color: "white",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  emailBox: {
    width: "40%",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    marginLeft: "20px",
  },
};

export default Profile;