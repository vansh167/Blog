import React, { useEffect, useState } from 'react';
import './Users.css';
import AuthorLayout from '../AuthorLayout/AuthorLayout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // track which user is being deleted

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    setDeleting(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401) {
        setError('Not authorized. Please login.');
      } else if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Failed to delete user');
      } else {
        // success — remove user from local state
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError('Error deleting user');
    } finally {
      setDeleting(null);
    }
  };

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
                <div>
                  <strong>{u.name}</strong> — {u.email}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(u._id)}
                  disabled={deleting === u._id}
                >
                  {deleting === u._id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthorLayout>
  );
};

export default Users;
