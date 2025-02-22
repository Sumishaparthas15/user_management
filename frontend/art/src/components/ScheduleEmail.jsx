import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import baseURL from "../config";

const ScheduleEmail = () => {
    const navigate = useNavigate();
    const [emailData, setEmailData] = useState({
        recipient_email: '',
        subject: '',
        body: '',
        scheduled_time: '',
    });

    const handleChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
        console.log(`Field Updated: ${e.target.name} = ${e.target.value}`);
    };

    const getAccessToken = async () => {
        let accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // If access token is missing or expired, refresh it
        if (!accessToken || isTokenExpired(accessToken)) {
            try {
                console.log("Access token expired, refreshing...");
                const response = await axios.post(`${baseURL}/app1/refresh/`, {
                    refresh: refreshToken,
                });
                accessToken = response.data.access;
                localStorage.setItem('access_token', accessToken);
            } catch (error) {
                console.error("Token refresh failed:", error.response?.data);
                toast.error("Session expired. Please log in again.");
                return null;
            }
        }
        return accessToken;
    };

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now(); // Compare expiration time
        } catch (error) {
            console.error("Invalid token format:", error);
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked!");

        const token = await getAccessToken();
        if (!token) {
            toast.error("User is not authenticated. Please log in.");
            return;
        }

        try {
            console.log("Token found:", token);

            // Convert scheduled_time to correct format
            console.log("Original scheduled_time:", emailData.scheduled_time);
            const formattedData = { ...emailData, scheduled_time: new Date(emailData.scheduled_time).toISOString() };
            console.log("Formatted Data:", formattedData);

            const response = await axios.post(
                `${baseURL}/app1/schedule-email/`,
                formattedData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Response:", response.data);
            alert("Email Scheduled Successfully!");
            navigate('/profile');
            toast.success("Email Scheduled Successfully!");
        } catch (error) {
            console.error("Error Response:", error.response?.data);
            toast.error(error.response?.data?.detail || "Error scheduling email.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.heading}>Schedule Email</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputContainer}>
                        <input type="email" name="recipient_email" placeholder="Recipient Email" style={styles.input} onChange={handleChange} required />
                    </div>
                    <div style={styles.inputContainer}>
                        <input type="text" name="subject" placeholder="Subject" style={styles.input} onChange={handleChange} required />
                    </div>
                    <div style={styles.inputContainer}>
                        <textarea name="body" placeholder="Body" style={styles.textarea} onChange={handleChange} required />
                    </div>
                    <div style={styles.inputContainer}>
                        <input type="datetime-local" name="scheduled_time" style={styles.input} onChange={handleChange} required />
                    </div>
                    <button type="submit" style={styles.button} onClick={() => console.log("Button clickeddddd!")}>
                        Schedule Email
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'black',
    },
    box: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        width: '500px',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: 'black',
    },
    inputContainer: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid black',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid black',
        borderRadius: '5px',
        fontSize: '16px',
        minHeight: '100px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    }
};

export default ScheduleEmail;
