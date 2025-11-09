import React from 'react';
import Sidebar from '../Sidebar/SideBar';
import './AuthorLayout.css';

const AuthorLayout = ({ children }) => {
  return (
    <div className="author-layout">
      <Sidebar />
      <main className="author-content">
        {children}
      </main>
    </div>
  );
};

export default AuthorLayout;
