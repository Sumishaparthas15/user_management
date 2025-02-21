import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value); // Sanitize input
    setFormData({ ...formData, [e.target.name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/app1/login/', formData, {
        headers: {
          'Content-Type': 'application/json',  // Secure headers
        },
      });

      // Extract access and refresh tokens correctly
      const accessToken = response.data.tokens?.access;
      const refreshToken = response.data.tokens?.refresh;

      if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        alert("Login Successful!");
        navigate('/profile');
      } else {
        alert("Invalid login response");
      }
    } catch (error) {
      console.error(error.response?.data || 'Login failed');
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Login</h2>

        <form onSubmit={handleSubmit}>
          <table style={styles.table}>
            <tbody>
              {/* Email Row */}
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

              {/* Password Row */}
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
            </tbody>
          </table>

          {/* Login Button */}
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {/* Sign Up Link */}
        <p style={styles.signupText}>
          Don't have an account?  
          <button 
            type="button" 
            style={styles.signupButton} 
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </p>
      </div>
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
  loginBox: {
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
  signupText: {
    marginTop: '15px',
    fontSize: '14px',
    color: 'black',
  },
  signupButton: {
    background: 'none',
    border: 'none',
    color: 'blue',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginLeft: '5px',
  }
};

export default Login;
