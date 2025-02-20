import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ScheduledEmails from "./ScheduledEmails";

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
        const response = await axios.get("http://127.0.0.1:8000/app1/profile/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

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
      const response = await axios.post("http://127.0.0.1:8000/app1/refresh/", {
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
      await axios.post("http://127.0.0.1:8000/app1/logout/", { refresh_token: refreshToken });

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
            <h2 style={styles.heading}>Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => navigate('/schedule_emails')}style={styles.button}>ScheduleEmail</button>    <br></br>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
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
    width: "30%",
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    marginRight: "20px",
  },
  emailBox: {
    width: "40%",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#f00",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Profile;
