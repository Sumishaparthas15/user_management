import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify"; 

function Register() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value); // Sanitize input
    setFormData({ ...formData, [e.target.name]: sanitizedValue });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObject = new FormData();
    formDataObject.append("username", formData.username);
    formDataObject.append("email", formData.email);
    formDataObject.append("password", formData.password);
    formDataObject.append("password2", formData.password2);
    if (image) {
      formDataObject.append("profile_picture", image);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/app1/register/", formDataObject, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      setEmail(formData.email);
      setShowOTPModal(true);
    } catch (error) {
      console.error(error.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/app1/verify-otp/", { email, otp });
      console.log(response.data);
      alert("OTP Verified Successfully. You can now log in.");
      setShowOTPModal(false);
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || "OTP verification failed");
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.heading}>Register</h2>

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Username:</label>
          <input type="text" name="username" style={styles.input} onChange={handleChange} required />

          <label style={styles.label}>Email:</label>
          <input type="email" name="email" style={styles.input} onChange={handleChange} required />

          <label style={styles.label}>Password:</label>
          <input type="password" name="password" style={styles.input} onChange={handleChange} required />

          <label style={styles.label}>Confirm Password:</label>
          <input type="password" name="password2" style={styles.input} onChange={handleChange} required />

          <label style={styles.label}>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?
          <button type="button" style={styles.loginButton} onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>

      {showOTPModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.heading}>Verify OTP</h2>
            <p style={styles.modalText}>Enter the OTP sent to your email</p>
            <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} style={styles.input} placeholder="Enter OTP" required />
            <button onClick={handleOTPSubmit} style={styles.button}>Verify OTP</button>
          </div>
        </div>
      )}
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
  registerBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    width: "350px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
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

export default Register;
