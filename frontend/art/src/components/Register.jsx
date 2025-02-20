import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/app1/register/', formData);
  //     console.log(response.data);
  //     setEmail(formData.email); // Store email for OTP verification
  //     setShowOTPModal(true); // Show OTP verification modal
  //   } catch (error) {
  //     console.error(error.response?.data || 'Registration failed');
  //   }
  // };
  const handleRegister = async (e) => {
    e.preventDefault();
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
            headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(response.data);
        setEmail(formData.email);
        setShowOTPModal(true);
    } catch (error) {
        console.error(error.response?.data || "Registration failed");
    }
};


  const handleOTPSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/app1/verify-otp/', { email, otp });
      console.log(response.data);
      alert("OTP Verified Successfully. You can now log in.");
      setShowOTPModal(false);
      navigate('/login'); // Navigate to login after OTP verification
    } catch (error) {
      console.error(error.response?.data || 'OTP verification failed');
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.heading}>Register</h2>

        <form onSubmit={handleRegister}>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.label}>Username:</td>
                <td>
                  <input 
                    type="text" 
                    name="username" 
                    style={styles.input} 
                    onChange={handleChange} 
                    required 
                  />
                </td>
              </tr>
              <tr>
                <td style={styles.label}>Email:</td>
                <td>
                  <input 
                    type="email" 
                    name="email" 
                    style={styles.input} 
                    onChange={handleChange} 
                    required 
                  />
                </td>
              </tr>
              <tr>
                <td style={styles.label}>Password:</td>
                <td>
                  <input 
                    type="password" 
                    name="password" 
                    style={styles.input} 
                    onChange={handleChange} 
                    required 
                  />
                </td>
              </tr>
              <tr>
                <td style={styles.label}>Confirm Password:</td>
                <td>
                  <input 
                    type="password" 
                    name="password2" 
                    style={styles.input} 
                    onChange={handleChange} 
                    required 
                  />
                </td>
              </tr>
              <tr>
                  <td style={styles.label}>Profile Picture:</td>
                  <td>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImage(e.target.files[0])} 
                      style={styles.input} 
                    />
                  </td>
                </tr>

            </tbody>
          </table>

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={styles.loginText}>
          Already have an account?  
          <button 
            type="button" 
            style={styles.loginButton} 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.heading}>Verify OTP</h2>
            <p style={styles.modalText}>Enter the OTP sent to your email</p>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
              placeholder="Enter OTP"
              required
            />
            <button onClick={handleOTPSubmit} style={styles.button}>Verify OTP</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Internal CSS
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'black',
  },
  registerBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    width: '350px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'black',
  },
  table: {
    width: '100%',
    marginBottom: '15px',
  },
  label: {
    textAlign: 'right',
    paddingRight: '10px',
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid black',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loginText: {
    marginTop: '15px',
    fontSize: '14px',
    color: 'black',
  },
  loginButton: {
    background: 'none',
    border: 'none',
    color: 'blue',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '300px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  modalText: {
    fontSize: '16px',
    color: 'black',
    marginBottom: '15px',
  },
};

export default Register;
