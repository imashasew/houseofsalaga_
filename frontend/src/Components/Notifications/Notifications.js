import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../Sidebar/Sidebar'; // ✅ import sidebar
import './Notifications.css';

export default function Notifications() {
  return (
    <>
      <Header />

      <div className="dashboard-layout">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content on the right */}
        <div className="notifications-page">
         
          <h2>Notifications</h2>
          <p className="notifications-empty">You have no new notifications.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
