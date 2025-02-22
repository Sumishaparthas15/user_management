import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../config";

const ScheduledEmails = () => {
    const [emails, setEmails] = useState([]);
    const [editingEmail, setEditingEmail] = useState(null);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(`${baseURL}/app1/schedule_email/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmails(response.data);
        } catch (error) {
            console.error("Error fetching emails:", error);
            toast.error("Failed to load scheduled emails.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${baseURL}/app1/schedule-email/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Email deleted successfully.");
            fetchEmails();
        } catch (error) {
            console.error("Error deleting email:", error);
            toast.error("Failed to delete email.");
        }
    };

    const handleEdit = (email) => {
        setEditingEmail(email);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`${baseURL}/app1/schedule-email/${editingEmail.id}/`, editingEmail, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Email updated successfully.");
            setEditingEmail(null);
            fetchEmails();
        } catch (error) {
            console.error("Error updating email:", error);
            toast.error("Failed to update email.");
        }
    };

    return (
        <div style={styles.container}>
            
            <div style={styles.emailSection}>
                <h2 style={styles.heading}>Scheduled Emails</h2>
                {emails.length === 0 ? (
                    <p>No emails scheduled.</p>
                ) : (
                    <ul style={styles.emailList}>
                        {emails.map((email) => (
                            <li key={email.id} style={styles.emailItem}>
                                <div>
                                    <strong>{email.subject}</strong> to {email.recipient_email} at {new Date(email.scheduled_time).toLocaleString()}
                                    {email.is_sent ? <span style={styles.sent}> ✅ Sent</span> : <span style={styles.pending}> ⏳ Pending</span>}
                                </div>
                                <div>
                                    <button style={styles.button} onClick={() => handleEdit(email)}>Edit</button>
                                    <button style={styles.deleteButton} onClick={() => handleDelete(email.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {editingEmail && (
                    <div style={styles.editContainer}>
                        <h3>Edit Email</h3>
                        <input type="text" value={editingEmail.subject} onChange={(e) => setEditingEmail({ ...editingEmail, subject: e.target.value })} style={styles.input} />
                        <input type="email" value={editingEmail.recipient_email} onChange={(e) => setEditingEmail({ ...editingEmail, recipient_email: e.target.value })} style={styles.input} />
                        <textarea value={editingEmail.body} onChange={(e) => setEditingEmail({ ...editingEmail, body: e.target.value })} style={styles.input}></textarea>
                        <input type="datetime-local" value={editingEmail.scheduled_time} onChange={(e) => setEditingEmail({ ...editingEmail, scheduled_time: e.target.value })} style={styles.input} />
                        <button onClick={handleUpdate} style={styles.button}>Update</button>
                        <button onClick={() => setEditingEmail(null)} style={styles.deleteButton}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    
    
    emailSection: {
        width: "70%",
        backgroundColor: "#222",
        padding: "20px",
        borderRadius: "10px",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    emailList: {
        listStyleType: "none",
        padding: 0,
    },
    emailItem: {
        backgroundColor: "#333",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sent: {
        color: "green",
    },
    pending: {
        color: "orange",
    },
    button: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "10px",
    },
    deleteButton: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        border: "1px solid white",
        borderRadius: "5px",
        backgroundColor: "#444",
        color: "white",
    },
    editContainer: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#444",
        borderRadius: "10px",
    },
};

export default ScheduledEmails;
