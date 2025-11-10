import React, { useEffect, useState } from 'react';
import './Request.css';
import AuthorLayout from '../AuthorLayout/AuthorLayout';

const Request = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/requests', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Failed to load requests');
            } else {
                const data = await res.json();
                setRequests(data);
            }
        } catch (err) {
            console.error('Fetch requests error:', err);
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setProcessing(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/requests/${id}/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.message || `Failed to ${action} request`);
            } else {
                await fetchRequests(); // refresh list
            }
        } catch (err) {
            console.error(`Error ${action} request:`, err);
            setError(`Error ${action} request`);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <AuthorLayout>
            <div className="requests-page">
                <h1>📝 User Access Requests</h1>
                <p className="subtitle">Approve or reject new user signup requests.</p>

                {loading && <p className="loading">Loading requests…</p>}
                {error && <p className="error">{error}</p>}

                {!loading && requests.length === 0 && (
                    <div className="no-requests">No pending requests 🎉</div>
                )}

                <div className="requests-grid">
                    {requests.map((req) => (
                        <div key={req._id} className="request-card glass">
                            <div>
                                <h3>{req.name}</h3>
                                <p>{req.email}</p>
                                <span className="status">Pending</span>
                            </div>

                            <div className="actions">
                                <button
                                    className="accept-btn"
                                    disabled={processing === req._id}
                                    onClick={() => handleAction(req._id, 'accept')}
                                >
                                    ✅ Accept
                                </button>
                                <button
                                    className="reject-btn"
                                    disabled={processing === req._id}
                                    onClick={() => handleAction(req._id, 'reject')}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthorLayout>
    );
};

export default Request;
