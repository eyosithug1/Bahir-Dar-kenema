import React, { useState } from 'react';
import ClientNavbar from './ClientNavbar';
import ClientFooter from './ClientFooter';

function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-bdk-bg">
      <ClientNavbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      <ClientFooter />
    </div>
  );
}

export default ClientLayout;
