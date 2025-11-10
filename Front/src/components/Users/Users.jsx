import React, { useEffect, useState } from 'react';
import './Users.css';
import AuthorLayout from '../AuthorLayout/AuthorLayout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name'); // default sort by name
  const [sortOrder, setSortOrder] = useState('asc'); // asc/desc
  const [filterStatus, setFilterStatus] = useState('all'); // all/active/inactive

  const usersPerPage = 8;

  // Fetch users on mount
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
          ...(token && { Authorization: `Bearer ${token}` }),
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
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeleting(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        alert(`❌ ${data.message || 'Failed to delete user'}`);
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('❌ Server error. Try again later.');
    } finally {
      setDeleting(null);
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    let valA = a[sortField] ?? '';
    let valB = b[sortField] ?? '';

    if (sortField === 'watchTime') return sortOrder === 'asc' ? valA - valB : valB - valA;
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Filter users
  const filteredUsers = sortedUsers.filter((u) => {
    if (filterStatus === 'active') return u.isActive !== false;
    if (filterStatus === 'inactive') return u.isActive === false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive !== false).length;
  const totalWatchTime = users.reduce((sum, u) => sum + (u.watchTime || 0), 0);

  const formatWatchTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const maxWatchTime = Math.max(...users.map((u) => u.watchTime || 0));

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
            <div className="stat-card glass watch-time">
              <h3>Total Watch Time</h3>
              <p>{formatWatchTime(totalWatchTime)}</p>
            </div>
          </div>

          <div className="filters">
            <label>
              Filter:
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </label>
          </div>
        </div>

        {loading && <p className="loading">Loading users…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="users-grid">
              {currentUsers.length === 0 && <div className="no-users">No users found.</div>}
              {currentUsers.map((u) => (
                <div
                  className={`user-card glass ${u.watchTime === maxWatchTime ? 'top-watcher' : ''}`}
                  key={u._id}
                >
                  <div className="user-info">
                    <div className="user-avatar">{u.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div>
                      <strong className="user-name">{u.name}</strong>
                      <p className="user-email">{u.email}</p>
                      <p className="user-watchtime">Watch Time: {formatWatchTime(u.watchTime || 0)}</p>
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

            {/* Sorting */}
            <div className="sort-controls">
              {['name', 'email', 'watchTime'].map((field) => (
                <span key={field} onClick={() => handleSort(field)}>
                  Sort by {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                  {sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </span>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
