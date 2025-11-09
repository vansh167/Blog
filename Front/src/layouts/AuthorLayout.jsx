import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/SideBar';
import './AuthorLayout.css';

const AuthorLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthorLayout;
