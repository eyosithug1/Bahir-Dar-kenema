import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-bdk-bg">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
