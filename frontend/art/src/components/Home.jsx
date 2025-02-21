import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.heading}>Welcome to Our Platform</h1>
        <p style={styles.subText}>Join us and explore the best features.</p>

        <button style={styles.button} onClick={() => navigate("/login")}>
          Sign In
        </button>
        <button style={styles.button} onClick={() => navigate("/register")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1a1a1a",
  },
  box: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    width: "350px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  },
  subText: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Home;
