import React, { useEffect, useState } from 'react';
import './Users.css';
import AuthorLayout from '../AuthorLayout/AuthorLayout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.status === 401) {
          setError('Not authorized. Please login.');
          setUsers([]);
        } else if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || 'Failed to load users');
        } else {
          const data = await res.json();
          setUsers(data || []);
        }
      } catch (err) {
        console.error('Fetch users error:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AuthorLayout>
      <div className="users-page">
        <h1>Users</h1>
        {loading && <p>Loading users…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div className="users-list">
            {users.length === 0 && <div>No users found.</div>}
            {users.map((u) => (
              <div className="user-card" key={u._id}>
                <strong>{u.name}</strong> — {u.email}
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthorLayout>
  );
};

export default Users;
