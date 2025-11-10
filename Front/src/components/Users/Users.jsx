import React, { useEffect, useState } from 'react';
import './Users.css';
import AuthorLayout from '../AuthorLayout/AuthorLayout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

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
  // ---------------- DELETE USER FUNCTION ----------------
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ User deleted successfully");
        // Optionally, update local state to remove the user from UI
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        alert(`❌ ${data.message || "Failed to delete user"}`);
      }
    } catch (err) {
      console.error("Delete user error:", err);
      alert("❌ Server error. Try again later.");
    }
  };


  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive !== false).length;

  return (
    <AuthorLayout>
      <div className="users-page">
        <div className="header-section">
          <h1>👥 User Management Dashboard</h1>
          <p className="subtitle">Manage your platform users effortlessly.</p>

          <div className="stats-container">
            <div className="stat-card glass">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <div className="stat-card glass active">
              <h3>Active Users</h3>
              <p>{activeUsers}</p>
            </div>
          </div>
        </div>

        {loading && <p className="loading">Loading users…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="users-grid">
              {currentUsers.length === 0 && <div className="no-users">No users found.</div>}
              {currentUsers.map((u) => (
                <div className="user-card glass" key={u._id}>
                  <div className="user-info">
                    <div className="user-avatar">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong className="user-name">{u.name}</strong>
                      <p className="user-email">{u.email}</p>
                    </div>
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

            {users.length > usersPerPage && (
              <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                  ⬅ Previous
                </button>
                <span>
                  Page <strong>{currentPage}</strong> of {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                  Next ➡
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AuthorLayout>
  );
};

export default Users;
